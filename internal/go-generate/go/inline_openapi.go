package main

import (
	"go/ast"
	"go/token"
	"go/types"
	"strconv"

	extv1 "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
	"sigs.k8s.io/controller-tools/pkg/loader"
)

// openAPIPrimitiveSchema returns the schema implied by a type's
// `OpenAPISchemaType() []string` + `OpenAPISchemaFormat() string`
// methods (kube-openapi's convention for struct types that marshal as
// JSON primitives — Duration, Time, Quantity, etc).
func openAPIPrimitiveSchema(pkg *loader.Package, named *types.Named) (extv1.JSONSchemaProps, bool) {
	typeVals, ok := readMethodStringReturn(pkg, named, "OpenAPISchemaType")
	if !ok || len(typeVals) != 1 {
		return extv1.JSONSchemaProps{}, false
	}
	formatVals, ok := readMethodStringReturn(pkg, named, "OpenAPISchemaFormat")
	if !ok || len(formatVals) > 1 {
		return extv1.JSONSchemaProps{}, false
	}
	var format string
	if len(formatVals) == 1 {
		format = formatVals[0]
	}
	return extv1.JSONSchemaProps{Type: typeVals[0], Format: format}, true
}

// readMethodStringReturn finds methodName on named in pkg's AST and
// returns the string literals from its first `return` statement. The
// return expression must be a bare string literal or a `[]string{...}`
// composite literal whose elements are all string literals.
func readMethodStringReturn(pkg *loader.Package, named *types.Named, methodName string) ([]string, bool) {
	pkg.NeedSyntax()
	typeName := named.Obj().Name()
	for _, file := range pkg.Syntax {
		for _, decl := range file.Decls {
			fn, ok := decl.(*ast.FuncDecl)
			if !ok || fn.Name.Name != methodName {
				continue
			}
			recv, ok := receiverTypeName(fn.Recv)
			if !ok || recv != typeName {
				continue
			}
			return stringReturnLiterals(fn.Body)
		}
	}
	return nil, false
}

// receiverTypeName extracts the bare type name from a method's receiver,
// transparently unwrapping a pointer receiver. Returns ok=false for nil
// or generic receivers.
func receiverTypeName(recv *ast.FieldList) (string, bool) {
	if recv == nil || len(recv.List) != 1 {
		return "", false
	}
	expr := recv.List[0].Type
	if star, ok := expr.(*ast.StarExpr); ok {
		expr = star.X
	}
	ident, ok := expr.(*ast.Ident)
	if !ok {
		return "", false
	}
	return ident.Name, true
}

func stringReturnLiterals(body *ast.BlockStmt) ([]string, bool) {
	if body == nil {
		return nil, false
	}
	for _, stmt := range body.List {
		ret, ok := stmt.(*ast.ReturnStmt)
		if !ok || len(ret.Results) != 1 {
			continue
		}
		return stringLiteralsFromExpr(ret.Results[0])
	}
	return nil, false
}

// stringLiteralsFromExpr unwraps either a bare string literal or a
// `[]string{...}` composite literal of bare string literals. Nested
// composites are rejected.
func stringLiteralsFromExpr(expr ast.Expr) ([]string, bool) {
	if comp, ok := expr.(*ast.CompositeLit); ok {
		out := make([]string, 0, len(comp.Elts))
		for _, e := range comp.Elts {
			s, ok := stringLiteral(e)
			if !ok {
				return nil, false
			}
			out = append(out, s)
		}
		return out, true
	}
	s, ok := stringLiteral(expr)
	if !ok {
		return nil, false
	}
	return []string{s}, true
}

func stringLiteral(expr ast.Expr) (string, bool) {
	lit, ok := expr.(*ast.BasicLit)
	if !ok || lit.Kind != token.STRING {
		return "", false
	}
	s, err := strconv.Unquote(lit.Value)
	if err != nil {
		return "", false
	}
	return s, true
}
