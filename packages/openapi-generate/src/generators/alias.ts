import { camelCase, trimPrefix } from "@kubernetes-models/string-util";
import { getClassName, getShortClassName } from "../string";
import { posix } from "path";
import { Generator, Definition, OutputFile } from "@kubernetes-models/generate";
import { get, set, identity } from "lodash";

interface KeyMap {
  [key: string]: string | KeyMap;
}

function generate(map: KeyMap, parent = ""): readonly OutputFile[] {
  const path = parent + "index.ts";
  let children: OutputFile[] = [];
  let content = "";

  for (const [key, val] of Object.entries(map)) {
    if (typeof val === "string") {
      const fileName = getShortClassName(val);
      const target = posix.relative(
        parent,
        "_definitions/" + getClassName(val)
      );
      content += `export * from "./${fileName}";\n`;
      children.push({
        path: parent + fileName + ".ts",
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

function buildGVMap(defs: readonly Definition[]): Record<string, string> {
  const map: Record<string, string> = {};

  for (const def of defs) {
    // Skip if the definition doesn't define any GVK
    if (!def.gvk || !def.gvk.length) continue;

    // Skip meta definitions because their "x-kubernetes-group-version-kind"
    // usually contains all types of GVKs.
    if (def.schemaId.startsWith("io.k8s.apimachinery.pkg.apis.meta.v1.")) {
      continue;
    }

    for (const gvk of def.gvk) {
      let key = gvk.version;
      if (gvk.group) key = gvk.group + "/" + key;

      if (!map[key]) {
        map[key] = def.schemaId.split(".").slice(0, -1).join(".");
      }
    }
  }

  return map;
}

export default function generateAliases(
  rewritePath: (path: string) => string = identity
): Generator {
  return async (definitions) => {
    const map: KeyMap = {};
    const gvMap = buildGVMap(definitions);
    const idPrefix = "io.k8s.";

    for (const def of definitions) {
      set(map, trimPrefix(def.schemaId, idPrefix).split("."), def.schemaId);
    }

    for (const [apiGroup, prefix] of Object.entries(gvMap)) {
      const keys = apiGroup.split("/");
      const val = get(map, trimPrefix(prefix, idPrefix).split("."));
      set(map, keys, val);
    }

    return generate(map).map(({ path, ...file }) => ({
      ...file,
      path: rewritePath(path)
    }));
  };
}
