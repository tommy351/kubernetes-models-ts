import { posix } from "node:path";
import { getAPIVersion } from "@kubernetes-models/generate";
import { camelCase, upperFirst } from "@kubernetes-models/string-util";
import type { Context, Package } from "./load.js";

export function getQualifiedClassName(id: string): string {
  return upperFirst(camelCase(id, ".-"));
}

export function getQualifiedInterfaceName(id: string): string {
  return "I" + getQualifiedClassName(id);
}

export function getSchemaPath(id: string): string {
  return `_schemas/${getQualifiedClassName(id)}.js`;
}

export function getRelativePath(from: string, to: string): string {
  const path = posix.relative(posix.dirname(from), to);

  if (!path.startsWith(".")) {
    return `./${path}`;
  }

  return path;
}

export function isExternalRef(ref: string): boolean {
  return ref.startsWith("io.k8s.");
}

export function getPackage(ctx: Context, id: string): Package | undefined {
  const index = id.lastIndexOf(".");
  if (index === -1) return;

  return ctx.packages[id.slice(0, index)];
}

export function getKind(id: string): string {
  return id.slice(id.lastIndexOf(".") + 1);
}

export function getInternalDefinitionPath(ctx: Context, ref: string): string {
  const pkg = getPackage(ctx, ref);
  if (!pkg) return ref;
  return `${getAPIVersion(pkg)}/${getKind(ref)}`;
}
