package main

import (
	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	openapiutil "k8s.io/kube-openapi/pkg/util"
	"sigs.k8s.io/controller-tools/pkg/crd"
)

var _ crd.SchemaVisitor = (*refNormalizer)(nil)

type refNormalizer struct{}

func (r *refNormalizer) Visit(schema *extv1.JSONSchemaProps) crd.SchemaVisitor {
	if schema == nil || schema.Ref == nil {
		return r
	}

	if typ, pkgName, err := crd.RefParts(*schema.Ref); err == nil {
		newRef := openapiutil.ToRESTFriendlyName(pkgName + "." + typ)
		schema.Ref = &newRef
	}

	return nil
}
