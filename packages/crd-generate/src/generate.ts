import yaml from "js-yaml";
import { mapValues } from "lodash";
import {
  composeGenerators,
  Definition,
  GroupVersionKind,
  writeOutputFiles,
  Schema,
  getAPIVersion
} from "@kubernetes-models/generate";
import generateDefinitions from "./generators/definition";
import generateAliases from "./generators/alias";

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
  openAPIV3Schema: Schema;
}

function fixMissingSchemaType(schema: Schema): void {
  if (!schema.type) {
    if (schema.properties) {
      schema.type = "object";
    } else if (schema.items) {
      schema.type = "array";
    }
  }
}

function formatSchema(schema: Schema): Schema {
  fixMissingSchemaType(schema);

  switch (schema.type) {
    case "object": {
      const { properties = {}, additionalProperties } = schema;

      return {
        ...schema,
        properties: mapValues(properties, (prop) => formatSchema(prop)),
        ...(additionalProperties && {
          additionalProperties: formatSchema(additionalProperties)
        })
      };
    }

    case "array":
      return {
        ...schema,
        ...(schema.items && { items: formatSchema(schema.items) })
      };

    case "number":
    case "integer": {
      const { minimum, maximum, exclusiveMinimum, exclusiveMaximum, ...rest } =
        schema;

      return {
        ...rest,
        ...(exclusiveMinimum === true
          ? {
              exclusiveMinimum: minimum
            }
          : { exclusiveMinimum, minimum }),
        ...(exclusiveMaximum === true
          ? {
              exclusiveMaximum: maximum
            }
          : { exclusiveMaximum, maximum })
      };
    }
  }

  return schema;
}

function generateDefinition(
  gvk: GroupVersionKind,
  validation: CustomResourceDefinitionValidation
): Definition {
  const {
    properties = {},
    required = [],
    ...schema
  } = formatSchema(validation.openAPIV3Schema);

  schema.properties = {
    ...properties,
    apiVersion: {
      ...properties.apiVersion,
      type: "string",
      enum: [getAPIVersion(gvk)]
    },
    kind: {
      ...properties.kind,
      type: "string",
      enum: [gvk.kind]
    },
    metadata: {
      $ref: "io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta#"
    }
  };

  schema.required = [...new Set([...required, "apiVersion", "kind"])];

  return {
    gvk: [gvk],
    schemaId: `${gvk.group}.${gvk.version}.${gvk.kind}`,
    schema
  };
}

const generator = composeGenerators([generateDefinitions, generateAliases]);

export interface GenerateOptions {
  input: string;
  outputPath: string;
}

export async function generate(options: GenerateOptions): Promise<void> {
  const data: CustomResourceDefinition[] = yaml
    .loadAll(options.input)
    .filter((x) => x != null && typeof x === "object")
    .filter(({ apiVersion }) =>
      ["apiextensions.k8s.io/v1beta1", "apiextensions.k8s.io/v1"].includes(
        apiVersion
      )
    )
    .filter(({ kind }) => kind === "CustomResourceDefinition");
  const definitions: Definition[] = [];

  for (const crd of data) {
    const group = crd.spec.group;
    const kind = crd.spec.names.kind;

    if (Array.isArray(crd.spec.versions) && crd.spec.versions.length) {
      for (const version of crd.spec.versions) {
        const validation = version.schema || crd.spec.validation;
        const gvk = {
          group,
          version: version.name,
          kind
        };

        if (validation) {
          definitions.push(generateDefinition(gvk, validation));
        }
      }
    } else if (crd.spec.version) {
      const validation = crd.spec.validation;
      const gvk = {
        group,
        kind,
        version: crd.spec.version
      };

      if (validation) {
        definitions.push(generateDefinition(gvk, validation));
      }
    }
  }

  const files = await generator(definitions);

  await writeOutputFiles(options.outputPath, files);
}
