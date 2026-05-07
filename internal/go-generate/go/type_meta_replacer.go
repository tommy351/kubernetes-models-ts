package main

import (
	"slices"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/crd"
)

var _ crd.SchemaVisitor = (*typeMetaReplacer)(nil)

// typeMetaReplacer replaces the TypeMeta embedded in the schema with the actual GVK from the parser.
type typeMetaReplacer struct {
	APIVersion string
	Kind       string
}

func (t *typeMetaReplacer) Visit(schema *extv1.JSONSchemaProps) crd.SchemaVisitor {
	allOfLength := len(schema.AllOf)

	// Delete TypeMeta from AllOf.
	schema.AllOf = slices.DeleteFunc(schema.AllOf, func(s extv1.JSONSchemaProps) bool {
		if ref := s.Ref; ref != nil {
			if typ, pkgName, err := crd.RefParts(*ref); err == nil &&
				pkgName == "k8s.io/apimachinery/pkg/apis/meta/v1" &&
				typ == "TypeMeta" {
				return true
			}
		}

		return false
	})

	// If AllOf is updated
	if allOfLength != len(schema.AllOf) {
		// Omit AllOf if it's empty.
		if len(schema.AllOf) == 0 {
			schema.AllOf = nil
		}

		// Add static apiVersion and kind fields to the schema.
		if props := schema.Properties; props != nil {
			props["apiVersion"] = newEnumJSONSchemaProp("string", []any{t.APIVersion})
			props["kind"] = newEnumJSONSchemaProp("string", []any{t.Kind})
			schema.Required = append(schema.Required, "apiVersion", "kind")
		}
	}

	// Return nil to stop the visitor at the first level of the schema, because TypeMeta
	// must be at the first level.
	return nil
}
