package main

import (
	"github.com/samber/lo"
	apiext "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
)

const typeMetaRef = "#/definitions/io.k8s.apimachinery.pkg.apis.meta.v1.TypeMeta"

type typeMetaFlattener struct {
	TypeMeta apiext.JSONSchemaProps
}

func (t typeMetaFlattener) Flatten(schema *apiext.JSONSchemaProps) {
	origAllOf := schema.AllOf

	schema.AllOf = lo.Filter(schema.AllOf, func(s apiext.JSONSchemaProps, _ int) bool {
		return s.Ref == nil || *s.Ref != typeMetaRef
	})

	if len(origAllOf) != len(schema.AllOf) {
		if schema.Properties != nil && t.TypeMeta.Properties != nil {
			schema.Properties = lo.Assign(schema.Properties, t.TypeMeta.Properties)
		}
	}
}
