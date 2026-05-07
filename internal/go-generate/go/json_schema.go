package main

import (
	"encoding/json"

	"github.com/samber/lo"
	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
)

func newEnumJSONSchemaProp(typ string, values []any) extv1.JSONSchemaProps {
	return extv1.JSONSchemaProps{
		Type: typ,
		Enum: lo.Map(values, func(value any, _ int) extv1.JSON {
			return extv1.JSON{
				Raw: lo.Must(json.Marshal(value)),
			}
		}),
	}
}
