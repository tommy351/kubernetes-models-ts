package main

import (
	"bytes"
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/samber/lo"
	"golang.org/x/tools/go/packages"
	apiext "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"sigs.k8s.io/controller-tools/pkg/crd"
	crdmarkers "sigs.k8s.io/controller-tools/pkg/crd/markers"
	"sigs.k8s.io/controller-tools/pkg/loader"
	"sigs.k8s.io/controller-tools/pkg/markers"
)

const openAPIFileName = "openapi.json"

type packageJson struct {
	GoCRDGenerate generateConfig `json:"go-crd-generate"`
}

type generateConfig struct {
	Input []generateInput `json:"input"`
}

type generateInput struct {
	Module   string   `json:"module"`
	Packages []string `json:"packages"`
}

type goModule struct {
	Dir   string
	Error string
}

type openAPIFile struct {
	Definitions map[string]openAPIDefinition `json:"definitions"`
}

type openAPIDefinition struct {
	apiext.JSONSchemaProps

	XKubernetesGroupVersionKind []kubernetesGVK `json:"x-kubernetes-group-version-kind,omitempty"`
}

type kubernetesGVK struct {
	Group   string `json:"group"`
	Version string `json:"version"`
	Kind    string `json:"kind"`
}

type generator struct {
	wd     string
	conf   generateConfig
	parser *crd.Parser
}

func (g *generator) Generate() {
	g.initWD()
	g.loadConfig()
	g.initParser()

	pkgs := g.loadPackages()
	kinds := g.findKubeKinds(pkgs)

	g.generateSchemas(kinds)

	file := g.generateOpenAPIFile(kinds)

	g.printOpenAPIFile(file)
}

func (g *generator) initWD() {
	wd, err := os.Getwd()
	if err != nil {
		log.Fatalln("Failed to get working directory:", err)
	}

	g.wd = wd
}

func (g *generator) loadConfig() {
	file, err := os.Open(filepath.Join(g.wd, "package.json"))
	if err != nil {
		log.Fatalln("Failed to open file:", err)
	}

	defer file.Close()

	var pkg packageJson

	if err := json.NewDecoder(file).Decode(&pkg); err != nil {
		log.Fatalln("Failed to decode package.json:", err)
	}

	g.conf = pkg.GoCRDGenerate
}

func (g *generator) loadPackages() []*loader.Package {
	var allPkgs []*loader.Package

	for _, input := range g.conf.Input {
		dir := g.downloadModule(input.Module)
		pkgs, err := loader.LoadRootsWithConfig(&packages.Config{
			Dir: dir,
		}, input.Packages...)
		if err != nil {
			log.Fatalln("Failed to load roots:", err)
		}

		for _, pkg := range pkgs {
			log.Println("Found package:", pkg)
		}

		allPkgs = append(allPkgs, pkgs...)
	}

	return allPkgs
}

func (g *generator) downloadModule(mod string) string {
	var buf bytes.Buffer

	cmd := exec.Command("go", "mod", "download", "-json", mod)
	cmd.Stdout = &buf
	cmd.Stderr = os.Stderr

	log.Println("Downloading Go module:", mod)

	if err := cmd.Run(); err != nil {
		log.Fatalln("Failed to download module:", err)
	}

	var goMod goModule

	if err := json.Unmarshal(buf.Bytes(), &goMod); err != nil {
		log.Fatalln(`Invalid "go mod download" output:`, err)
	}

	if err := goMod.Error; err != "" {
		log.Fatalln("Failed to download module:", err)
	}

	return goMod.Dir
}

func (g *generator) initParser() {
	reg := &markers.Registry{}

	if err := crdmarkers.Register(reg); err != nil {
		log.Fatalln("Failed to register CRD markers:", err)
	}

	g.parser = &crd.Parser{
		Collector:              &markers.Collector{Registry: reg},
		Checker:                &loader.TypeChecker{},
		IgnoreUnexportedFields: true,
	}

	crd.AddKnownTypes(g.parser)
}

func (g *generator) findKubeKinds(pkgs []*loader.Package) []schema.GroupKind {
	for _, pkg := range pkgs {
		g.parser.NeedPackage(pkg)
	}

	metaV1Pkg := crd.FindMetav1(pkgs)
	if metaV1Pkg == nil {
		log.Fatalln("None of the packages import metav1 package")
	}

	kinds := crd.FindKubeKinds(g.parser, metaV1Pkg)

	for _, kind := range kinds {
		log.Println("Found kind:", kind)
	}

	return kinds
}

func (g *generator) generateSchemas(kinds []schema.GroupKind) {
	for _, kind := range kinds {
		pkg, ok := lo.FindKeyBy(g.parser.GroupVersions, func(pkg *loader.Package, gv schema.GroupVersion) bool {
			return kind.Group == gv.Group
		})
		if !ok {
			continue
		}

		g.parser.NeedSchemaFor(crd.TypeIdent{
			Package: pkg,
			Name:    kind.Kind,
		})
	}
}

func (g *generator) generateOpenAPIFile(kinds []schema.GroupKind) *openAPIFile {
	schemas := lo.OmitBy(g.parser.Schemata, func(id crd.TypeIdent, _ apiext.JSONSchemaProps) bool {
		return strings.HasPrefix(id.Package.PkgPath, "k8s.io/")
	})
	file := &openAPIFile{
		Definitions: make(map[string]openAPIDefinition, len(schemas)),
	}
	tmf := typeMetaFlattener{
		TypeMeta: g.getTypeMeta(),
	}

	for id, schema := range schemas {
		copied := schema.DeepCopy()

		crd.EditSchema(copied, &rewriteRefVisitor{
			Parser:  g.parser,
			Package: id.Package,
		})
		tmf.Flatten(copied)

		file.Definitions[generateDefName(id)] = openAPIDefinition{
			JSONSchemaProps:             *copied,
			XKubernetesGroupVersionKind: g.getGVK(kinds, id),
		}
	}

	return file
}

func (g *generator) printOpenAPIFile(data *openAPIFile) {
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")

	if err := encoder.Encode(data); err != nil {
		log.Fatalln("Failed to encode file:", err)
	}
}

func (g *generator) getGVK(kinds []schema.GroupKind, id crd.TypeIdent) []kubernetesGVK {
	gv, gvFound := g.parser.GroupVersions[id.Package]
	if !gvFound {
		return nil
	}

	_, kindFound := lo.Find(kinds, func(kind schema.GroupKind) bool {
		return kind.Group == gv.Group && kind.Kind == id.Name
	})
	if !kindFound {
		return nil
	}

	return []kubernetesGVK{
		{
			Group:   gv.Group,
			Version: gv.Version,
			Kind:    id.Name,
		},
	}
}

func (g *generator) getTypeMeta() apiext.JSONSchemaProps {
	for id, schema := range g.parser.Schemata {
		if isTypeMetaIdent(id) {
			return schema
		}
	}

	return apiext.JSONSchemaProps{}
}
