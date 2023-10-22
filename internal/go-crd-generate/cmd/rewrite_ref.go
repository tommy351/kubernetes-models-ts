package main

import (
	apiext "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/crd"
	"sigs.k8s.io/controller-tools/pkg/loader"
)

type rewriteRefVisitor struct {
	Parser  *crd.Parser
	Package *loader.Package
}

func (r *rewriteRefVisitor) Visit(schema *apiext.JSONSchemaProps) crd.SchemaVisitor {
	if schema == nil {
		return r
	}

	if ref := schema.Ref; ref != nil {
		if id, err := identFromRef(*ref, r.Package); err == nil {
			key := "#/definitions/" + generateDefName(id)
			schema.Ref = &key

			return nil
		}
	}

	return r
}

// https://github.com/kubernetes-sigs/controller-tools/blob/c21d4096870a2f2009e98a255997925666c404e5/pkg/crd/flatten.go#L310
func identFromRef(ref string, contextPkg *loader.Package) (crd.TypeIdent, error) {
	typ, pkgName, err := crd.RefParts(ref)
	if err != nil {
		return crd.TypeIdent{}, err
	}

	if pkgName == "" {
		// a local reference
		return crd.TypeIdent{
			Name:    typ,
			Package: contextPkg,
		}, nil
	}

	// an external reference
	return crd.TypeIdent{
		Name:    typ,
		Package: contextPkg.Imports()[pkgName],
	}, nil
}
