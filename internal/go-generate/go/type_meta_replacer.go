package main

import (
	"slices"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/crd"
)

const (
	metaV1Pkg    = "k8s.io/apimachinery/pkg/apis/meta/v1"
	typeMetaName = "TypeMeta"
)

var _ crd.SchemaVisitor = (*typeMetaReplacer)(nil)

type typeMetaReplacer struct {
	APIVersion string
	Kind       string
}

func isTypeMetaRef(s extv1.JSONSchemaProps) bool {
	if s.Ref == nil {
		return false
	}
	typ, pkgName, err := crd.RefParts(*s.Ref)
	return err == nil && pkgName == metaV1Pkg && typ == typeMetaName
}

func (t *typeMetaReplacer) Visit(schema *extv1.JSONSchemaProps) crd.SchemaVisitor {
	allOfLength := len(schema.AllOf)
	schema.AllOf = slices.DeleteFunc(schema.AllOf, isTypeMetaRef)

	if allOfLength != len(schema.AllOf) {
		if len(schema.AllOf) == 0 {
			schema.AllOf = nil
		}

		if props := schema.Properties; props != nil {
			props["apiVersion"] = stringEnum([]string{t.APIVersion})
			props["kind"] = stringEnum([]string{t.Kind})
			schema.Required = append(schema.Required, "apiVersion", "kind")
		}
	}

	// TypeMeta is only ever embedded at the schema root, so don't descend.
	return nil
}
