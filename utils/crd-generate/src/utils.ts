import { camelCase, upperFirst } from "@kubernetes-models/string-util";
import { posix } from "path";

// TODO: Move to @kubernetes-models/generate
export function getClassName(s: string): string {
  return upperFirst(camelCase(s, ".-"));
}

// TODO: Move to @kubernetes-models/generate
export function getSchemaPath(id: string): string {
  return `_schemas/${getClassName(id)}.js`;
}

// TODO: Move to @kubernetes-models/generate
export function getRelativePath(from: string, to: string): string {
  const path = posix.relative(posix.dirname(from), to);

  if (!path.startsWith(".")) {
    return `./${path}`;
  }

  return path;
}
