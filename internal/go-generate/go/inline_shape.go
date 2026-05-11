package main

import (
	"go/types"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/crd"
)

// underlyingShapeSchema derives a primitive / collection schema from a
// named type's underlying Go shape:
//
//   - `*types.Basic`   → primitive (string / boolean / integer / number)
//   - `*types.Map[K]V` → `{type: object, additionalProperties: <V>}`
//   - `*types.Slice`   → `{type: array, items: <element>}`
//
// Struct, interface, and other shapes are left alone (caller keeps the
// $ref).
func underlyingShapeSchema(named *types.Named) (extv1.JSONSchemaProps, bool) {
	switch u := named.Underlying().(type) {
	case *types.Basic:
		return basicSchema(u)
	case *types.Map:
		v, ok := elementSchema(u.Elem())
		if !ok {
			return extv1.JSONSchemaProps{}, false
		}
		return extv1.JSONSchemaProps{
			Type: "object",
			AdditionalProperties: &extv1.JSONSchemaPropsOrBool{
				Allows: true,
				Schema: &v,
			},
		}, true
	case *types.Slice:
		v, ok := elementSchema(u.Elem())
		if !ok {
			return extv1.JSONSchemaProps{}, false
		}
		return extv1.JSONSchemaProps{
			Type:  "array",
			Items: &extv1.JSONSchemaPropsOrArray{Schema: &v},
		}, true
	}
	return extv1.JSONSchemaProps{}, false
}

// elementSchema returns a schema for a map value or slice element. It
// emits a $ref for `*types.Named` (resolved later by refInliner /
// refNormalizer) and an inline schema for primitives. Pointers are
// transparently unwrapped.
func elementSchema(t types.Type) (extv1.JSONSchemaProps, bool) {
	switch tt := t.(type) {
	case *types.Basic:
		return basicSchema(tt)
	case *types.Named:
		obj := tt.Obj()
		if obj.Pkg() == nil {
			return extv1.JSONSchemaProps{}, false
		}
		ref := crd.TypeRefLink(obj.Pkg().Path(), obj.Name())
		return extv1.JSONSchemaProps{Ref: &ref}, true
	case *types.Pointer:
		return elementSchema(tt.Elem())
	}
	return extv1.JSONSchemaProps{}, false
}

func basicSchema(t *types.Basic) (extv1.JSONSchemaProps, bool) {
	info := t.Info()
	switch {
	case info&types.IsString != 0:
		return extv1.JSONSchemaProps{Type: "string"}, true
	case info&types.IsBoolean != 0:
		return extv1.JSONSchemaProps{Type: "boolean"}, true
	case info&types.IsInteger != 0:
		return extv1.JSONSchemaProps{Type: "integer"}, true
	case info&types.IsFloat != 0:
		return extv1.JSONSchemaProps{Type: "number"}, true
	}
	return extv1.JSONSchemaProps{}, false
}
