import {
  collectRefs,
  generateImports,
  generateInterface,
  Generator,
  getAPIVersion,
  Import
} from "@kubernetes-models/generate";
import { formatComment, trimSuffix } from "@kubernetes-models/string-util";
import {
  getClassName,
  getInterfaceName,
  getShortClassName,
  getShortInterfaceName,
  trimRefPrefix
} from "../string";

function getRefType(ref: string): string {
  return getInterfaceName(trimRefPrefix(ref));
}

const generateDefinitions: Generator = async (definitions) => {
  return definitions.map((def) => {
    const interfaceName = getInterfaceName(def.schemaId);
    const className = getClassName(def.schemaId);
    const shortInterfaceName = getShortInterfaceName(def.schemaId);
    const shortClassName = getShortClassName(def.schemaId);
    const refs = collectRefs(def.schema)
      .map(trimRefPrefix)
      .filter((ref) => ref !== def.schemaId);
    const imports: Import[] = [];
    const typing = generateInterface(def.schema, {
      getRefType,
      includeDescription: true
    });
    let content = "";
    let comment = "";

    if (def.schema.description) {
      comment = formatComment(def.schema.description, {
        deprecated: /^deprecated/i.test(def.schema.description)
      });
    }

    for (const ref of refs) {
      imports.push({
        name: getInterfaceName(ref),
        path: `./${getClassName(ref)}`
      });
    }

    if (def.schema.type === "object") {
      const gvk = def.gvk?.[0];
      let classContent = generateInterface(def.schema, {
        getRefType,
        getFieldType(key) {
          if (key.length !== 1) return;

          switch (key[0]) {
            case "apiVersion":
            case "kind":
              return `${interfaceName}["${key[0]}"]`;
          }
        }
      });

      if (gvk) {
        imports.push({
          name: "ModelData",
          path: "@kubernetes-models/base"
        });

        classContent = `${trimSuffix(classContent, "}")}
static apiVersion: ${interfaceName}["apiVersion"] = "${getAPIVersion(gvk)}";
static kind: ${interfaceName}["kind"] = "${gvk.kind}";

constructor(data?: ModelData<${interfaceName}>) {
  super({
    apiVersion: ${className}.apiVersion,
    kind: ${className}.kind,
    ...data
  } as ${interfaceName});
}
}`;
      }

      imports.push({
        name: "Model",
        path: "@kubernetes-models/base"
      });

      imports.push({
        name: "addSchema",
        path: `../_schemas/${className}`
      });

      content += `
${comment}export interface ${interfaceName} ${typing}

${comment}export class ${className} extends Model<${interfaceName}> implements ${interfaceName} ${classContent}

Model.setSchema(${className}, ${JSON.stringify(def.schemaId)}, addSchema);
`;
    } else {
      content += `
${comment}export type ${interfaceName} = ${typing};

export type ${className} = ${interfaceName};
`;
    }

    content += `
export {
  ${interfaceName} as ${shortInterfaceName},
  ${className} as ${shortClassName}
};
`;

    content = generateImports(imports) + "\n" + content;

    return {
      path: `_definitions/${getClassName(def.schemaId)}.ts`,
      content
    };
  });
};

export default generateDefinitions;
