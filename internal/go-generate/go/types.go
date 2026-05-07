package main

import extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"

type Output struct {
	Schemata map[string]extv1.JSONSchemaProps `json:"schemata"`
	Packages map[string]Package               `json:"packages"`
}

type Package struct {
	Group   string   `json:"group"`
	Version string   `json:"version"`
	Kinds   []string `json:"kinds,omitempty"`
}
