package main

import (
	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/crd"
)

var _ crd.SchemaVisitor = (*refInliner)(nil)

type refInliner struct {
	Schemata map[string]map[string]extv1.JSONSchemaProps
}

func (r *refInliner) Visit(schema *extv1.JSONSchemaProps) crd.SchemaVisitor {
	if schema == nil {
		return r
	}

	if ref := schema.Ref; ref != nil {
		if typ, pkgName, err := crd.RefParts(*ref); err == nil {
			if types, ok := r.Schemata[pkgName]; ok {
				if s, ok := types[typ]; ok {
					s.DeepCopyInto(schema)
				}
			}
		}
	}

	return r
}
