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

function load(input: string): readonly Definition[] {
  const { definitions } = JSON.parse(input);

  return Object.keys(definitions)
    .filter((id) => !id.startsWith("io.k8s.kubernetes."))
    .map((id) => {
      const schema: Schema = definitions[id];
      const gvks: GroupVersionKind[] =
        schema["x-kubernetes-group-version-kind"] || [];

      if (!schema.type && !schema.$ref) {
        schema.type = "object";
      }

      if (schema.type === "object" && gvks.length) {
        const { properties = {}, required = [] } = schema;

        schema.properties = {
          ...properties,
          apiVersion: {
            ...properties.apiVersion,
            type: "string",
            enum: gvks.map((x) => getAPIVersion(x))
          },
          kind: {
            ...properties.kind,
            type: "string",
            enum: gvks.map((x) => x.kind)
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

const generator = composeGenerators([
  generateDefinitions,
  generateSchemas,
  generateAliases
]);

export interface GenerateOptions {
  input: string;
  outputPath: string;
}

export async function generate(options: GenerateOptions): Promise<void> {
  const definitions = load(options.input);
  const files = await generator(definitions);

  await writeOutputFiles(options.outputPath, files);
}
