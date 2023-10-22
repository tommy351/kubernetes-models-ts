package main

import (
	"strings"

	"sigs.k8s.io/controller-tools/pkg/crd"
)

// Based on: https://github.com/kubernetes/apiserver/blob/0244e95438049b1039f1cfe5fceac2ba6742af88/pkg/endpoints/openapi/openapi.go#L136
func generateDefName(id crd.TypeIdent) string {
	name := id.Package.PkgPath + "/" + id.Name
	nameParts := strings.Split(name, "/")
	// Reverse first part. e.g., io.k8s... instead of k8s.io...
	if len(nameParts) > 0 && strings.Contains(nameParts[0], ".") {
		parts := strings.Split(nameParts[0], ".")
		for i, j := 0, len(parts)-1; i < j; i, j = i+1, j-1 {
			parts[i], parts[j] = parts[j], parts[i]
		}
		nameParts[0] = strings.Join(parts, ".")
	}
	return strings.Join(nameParts, ".")
}

func isTypeMetaIdent(id crd.TypeIdent) bool {
	return id.Package.PkgPath == "k8s.io/apimachinery/pkg/apis/meta/v1" && id.Name == "TypeMeta"
}
