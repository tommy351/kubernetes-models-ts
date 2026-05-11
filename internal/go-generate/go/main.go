package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"os"
	"slices"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	openapiutil "k8s.io/kube-openapi/pkg/util"
	"sigs.k8s.io/controller-tools/pkg/crd"
	crdmarkers "sigs.k8s.io/controller-tools/pkg/crd/markers"
	"sigs.k8s.io/controller-tools/pkg/loader"
	"sigs.k8s.io/controller-tools/pkg/markers"
)

// resolveRootRef follows a chain of pure-$ref schemas (`type Alias Other`)
// starting at ident and returns a deep copy of the final non-ref schema,
// with all unqualified refs rewritten to the target package so the
// caller's refPackageAdder doesn't mis-qualify them against the alias
// package. Returns ok=false when ident's schema isn't a pure ref or the
// chain doesn't resolve.
func resolveRootRef(parser *crd.Parser, ident crd.TypeIdent) (extv1.JSONSchemaProps, bool) {
	cur, ok := parser.Schemata[ident]
	if !ok {
		return extv1.JSONSchemaProps{}, false
	}
	visited := map[crd.TypeIdent]bool{ident: true}
	curPkg := ident.Package
	resolved := false

	for cur.Ref != nil && cur.Type == "" && len(cur.Properties) == 0 && len(cur.AllOf) == 0 {
		typ, pkgName, err := crd.RefParts(*cur.Ref)
		if err != nil {
			return extv1.JSONSchemaProps{}, false
		}
		targetPkg := curPkg
		if pkgName != "" {
			targetPkg = curPkg.Imports()[pkgName]
		}
		if targetPkg == nil {
			return extv1.JSONSchemaProps{}, false
		}
		target := crd.TypeIdent{Package: targetPkg, Name: typ}
		if visited[target] {
			return extv1.JSONSchemaProps{}, false
		}
		visited[target] = true
		next, ok := parser.Schemata[target]
		if !ok {
			return extv1.JSONSchemaProps{}, false
		}
		cur = next
		curPkg = targetPkg
		resolved = true
	}

	if !resolved {
		return extv1.JSONSchemaProps{}, false
	}

	var copied extv1.JSONSchemaProps
	cur.DeepCopyInto(&copied)
	crd.EditSchema(&copied, &refPackageAdder{Fallback: curPkg.ID})
	return copied, true
}

func main() {
	flag.Parse()

	input := flag.Args()

	if len(input) == 0 {
		exitErr("input packages are required")
	}

	runner := &Runner{
		Input: input,
	}

	if err := runner.Run(); err != nil {
		exitErr("run failed: %v", err)
	}
}

func exitErr(format string, args ...any) {
	fmt.Fprintf(os.Stderr, format+"\n", args...)
	os.Exit(1)
}

type Runner struct {
	Input []string
}

func (r *Runner) Run() error {
	roots, err := loader.LoadRoots(r.Input...)
	if err != nil {
		return fmt.Errorf("load roots: %w", err)
	}

	registry := &markers.Registry{}

	if err := crdmarkers.Register(registry); err != nil {
		return fmt.Errorf("register crd markers: %w", err)
	}

	if err := registry.Define(enumMarker, markers.DescribesType, struct{}{}); err != nil {
		return fmt.Errorf("register enum marker: %w", err)
	}

	parser := &crd.Parser{
		Collector: &markers.Collector{Registry: registry},
		Checker:   &loader.TypeChecker{},
	}
	crd.AddKnownTypes(parser)

	for _, root := range roots {
		parser.NeedPackage(root)
	}

	metaV1 := crd.FindMetav1(roots)
	if metaV1 == nil {
		return errors.New("metav1 package not found")
	}

	kubeKinds := crd.FindKubeKinds(parser, metaV1)
	if len(kubeKinds) == 0 {
		return errors.New("kubernetes kinds not found")
	}

	pkgKinds := map[string][]string{}

	for _, kind := range kubeKinds {
		for pkg, gv := range parser.GroupVersions {
			if gv.Group != kind.Group {
				continue
			}

			for _, name := range []string{kind.Kind, kind.Kind + "List"} {
				if parser.LookupType(pkg, name) == nil {
					continue
				}

				id := crd.TypeIdent{
					Package: pkg,
					Name:    name,
				}
				parser.NeedSchemaFor(id)
				pkgKinds[pkg.ID] = append(pkgKinds[pkg.ID], name)
			}
		}
	}

	inlineSchemata := collectInlineEnums(parser, roots)
	addBuiltinInlines(inlineSchemata)

	output := Output{
		Schemata: map[string]extv1.JSONSchemaProps{},
		Packages: map[string]Package{},
		Roots:    make([]string, 0, len(roots)),
	}

	for _, root := range roots {
		output.Roots = append(output.Roots, openapiutil.ToRESTFriendlyName(root.ID))
	}

	for pkg, gv := range parser.GroupVersions {
		output.Packages[openapiutil.ToRESTFriendlyName(pkg.ID)] = Package{
			GoPath:  pkg.ID,
			Group:   gv.Group,
			Version: gv.Version,
			Kinds:   pkgKinds[pkg.ID],
		}
	}

	for id, schema := range parser.Schemata {
		gv := parser.GroupVersions[id.Package]

		// `type Alias Other` produces a pure-$ref schema. For root kinds,
		// inline the target so typeMetaReplacer can rewrite apiVersion/kind
		// for the alias's GV.
		var copied extv1.JSONSchemaProps
		inlined := false
		if slices.Contains(pkgKinds[id.Package.ID], id.Name) {
			copied, inlined = resolveRootRef(parser, id)
		}
		if !inlined {
			schema.DeepCopyInto(&copied)
		}

		crd.EditSchema(&copied, &typeMetaReplacer{
			APIVersion: gv.String(),
			Kind:       id.Name,
		})
		crd.EditSchema(&copied, &refPackageAdder{Fallback: id.Package.ID})
		// Inline refs to external `+enum` types — the TS side doesn't
		// emit standalone modules for them.
		crd.EditSchema(&copied, &refInliner{Schemata: inlineSchemata})
		crd.EditSchema(&copied, &refNormalizer{})

		output.Schemata[openapiutil.ToRESTFriendlyName(id.Package.ID+"."+id.Name)] = copied
	}

	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")

	if err := encoder.Encode(&output); err != nil {
		return fmt.Errorf("encode output: %w", err)
	}

	return nil
}
