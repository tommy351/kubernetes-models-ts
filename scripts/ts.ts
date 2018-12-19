import ts from "typescript";

export function hasModifier(node: ts.Node, modifier: ts.SyntaxKind) {
  return (node.modifiers || []).some(mod => mod.kind === modifier);
}
