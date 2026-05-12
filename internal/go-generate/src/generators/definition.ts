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
  getKind,
  getPackage,
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
    prefix: "io.k8s.apimachinery.pkg.",
    replacement: "@kubernetes-models/apimachinery/",
  },
  { prefix: "io.k8s.api.core.", replacement: "kubernetes-models/" },
  { prefix: "io.k8s.api.", replacement: "kubernetes-models/" },
  {
    prefix: "io.k8s.apiextensions-apiserver.pkg.apis.apiextensions.",
    replacement: "kubernetes-models/apiextensions.k8s.io/",
  },
  {
    prefix: "io.k8s.sigs.gateway-api.apis.",
    replacement: "@kubernetes-models/gateway-api/gateway.networking.k8s.io/",
  },
];

function getExternalDefinitionPath(ctx: Context, ref: string): string {
  // K8s API groups like `networking.k8s.io` collapse in the Go schema id
  // (`io.k8s.api.networking.v1.X`) but `kubernetes-models` publishes them
  // under the full group/version path (`networking.k8s.io/v1/X`). When the
  // package exposes a `.k8s.io` group, prefer it over the prefix-stripped
  // path so the import resolves.
  if (ref.startsWith("io.k8s.api.")) {
    const pkg = getPackage(ctx, ref);
    if (pkg?.group && pkg.version && pkg.group.endsWith(".k8s.io")) {
      return `kubernetes-models/${pkg.group}/${pkg.version}/${getKind(ref)}`;
    }
  }

  for (const { prefix, replacement } of externalRefReplacements) {
    if (ref.startsWith(prefix)) {
      return replacement + ref.substring(prefix.length).split(".").join("/");
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

function hasTopLevelValidationBranches(schema: Schema): boolean {
  return Boolean(schema.anyOf || schema.oneOf);
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
      const className = getKind(def.schemaId);
      const interfaceName = "I" + className;
      const qualifiedInterfaceName = getQualifiedInterfaceName(def.schemaId);
      const qualifiedClassName = getQualifiedClassName(def.schemaId);
      const gvk = def.gvk?.[0];
      const imports: Import[] = [];
      const path = getInternalDefinitionPath(ctx, def.schemaId) + ".ts";
      const schemaPath = getRelativePath(path, getSchemaPath(def.schemaId));
      // Map-alias schemas (`type Foo map[K]V` → object with only
      // `additionalProperties`) must emit as a type alias; their index
      // signature is incompatible with the methods Model adds to the class.
      // Non-GVK objects with top-level `oneOf`/`anyOf` also emit as type aliases
      // because TypeScript interfaces/classes cannot represent that union body.
      const shouldEmitClass =
        def.schema.type === "object" &&
        (def.schema.properties || def.schema.allOf || gvk) &&
        Boolean(gvk || !hasTopLevelValidationBranches(def.schema));
      // Schema embeddings must be flattened to implement the interface.
      const flatSchema = shouldEmitClass
        ? flattenEmbedded(ctx, def.schema)
        : null;
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
          path: isExternalRef(ctx, ref)
            ? getExternalDefinitionPath(ctx, ref)
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
