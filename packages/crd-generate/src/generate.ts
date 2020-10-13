import yaml from "js-yaml";
import { join, dirname } from "path";
import { writeFile } from "fs";
import makeDir from "make-dir";
import { promisify } from "util";
import {
  formatComment,
  stripComment,
  trimSuffix
} from "@kubernetes-models/string-util";

const writeFileAsync = promisify(writeFile);

export interface GenerateOptions {
  input: string;
  outputPath: string;
}

interface CustomResourceDefinition {
  spec: CustomResourceDefinitionSpec;
}

interface CustomResourceDefinitionSpec {
  group: string;
  names: CustomResourceDefinitionNames;
  validation?: CustomResourceDefinitionValidation;
  version?: string;
  versions?: CustomResourceDefinitionVersion[];
}

interface CustomResourceDefinitionNames {
  categories?: string[];
  kind: string;
  listKind?: string;
  plural: string;
  shortNames?: string[];
  singular?: string;
}

interface CustomResourceDefinitionVersion {
  name: string;
  schema?: CustomResourceDefinitionValidation;
}

interface CustomResourceDefinitionValidation {
  openAPIV3Schema: OpenAPIV3Schema;
}

interface OpenAPIV3Schema {
  description?: string;
  type?: string;
  format?: string;
  properties?: { [key: string]: OpenAPIV3Schema };
  additionalProperties?: OpenAPIV3Schema;
  required?: string[];
  items?: OpenAPIV3Schema;
  enum?: any[];
  deprecated?: boolean;

  // non-standard
  $literal?: string;
}

interface GenerateDefinitionOptions {
  group: string;
  version: string;
  kind: string;
  validation: CustomResourceDefinitionValidation;
}

export interface GenerateResult {
  path: string;
  content: string;
}

function compileType(schema: OpenAPIV3Schema): string {
  if (schema.$literal) {
    return schema.$literal;
  }

  if (!schema.type) {
    if (schema.properties) {
      schema.type = "object";
    } else if (schema.items) {
      schema.type = "array";
    }
  }

  switch (schema.type) {
    case "object": {
      const { properties = {}, required = [], additionalProperties } = schema;
      let output = "{\n";

      for (const key of Object.keys(properties)) {
        const prop = properties[key];

        if (typeof prop.description === "string") {
          output += formatComment(prop.description, {
            deprecated:
              prop.deprecated ||
              prop.description.toLowerCase().startsWith("deprecated")
          });
        }

        output += `"${key}"`;
        if (!~required.indexOf(key)) output += "?";
        output += ": " + compileType(prop) + ";\n";
      }

      if (additionalProperties) {
        output += `[key: string]: ${compileType(additionalProperties)};\n`;
      }

      output += "}";

      return output;
    }

    case "string":
      if (schema.enum && schema.enum.length) {
        return schema.enum.map((x) => JSON.stringify(x)).join(" | ");
      }

      switch (schema.format) {
        case "int-or-string":
          return "string | number";

        default:
          return "string";
      }

    case "number":
    case "integer":
      return "number";

    case "boolean":
      return "boolean";

    case "array":
      if (schema.items) {
        return `Array<${compileType(schema.items)}>`;
      }

      return "any[]";

    case "null":
      return "null";
  }

  return "any";
}

async function generateDefinition(
  options: GenerateDefinitionOptions
): Promise<GenerateResult> {
  const path = join(options.group, options.version, options.kind) + ".ts";
  const apiVersion = `${options.group}/${options.version}`;
  const schema = options.validation.openAPIV3Schema;
  const metadataTypeName = "IObjectMeta";
  const { properties = {}, required = [] } = schema;
  const interfaceName = "I" + options.kind;
  const className = options.kind;

  schema.properties = {
    ...properties,
    apiVersion: {
      ...properties.apiVersion,
      type: "string",
      enum: [apiVersion]
    },
    kind: {
      ...properties.kind,
      type: "string",
      enum: [options.kind]
    },
    metadata: {
      ...properties.metadata,
      $literal: metadataTypeName
    }
  };
  schema.required = [...new Set([...required, "apiVersion", "kind"])];

  const typing = compileType(schema);
  let classContent = `${trimSuffix(stripComment(typing), "}")}
static apiVersion: ${interfaceName}["apiVersion"] = "${apiVersion}";
static kind: ${interfaceName}["kind"] = "${options.kind}";
}`;

  classContent = classContent.replace(
    /"(apiVersion|kind)": "([^"]+)";/g,
    `$1: ${interfaceName}["$1"] = ${className}["$1"];`
  );

  return {
    path,
    content: `import { Model } from "@kubernetes-models/base";
import { register } from "@kubernetes-models/validate";
import { IObjectMeta } from "kubernetes-models/apimachinery/pkg/apis/meta/v1/ObjectMeta";

export interface ${interfaceName} ${typing}

export class ${className} extends Model<${interfaceName}> implements ${interfaceName} ${classContent}

const schemaId = "${options.group}.${options.version}.${options.kind}";
const schema = ${JSON.stringify(
      options.validation.openAPIV3Schema,
      null,
      "  "
    )};

Model.setSchema(${className}, schemaId, () => {
  register(schemaId, schema);
});
`
  };
}

async function generateCRD(
  crd: CustomResourceDefinition
): Promise<GenerateResult[]> {
  const results: GenerateResult[] = [];
  const group = crd.spec.group;
  const kind = crd.spec.names.kind;

  if (Array.isArray(crd.spec.versions) && crd.spec.versions.length) {
    for (const version of crd.spec.versions) {
      const validation = version.schema || crd.spec.validation;

      if (validation) {
        results.push(
          await generateDefinition({
            group,
            version: version.name,
            kind,
            validation
          })
        );
      }
    }
  } else if (crd.spec.version) {
    const validation = crd.spec.validation;

    if (validation) {
      results.push(
        await generateDefinition({
          group,
          version: crd.spec.version,
          kind,
          validation
        })
      );
    }
  }

  return results;
}

export async function generate(options: GenerateOptions): Promise<void> {
  const data: CustomResourceDefinition[] = yaml
    .safeLoadAll(options.input)
    .filter((x) => x != null && typeof x === "object")
    .filter(({ apiVersion }) =>
      ["apiextensions.k8s.io/v1beta1", "apiextensions.k8s.io/v1"].includes(
        apiVersion
      )
    )
    .filter(({ kind }) => kind === "CustomResourceDefinition");
  const generatedPaths = new Set<string>();

  for (const crd of data) {
    const files = await generateCRD(crd);

    for (const file of files) {
      if (generatedPaths.has(file.path)) {
        throw new Error(`Path conflict: ${file.path}`);
      }

      const path = join(options.outputPath, file.path);

      await makeDir(dirname(path));
      await writeFileAsync(path, file.content);
      generatedPaths.add(file.path);
      console.log("Generating:", file.path);
    }
  }
}
