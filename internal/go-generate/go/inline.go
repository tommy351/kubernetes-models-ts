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

// inlineIncludeStructs lists struct-shaped upstream types whose JSON
// shape has no standalone module on the consumer side. They are inlined
// upstream into another type (corev1.VolumeSource lives inside Volume),
// absent from the OpenAPI swagger (metav1.GroupKind, metav1.Timestamp),
// or in a not-yet-republished alpha group. Without this list, the TS
// generator emits imports against module paths that don't resolve, and
// `tsc --emitDeclarationOnly` fails with TS2307.
//
// Grow this list as new external-ref blockers surface in third-party
// packages.
var inlineIncludeStructs = map[string]map[string]bool{
	"k8s.io/apimachinery/pkg/apis/meta/v1": {
		"GroupKind":            true,
		"GroupVersionKind":     true,
		"GroupVersionResource": true,
		"Timestamp":            true,
	},
	"k8s.io/api/core/v1": {
		"VolumeSource": true,
	},
	"k8s.io/api/admission/v1": {
		"AdmissionRequest": true,
	},
	"k8s.io/api/admissionregistration/v1alpha1": {
		"ApplyConfiguration": true,
		"JSONPatch":          true,
		"Mutation":           true,
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
//  4. Struct types listed in `inlineIncludeStructs` → the parser's
//     already-computed schema (deep-copied).
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
			if !inlineIncludeStructs[id.Package.ID][id.Name] {
				continue
			}
			existing, exists := parser.Schemata[id]
			if !exists {
				continue
			}
			existing.DeepCopyInto(&schema)
			// Same-package field refs in the parser's schema are
			// unqualified. Qualify them now so refNormalizer can map them
			// to `io.k8s.api.core.v1.*` form; otherwise they leak into the
			// consumer as bare type names with empty package segments.
			crd.EditSchema(&schema, &refPackageAdder{Fallback: id.Package.ID})
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
