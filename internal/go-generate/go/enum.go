package main

import (
	"encoding/json"
	"go/constant"
	"go/types"
	"sort"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/crd"
	"sigs.k8s.io/controller-tools/pkg/loader"
)

// enumMarker is the kubernetes-convention doc marker (`// +enum`) that
// flags a named type as a string-enum.
const enumMarker = "enum"

func stringEnum(values []string) extv1.JSONSchemaProps {
	enum := make([]extv1.JSON, len(values))
	for i, v := range values {
		raw, _ := json.Marshal(v)
		enum[i] = extv1.JSON{Raw: raw}
	}
	return extv1.JSONSchemaProps{Type: "string", Enum: enum}
}

// collectStringEnum returns a string-enum JSON schema built from every
// package-scope string const declared with the given named type.
func collectStringEnum(pkg *loader.Package, typeName string) (extv1.JSONSchemaProps, bool) {
	pkg.NeedTypesInfo()

	scope := pkg.Types.Scope()
	var values []string

	for _, name := range scope.Names() {
		c, ok := scope.Lookup(name).(*types.Const)
		if !ok {
			continue
		}

		named, ok := c.Type().(*types.Named)
		if !ok || named.Obj().Name() != typeName {
			continue
		}

		if c.Val().Kind() != constant.String {
			continue
		}

		values = append(values, constant.StringVal(c.Val()))
	}

	if len(values) == 0 {
		return extv1.JSONSchemaProps{}, false
	}

	sort.Strings(values)
	return stringEnum(values), true
}

func setInline(out map[string]map[string]extv1.JSONSchemaProps, pkg, name string, schema extv1.JSONSchemaProps) {
	m, ok := out[pkg]
	if !ok {
		m = map[string]extv1.JSONSchemaProps{}
		out[pkg] = m
	}
	m[name] = schema
}

// addBuiltinInlines registers schemata for upstream apimachinery/core
// types that kube-openapi doesn't expose (so `@kubernetes-models/*`
// packages don't ship them) but controller-tools still emits as refs.
// We inline these so consumers see a primitive type instead of a
// broken import.
func addBuiltinInlines(out map[string]map[string]extv1.JSONSchemaProps) {
	const (
		metav1 = "k8s.io/apimachinery/pkg/apis/meta/v1"
		corev1 = "k8s.io/api/core/v1"
	)
	stringSchema := extv1.JSONSchemaProps{Type: "string"}
	setInline(out, metav1, "Duration", stringSchema)
	setInline(out, metav1, "ConditionStatus", stringSchema)
	setInline(out, metav1, "LabelSelectorOperator", stringSchema)
	quantityRef := crd.TypeRefLink("k8s.io/apimachinery/pkg/api/resource", "Quantity")
	setInline(out, corev1, "ResourceList", extv1.JSONSchemaProps{
		Type: "object",
		AdditionalProperties: &extv1.JSONSchemaPropsOrBool{
			Allows: true,
			Schema: &extv1.JSONSchemaProps{Ref: &quantityRef},
		},
	})
}

// collectInlineEnums scans every type indexed by the parser for the
// `+enum` marker and returns a map of inline schemata keyed by package
// import path and type name. Types declared in one of the input root
// packages are skipped — the TS side emits standalone modules for those
// already; only enums from transitively-loaded external packages need
// to be inlined.
func collectInlineEnums(parser *crd.Parser, roots []*loader.Package) map[string]map[string]extv1.JSONSchemaProps {
	rootSet := make(map[*loader.Package]struct{}, len(roots))
	for _, root := range roots {
		rootSet[root] = struct{}{}
	}

	out := map[string]map[string]extv1.JSONSchemaProps{}

	for id, info := range parser.Types {
		if info.Markers.Get(enumMarker) == nil {
			continue
		}

		if _, isRoot := rootSet[id.Package]; isRoot {
			continue
		}

		schema, ok := collectStringEnum(id.Package, info.Name)
		if !ok {
			continue
		}

		setInline(out, id.Package.ID, info.Name, schema)
	}

	return out
}
