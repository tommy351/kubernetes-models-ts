import {
  collectRefs,
  generateImports,
  generateInterface,
  Generator,
  getAPIVersion,
  Import
} from "@kubernetes-models/generate";
import {
  formatComment,
  trimPrefix,
  trimSuffix
} from "@kubernetes-models/string-util";
import { isAPIMachineryID } from "..";
import { Context } from "../context";
import {
  getClassName,
  getInterfaceName,
  getShortClassName,
  getShortInterfaceName,
  trimRefPrefix
} from "../string";
import { getRelativePath, getSchemaPath } from "../utils";

export default function ({
  getDefinitionPath,
  externalAPIMachinery
}: Context): Generator {
  return async (definitions) => {
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
      const path = getDefinitionPath(def.schemaId);
      let content = "";
      let comment = "";

      function getRefType(ref: string): string {
        const id = trimRefPrefix(ref);

        // Return the shortInterfaceName if it is a self reference.
        if (id === def.schemaId) {
          return shortInterfaceName;
        }

        return getInterfaceName(id);
      }

      if (def.schema.description) {
        comment = formatComment(def.schema.description, {
          deprecated: /deprecated/i.test(def.schema.description)
        });
      }

      for (const ref of refs) {
        const name = getInterfaceName(ref);

        if (externalAPIMachinery && isAPIMachineryID(ref)) {
          imports.push({
            name,
            path: `@kubernetes-models/apimachinery/${trimPrefix(
              ref,
              "io.k8s.apimachinery.pkg."
            )
              .split(".")
              .join("/")}`
          });
        } else {
          imports.push({
            name,
            path: getRelativePath(path, getDefinitionPath(ref))
          });
        }
      }

      if (def.schema.type === "object") {
        const gvk = def.gvk?.[0];
        let classContent = generateInterface(def.schema, {
          getRefType,
          getFieldType(key) {
            // Rewrite types of apiVersion/kind to the interface type.
            switch (key[0]) {
              case "apiVersion":
              case "kind":
                return `${shortInterfaceName}["${key[0]}"]`;
            }
          }
        });

        if (gvk) {
          imports.push({
            name: "ModelData",
            path: "@kubernetes-models/base"
          });

          classContent = `${trimSuffix(classContent, "}")}
static apiVersion: ${shortInterfaceName}["apiVersion"] = "${getAPIVersion(
            gvk
          )}";
static kind: ${shortInterfaceName}["kind"] = "${gvk.kind}";

constructor(data?: ModelData<${shortInterfaceName}>) {
  super({
    apiVersion: ${shortClassName}.apiVersion,
    kind: ${shortClassName}.kind,
    ...data
  } as ${shortInterfaceName});
}
}`;
        }

        imports.push({
          name: "Model",
          path: "@kubernetes-models/base"
        });

        imports.push({
          name: "addSchema",
          path: getRelativePath(path, getSchemaPath(def.schemaId))
        });

        content += `
${comment}export interface ${shortInterfaceName} ${typing}

${comment}export class ${shortClassName} extends Model<${shortInterfaceName}> implements ${shortInterfaceName} ${classContent}

Model.setSchema(${shortClassName}, ${JSON.stringify(def.schemaId)}, addSchema);
`;
      } else {
        content += `
${comment}export type ${shortInterfaceName} = ${typing};

export type ${shortClassName} = ${shortInterfaceName};
`;
      }

      content += `
export {
  ${shortInterfaceName} as ${interfaceName},
  ${shortClassName} as ${className}
};
`;

      if (imports.length) {
        content = generateImports(imports) + "\n" + content;
      }

      return {
        path,
        content
      };
    });
  };
}
