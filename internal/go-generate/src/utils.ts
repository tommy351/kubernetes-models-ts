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

const externalRefPrefixes = [
  "io.k8s.apimachinery.",
  "io.k8s.api.",
  "io.k8s.apiextensions-apiserver.",
  "io.k8s.sigs.gateway-api.",
];

function getPackageId(ref: string): string {
  const index = ref.lastIndexOf(".");
  return index === -1 ? "" : ref.slice(0, index);
}

export function isExternalRef(ctx: Context, ref: string): boolean {
  // Refs whose package is one of our generation inputs stay internal even
  // when their prefix matches an external library (a library generating
  // its own types).
  if (ctx.roots.includes(getPackageId(ref))) return false;
  return externalRefPrefixes.some((p) => ref.startsWith(p));
}

export function getPackage(ctx: Context, id: string): Package | undefined {
  const pkgId = getPackageId(id);
  if (!pkgId) return;
  return ctx.packages[pkgId];
}

export function getKind(id: string): string {
  return id.slice(id.lastIndexOf(".") + 1);
}

export function getInternalDefinitionPath(ctx: Context, ref: string): string {
  const pkg = getPackage(ctx, ref);
  if (!pkg) return ref;
  // Packages without a GroupVersion fall back to their Go import path so
  // transitively-loaded helpers stay grouped instead of polluting gen root.
  const dir = pkg.group || pkg.version ? getAPIVersion(pkg) : pkg.goPath;
  const kind = ctx.pathRenames?.[ref] ?? getKind(ref);
  return `${dir}/${kind}`;
}

export function isRootKind(ctx: Context, ref: string): boolean {
  const pkg = getPackage(ctx, ref);
  return Boolean(pkg?.kinds?.includes(getKind(ref)));
}
