import { Generator, OutputFile } from "@kubernetes-models/generate";
import { set } from "lodash";
import { camelCase } from "@kubernetes-models/string-util";

interface KeyMap {
  [key: string]: string | KeyMap;
}

function generate(map: KeyMap, parent = ""): OutputFile[] {
  const path = parent + "index.ts";
  let children: OutputFile[] = [];
  let content = "";

  for (const key of Object.keys(map)) {
    const val = map[key];

    if (typeof val === "string") {
      content += `export * from "./${val}";\n`;
    } else {
      const exportedName = camelCase(key, ".-");
      content += `export * as ${exportedName} from "./${key}/index";\n`;
      children = children.concat(generate(val, parent + key + "/"));
    }
  }

  return [{ path, content }, ...children];
}

const generateAliases: Generator = async (definitions) => {
  const map: KeyMap = {};

  for (const def of definitions) {
    for (const gvk of def.gvk || []) {
      set(map, [gvk.group, gvk.version, gvk.kind], gvk.kind);
    }
  }

  return generate(map);
};

export default generateAliases;
