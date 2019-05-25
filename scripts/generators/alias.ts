import { Definition, GenerateResult } from "../types";
import {
  trimPrefix,
  camelCase,
  getClassName,
  getShortClassName
} from "../string";
import { relative } from "path";

interface KeyMap {
  [key: string]: string | KeyMap;
}

function deepGet(obj: any, keys: readonly string[]): any {
  const [key, ...rest] = keys;

  if (!rest.length) {
    return obj[key];
  }

  return deepGet(obj[key], rest);
}

function deepSet(obj: any, keys: readonly string[], value: any): void {
  const [key, ...rest] = keys;

  if (rest.length) {
    obj[key] = obj[key] || {};
    deepSet(obj[key], rest, value);
  } else {
    obj[key] = value;
  }
}

function generate(
  map: KeyMap,
  parent: string = ""
): readonly GenerateResult[] {
  const path = parent + "index.ts";
  let children: GenerateResult[] = [];
  let content = "";

  for (const key of Object.keys(map)) {
    const val = map[key];

    if (typeof val === "string") {
      const target = relative(parent, "_definitions/" + getClassName(val));
      content += `export * from "${target}";\n`;
      children.push({
        path: parent + getShortClassName(val) + ".ts",
        content: `export * from "${target}";\n`
      });
    } else {
      const exportedName = camelCase(key, ".-");
      content += `import * as ${exportedName} from "./${key}";\n`;
      content += `export { ${exportedName} };\n`;
      children = children.concat(generate(val, parent + key + "/"));
    }
  }

  return [{ path, content }, ...children];
}

function buildGVKMap(
  defs: readonly Definition[]
): { [key: string]: string } {
  const map: { [key: string]: string } = {};

  for (const def of defs) {
    for (const gvk of def.gvk) {
      let key = gvk.version;
      if (gvk.group) key = gvk.group + "/" + key;

      if (!map[key]) {
        const val = def.id
          .split(".")
          .slice(0, -1)
          .join(".");

        map[key] = val;
      }
    }
  }

  return map;
}

export async function generateAliases(
  defs: readonly Definition[]
): Promise<readonly GenerateResult[]> {
  const map: KeyMap = {};
  const gvkMap = buildGVKMap(defs);
  const prefix = "io.k8s.";

  for (const def of defs) {
    deepSet(map, trimPrefix(def.id, prefix).split("."), def.id);
  }

  for (const key of Object.keys(gvkMap)) {
    const keys = key.split("/");
    const val = deepGet(map, trimPrefix(gvkMap[key], prefix).split("."));

    deepSet(map, keys, val);
  }

  return generate(map);
}
