import {
  composeGenerators,
  Definition,
  getAPIVersion,
  GroupVersionKind,
  Schema,
  writeOutputFiles
} from "@kubernetes-models/generate";
import generateDefinitions from "./generators/definition";
import generateSchemas from "./generators/schema";
import generateAliases from "./generators/alias";
import { uniq } from "lodash";
import { buildContext } from "./context";

function load(input: string): Definition[] {
  const { definitions } = JSON.parse(input);

  return Object.keys(definitions)
    .filter((id) => !id.startsWith("io.k8s.kubernetes."))
    .map((id) => {
      let schema: Schema = definitions[id];

      switch (id) {
        case "io.k8s.apimachinery.pkg.api.resource.Quantity":
          schema = {
            oneOf: [{ type: "number" }, { type: "string", format: "quantity" }]
          };
      }

      const gvks: GroupVersionKind[] =
        schema["x-kubernetes-group-version-kind"] || [];

      if (!schema.type && !schema.$ref && !schema.oneOf) {
        schema.type = "object";
      }

      if (schema.type === "object" && gvks.length) {
        const { properties = {}, required = [] } = schema;

        schema.properties = {
          ...properties,
          apiVersion: {
            ...properties.apiVersion,
            type: "string",
            enum: uniq(gvks.map((x) => getAPIVersion(x)))
          },
          kind: {
            ...properties.kind,
            type: "string",
            enum: uniq(gvks.map((x) => x.kind))
          }
        };

        schema.required = [...new Set([...required, "apiVersion", "kind"])];
      }

      return {
        gvk: gvks,
        schema,
        schemaId: id
      };
    });
}

export interface GenerateOptions {
  input: string;
  outputPath: string;
}

export async function generate(options: GenerateOptions): Promise<void> {
  const definitions = load(options.input);
  const ctx = buildContext(definitions);
  const generator = composeGenerators([
    generateDefinitions(ctx),
    generateSchemas,
    generateAliases(ctx)
  ]);
  const files = await generator(definitions);

  await writeOutputFiles(options.outputPath, files);
}
