package main

import (
	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/crd"
)

var _ crd.SchemaVisitor = (*refPackageAdder)(nil)

type refPackageAdder struct {
	Fallback string
}

func (r *refPackageAdder) Visit(schema *extv1.JSONSchemaProps) crd.SchemaVisitor {
	if schema == nil || schema.Ref == nil {
		return r
	}

	if typ, pkgName, err := crd.RefParts(*schema.Ref); err == nil && pkgName == "" {
		newRef := crd.TypeRefLink(r.Fallback, typ)
		schema.Ref = &newRef
	}

	return nil
}
