package main

import (
	"encoding/json"
	"fmt"
	"go/constant"
	"go/types"
	"sort"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/loader"
)

func stringEnum(values []string) extv1.JSONSchemaProps {
	enum := make([]extv1.JSON, len(values))
	for i, v := range values {
		raw, _ := json.Marshal(v)
		enum[i] = extv1.JSON{Raw: raw}
	}
	return extv1.JSONSchemaProps{Type: "string", Enum: enum}
}

// inlineEnumTypes lists named string-enum types whose schemata should be
// inlined at every ref site because the TS side does not emit a standalone
// module for them. Values are collected from the package's Go const decls at
// runtime so the schema stays in sync with upstream additions.
var inlineEnumTypes = map[string][]string{
	"k8s.io/api/core/v1": {"PullPolicy", "NodeInclusionPolicy", "UnsatisfiableConstraintAction"},
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

func buildInlineSchemata() (map[string]map[string]extv1.JSONSchemaProps, error) {
	out := map[string]map[string]extv1.JSONSchemaProps{}

	for pkgID, typeNames := range inlineEnumTypes {
		roots, err := loader.LoadRoots(pkgID)
		if err != nil {
			return nil, fmt.Errorf("load %s: %w", pkgID, err)
		}

		if len(roots) == 0 {
			return nil, fmt.Errorf("package %s not found", pkgID)
		}

		pkgOut := map[string]extv1.JSONSchemaProps{}

		for _, typeName := range typeNames {
			schema, ok := collectStringEnum(roots[0], typeName)
			if !ok {
				return nil, fmt.Errorf("no string consts found for %s.%s", pkgID, typeName)
			}

			pkgOut[typeName] = schema
		}

		out[pkgID] = pkgOut
	}

	return out, nil
}
