package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"os"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/crd"
	crdmarkers "sigs.k8s.io/controller-tools/pkg/crd/markers"
	"sigs.k8s.io/controller-tools/pkg/loader"
	"sigs.k8s.io/controller-tools/pkg/markers"
)

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

func stringEnum(values ...string) extv1.JSONSchemaProps {
	enum := make([]extv1.JSON, len(values))
	for i, v := range values {
		raw, _ := json.Marshal(v)
		enum[i] = extv1.JSON{Raw: raw}
	}
	return extv1.JSONSchemaProps{Type: "string", Enum: enum}
}

// inlineSchemata holds schemata that should be inlined at every ref site
// because the TS side does not emit a standalone module for them.
// Curated to include enum values that controller-tools cannot infer from
// Go const declarations, so generated TS retains literal-union types.
var inlineSchemata = map[string]map[string]extv1.JSONSchemaProps{
	"k8s.io/api/core/v1": {
		"PullPolicy":                    stringEnum("Always", "IfNotPresent", "Never"),
		"NodeInclusionPolicy":           stringEnum("Honor", "Ignore"),
		"UnsatisfiableConstraintAction": stringEnum("DoNotSchedule", "ScheduleAnyway"),
	},
}

type Runner struct {
	RootDir string
	Input   []string
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
				// Skip non-existent types
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

	output := Output{
		Schemata: map[string]extv1.JSONSchemaProps{},
		Packages: map[string]Package{},
	}

	for pkg, gv := range parser.GroupVersions {
		output.Packages[pkg.ID] = Package{
			Group:   gv.Group,
			Version: gv.Version,
			Kinds:   pkgKinds[pkg.ID],
		}
	}

	for id, schema := range parser.Schemata {
		gv := parser.GroupVersions[id.Package]

		var copied extv1.JSONSchemaProps
		schema.DeepCopyInto(&copied)

		// Replace TypeMeta with the actual GVK from the parser.
		crd.EditSchema(&copied, &typeMetaReplacer{
			APIVersion: gv.String(),
			Kind:       id.Name,
		})

		// Add package name to references if not specified.
		crd.EditSchema(&copied, &refPackageAdder{Fallback: id.Package.ID})

		// Inline references in the schema because some types are not generated in the kubernetes-models package.
		crd.EditSchema(&copied, &refInliner{Schemata: inlineSchemata})

		// Normalize references to `${pkg}/${type}`.
		crd.EditSchema(&copied, &refNormalizer{})

		output.Schemata[id.Package.ID+"/"+id.Name] = copied
	}

	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")

	if err := encoder.Encode(&output); err != nil {
		return fmt.Errorf("encode output: %w", err)
	}

	return nil
}
