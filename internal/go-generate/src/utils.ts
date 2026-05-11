import { posix } from "node:path";
import { getAPIVersion } from "@kubernetes-models/generate";
import type { Context, Package } from "./load.js";

export function getSchemaPath(id: string): string {
  const name = id
    .split(/[-/.]/g)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");

  return `_schemas/${name}.js`;
}

export function getRelativePath(from: string, to: string): string {
  const path = posix.relative(posix.dirname(from), to);

  if (!path.startsWith(".")) {
    return `./${path}`;
  }

  return path;
}

export function isExternalRef(ref: string): boolean {
  return ref.startsWith("k8s.io/");
}

export function getPackage(ctx: Context, id: string): Package | undefined {
  const index = id.lastIndexOf("/");
  if (index === -1) return;

  const pkg = ctx.packages[id.slice(0, index)];
  return pkg;
}

export function getKind(id: string): string {
  return id.slice(id.lastIndexOf("/") + 1);
}

export function getInternalDefinitionPath(ctx: Context, ref: string): string {
  const pkg = getPackage(ctx, ref);
  if (!pkg) return ref;
  return `${getAPIVersion(pkg)}/${getKind(ref)}`;
}
