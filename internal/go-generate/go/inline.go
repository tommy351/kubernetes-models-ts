package main

import (
	"go/types"
	"slices"
	"strings"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/crd"
	"sigs.k8s.io/controller-tools/pkg/loader"
	"sigs.k8s.io/controller-tools/pkg/markers"
)

// inlineEligiblePrefixes scopes auto-inlining to upstream apimachinery /
// core API packages. Restricting by prefix avoids accidentally inlining
// downstream-defined primitives that the TS side already emits as
// standalone modules.
var inlineEligiblePrefixes = []string{
	"k8s.io/apimachinery/",
	"k8s.io/api/",
}

// inlineExcluded lists upstream types that JSON-marshal as primitives
// but are still shipped as standalone TS modules by
// `@kubernetes-models/apimachinery`. Inlining them would replace
// `IQuantity`/`ITime`/etc imports with raw primitives and break
// downstream type signatures, so we keep them as $refs.
var inlineExcluded = map[string]map[string]bool{
	"k8s.io/apimachinery/pkg/apis/meta/v1": {
		"Time":      true,
		"MicroTime": true,
	},
	"k8s.io/apimachinery/pkg/api/resource": {
		"Quantity": true,
	},
	"k8s.io/apimachinery/pkg/util/intstr": {
		"IntOrString": true,
	},
}

func isInlineEligible(pkgID string) bool {
	for _, p := range inlineEligiblePrefixes {
		if strings.HasPrefix(pkgID, p) {
			return true
		}
	}
	return false
}

// collectInlineSchemata walks every type the parser has indexed and
// returns inline JSON schemata for transitively-loaded upstream types
// that don't have a standalone TS module on the consumer side. The
// detection order, per type, is:
//
//  1. `+enum` marker → string-enum schema sourced from package consts.
//  2. `OpenAPISchemaType()` + `OpenAPISchemaFormat()` method pair
//     (kube-openapi's duck-typed primitive override, used by Duration,
//     Quantity, Time, MicroTime, IntOrString upstream) → `{type,
//     format}`.
//  3. Underlying Go shape — Basic / Map / Slice — derived recursively.
//
// Types in input roots, outside `inlineEligiblePrefixes`, or listed in
// `inlineExcluded` are skipped.
func collectInlineSchemata(parser *crd.Parser, roots []*loader.Package) map[string]map[string]extv1.JSONSchemaProps {
	out := map[string]map[string]extv1.JSONSchemaProps{}

	for id, info := range parser.Types {
		if slices.Contains(roots, id.Package) {
			continue
		}
		if !isInlineEligible(id.Package.ID) {
			continue
		}
		if inlineExcluded[id.Package.ID][id.Name] {
			continue
		}

		schema, ok := deriveInlineSchema(id.Package, info)
		if !ok {
			continue
		}

		pkgID := id.Package.ID
		if out[pkgID] == nil {
			out[pkgID] = map[string]extv1.JSONSchemaProps{}
		}
		out[pkgID][id.Name] = schema
	}

	return out
}

func deriveInlineSchema(pkg *loader.Package, info *markers.TypeInfo) (extv1.JSONSchemaProps, bool) {
	if info.Markers.Get(enumMarker) != nil {
		if s, ok := collectStringEnum(pkg, info.Name); ok {
			return s, true
		}
	}

	pkg.NeedTypesInfo()
	obj := pkg.Types.Scope().Lookup(info.Name)
	if obj == nil {
		return extv1.JSONSchemaProps{}, false
	}
	// Resolve Go type aliases (`type Foo = Bar`) to their underlying named
	// type. Otherwise an alias of an upstream enum (e.g.
	// `ServiceExternalTrafficPolicyType = ServiceExternalTrafficPolicy`)
	// emits a $ref to the alias name that the consumer side can't import.
	t := obj.Type()
	if alias, ok := t.(*types.Alias); ok {
		t = types.Unalias(alias)
	}
	named, ok := t.(*types.Named)
	if !ok {
		return extv1.JSONSchemaProps{}, false
	}

	if s, ok := openAPIPrimitiveSchema(pkg, named); ok {
		return s, true
	}

	return underlyingShapeSchema(named)
}
