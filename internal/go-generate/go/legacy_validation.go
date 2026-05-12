package main

import (
	"strings"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/markers"
)

const (
	legacyAnyOfMarker = "kubebuilder:validation:AnyOf"
	legacyOneOfMarker = "kubebuilder:validation:OneOf"
)

func registerLegacyValidationMarkers(registry *markers.Registry) error {
	if err := registry.Define(legacyOneOfMarker, markers.DescribesField, struct{}{}); err != nil {
		return err
	}
	if err := registry.Define(legacyAnyOfMarker, markers.DescribesField, struct{}{}); err != nil {
		return err
	}

	return nil
}

func applyLegacyValidationMarkers(schema *extv1.JSONSchemaProps, info *markers.TypeInfo) {
	if schema == nil || info == nil {
		return
	}

	applyRequiredBranches(schema, legacyFieldNames(info, legacyOneOfMarker), true)
	applyRequiredBranches(schema, legacyFieldNames(info, legacyAnyOfMarker), false)
}

func applyRequiredBranches(schema *extv1.JSONSchemaProps, fields []string, exactlyOne bool) {
	if len(fields) == 0 {
		return
	}

	removeRequiredFields(schema, fields)

	for _, field := range fields {
		branch := extv1.JSONSchemaProps{Required: []string{field}}
		if exactlyOne {
			schema.OneOf = append(schema.OneOf, branch)
		} else {
			schema.AnyOf = append(schema.AnyOf, branch)
		}
	}
}

func legacyFieldNames(info *markers.TypeInfo, marker string) []string {
	var out []string
	seen := map[string]bool{}

	for _, field := range info.Fields {
		if field.Markers.Get(marker) == nil {
			continue
		}

		name, ok := jsonFieldName(field)
		if !ok || seen[name] {
			continue
		}

		out = append(out, name)
		seen[name] = true
	}

	return out
}

func jsonFieldName(field markers.FieldInfo) (string, bool) {
	jsonTag, ok := field.Tag.Lookup("json")
	if !ok {
		return "", false
	}

	name := strings.Split(jsonTag, ",")[0]
	if name == "" || name == "-" {
		return "", false
	}

	return name, true
}

func removeRequiredFields(schema *extv1.JSONSchemaProps, fields []string) {
	drop := map[string]bool{}
	for _, field := range fields {
		drop[field] = true
	}

	var required []string
	for _, field := range schema.Required {
		if !drop[field] {
			required = append(required, field)
		}
	}

	schema.Required = required
}
