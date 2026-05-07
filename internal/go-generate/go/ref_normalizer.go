package main

import (
	"fmt"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/crd"
)

var _ crd.SchemaVisitor = (*refNormalizer)(nil)

type refNormalizer struct{}

func (r *refNormalizer) Visit(schema *extv1.JSONSchemaProps) crd.SchemaVisitor {
	if schema == nil {
		return r
	}

	if ref := schema.Ref; ref != nil {
		if typ, pkgName, err := crd.RefParts(*ref); err == nil {
			newRef := fmt.Sprintf("%s/%s", pkgName, typ)
			schema.Ref = &newRef
		}

		return nil
	}

	return r
}
