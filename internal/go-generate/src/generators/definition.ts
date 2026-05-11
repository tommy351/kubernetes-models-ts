import {
  type Generator,
  type GroupVersionKind,
  type Import,
  type Schema,
  collectRefs,
  generateImports,
  generateInterface,
  getAPIVersion,
} from "@kubernetes-models/generate";
import { formatComment, trimSuffix } from "@kubernetes-models/string-util";
import {
  getInternalDefinitionPath,
  getQualifiedClassName,
  getQualifiedInterfaceName,
  getRelativePath,
  getSchemaPath,
  isExternalRef,
} from "../utils.js";
import assert from "node:assert";
import type { Context } from "../load.js";

const externalRefReplacements: {
  prefix: string;
  replacement: string;
}[] = [
  {
    prefix: "k8s.io/apimachinery/pkg/",
    replacement: "@kubernetes-models/apimachinery/",
  },
  { prefix: "k8s.io/api/core/", replacement: "kubernetes-models/" },
  { prefix: "k8s.io/api/", replacement: "kubernetes-models/" },
  {
    prefix: "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/",
    replacement: "kubernetes-models/apiextensions.k8s.io/",
  },
];

function getClassName(id: string): string {
  const index = id.lastIndexOf("/");
  return index === -1 ? id : id.slice(index + 1);
}

function getInterfaceName(id: string): string {
  return "I" + getClassName(id);
}

function getExternalDefinitionPath(ref: string): string {
  for (const { prefix, replacement } of externalRefReplacements) {
    if (ref.startsWith(prefix)) {
      return replacement + ref.substring(prefix.length);
    }
  }

  return ref;
}

/**
 * Generates an interface for object types.
 *
 * `allOf` includes Go struct embeddings (`type A struct { B }`).
 * We must omit it before generating the interface because TypeScript
 * interface doesn't allow type merging (`interface A {} & B`). Instead,
 * we use `extends` to merge the interface content (`interface A extends B {}`).
 */
function generateObjectInterface(
  { allOf, ...schema }: Schema,
  getRefType: (ref: string) => string,
  gvk?: GroupVersionKind,
): string {
  const exts: string[] = [];

  if (gvk) {
    exts.push("TypeMeta");
  }

  for (const s of allOf ?? []) {
    assert(typeof s.$ref === "string", "allOf item must have $ref");
    exts.push(getRefType(s.$ref));
  }

  const content = generateInterface(schema, {
    getRefType,
    includeDescription: true,
  });

  return (exts.length ? `extends ${exts.join(", ")} ` : "") + content;
}

function flattenEmbedded(ctx: Context, schema: Schema): Schema {
  function resolveRef(s: Schema): Schema {
    let cur = s;
    while (typeof cur.$ref === "string") {
      const next = ctx.schemata[cur.$ref];
      if (!next) return cur;
      cur = next;
    }
    return cur;
  }

  const { allOf, ...out } = schema;
  if (!allOf) return out;

  const properties: Record<string, Schema> = {};
  const required = new Set<string>();

  for (const item of allOf) {
    const merged = flattenEmbedded(ctx, resolveRef(item));
    Object.assign(properties, merged.properties);
    for (const r of merged.required ?? []) required.add(r);
  }

  if (out.properties) Object.assign(properties, out.properties);
  for (const r of out.required ?? []) required.add(r);

  if (Object.keys(properties).length) out.properties = properties;
  if (required.size) out.required = [...required];

  return out;
}

export default function generateDefinition(ctx: Context): Generator {
  return async (definitions) => {
    return definitions.map((def) => {
      const interfaceName = getInterfaceName(def.schemaId);
      const className = getClassName(def.schemaId);
      const qualifiedInterfaceName = getQualifiedInterfaceName(def.schemaId);
      const qualifiedClassName = getQualifiedClassName(def.schemaId);
      const gvk = def.gvk?.[0];
      const imports: Import[] = [];
      const path = "./" + getInternalDefinitionPath(ctx, def.schemaId) + ".ts";
      const schemaPath = getRelativePath(path, getSchemaPath(def.schemaId));
      // Schema embeddings must be flattened to implement the interface.
      const flatSchema =
        def.schema.type === "object" ? flattenEmbedded(ctx, def.schema) : null;
      const refs = new Set([
        ...collectRefs(def.schema),
        ...(flatSchema ? collectRefs(flatSchema) : []),
      ]);
      const getRefType = getQualifiedInterfaceName;
      let content = "";
      let comment = "";

      if (def.schema.description) {
        comment = formatComment(def.schema.description, {
          deprecated: /deprecated/i.test(def.schema.description),
        });
      }

      for (const ref of refs) {
        imports.push({
          name: getQualifiedInterfaceName(ref),
          path: isExternalRef(ref)
            ? getExternalDefinitionPath(ref)
            : getRelativePath(path, getInternalDefinitionPath(ctx, ref)) +
              ".js",
        });
      }

      if (flatSchema) {
        const ifaceContent = generateObjectInterface(
          def.schema,
          getRefType,
          gvk,
        );
        let classContent = generateInterface(flatSchema, {
          getRefType,
          includeDescription: false,
        });

        imports.push({
          name: "ModelData",
          path: "@kubernetes-models/base",
        });

        if (gvk) {
          imports.push({
            name: "TypeMeta",
            path: "@kubernetes-models/base",
          });

          imports.push({
            name: "createTypeMetaGuard",
            path: "@kubernetes-models/base",
          });

          classContent = `${trimSuffix(classContent, "}")}
  static apiVersion: ${interfaceName}["apiVersion"] = "${getAPIVersion(gvk)}";
  static kind: ${interfaceName}["kind"] = "${gvk.kind}";
  static is = createTypeMetaGuard<${interfaceName}>(${className});

  constructor(data?: ModelData<${interfaceName}>) {
    super();

    this.setDefinedProps({
      apiVersion: ${className}.apiVersion,
      kind: ${className}.kind,
      ...data
    } as ${interfaceName});
  }
}`;
        } else {
          classContent = `${trimSuffix(classContent, "}")}
  constructor(data?: ModelData<${interfaceName}>) {
    super();

    this.setDefinedProps(data);
  }
}`;
        }

        imports.push({ name: "Model", path: "@kubernetes-models/base" });
        imports.push({
          name: "setValidateFunc",
          path: "@kubernetes-models/base",
        });
        imports.push({
          name: "ValidateFunc",
          path: "@kubernetes-models/validate",
        });
        imports.push({ name: "validate", path: schemaPath });

        content += `
${comment}export interface ${interfaceName} ${ifaceContent}

${comment}export class ${className} extends Model<${interfaceName}> implements ${interfaceName} ${classContent}

setValidateFunc(${className}, validate as ValidateFunc<${interfaceName}>);
      `;
      } else {
        const typing = generateInterface(def.schema, {
          getRefType,
          includeDescription: true,
        });

        content += `
${comment}export type ${interfaceName} = ${typing};

export type ${className} = ${interfaceName};
      `;
      }

      content += `
export type {
  ${interfaceName} as ${qualifiedInterfaceName},
  ${className} as ${qualifiedClassName}
};
`;

      if (imports.length) {
        content = generateImports(imports) + "\n" + content;
      }

      return { path, content };
    });
  };
}
