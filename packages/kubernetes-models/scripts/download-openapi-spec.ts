/* eslint-disable node/no-unpublished-import */
import { join } from "path";
import { readInput } from "@kubernetes-models/read-input";
import { outputJson } from "fs-extra";

/**
 * Older versions first. Add only versions with removed APIs and latest version.
 *
 * Check the following link for removed APIs.
 * https://kubernetes.io/docs/reference/using-api/deprecation-guide/
 */
const VERSIONS = [
  // Versions with removed APIs
  "1.15.9",
  "1.21.3",
  // Latest version
  "1.22.0"
];

interface OpenAPISpec {
  definitions?: Record<string, unknown>;
  [key: string]: unknown;
}

function mergeOpenAPISpec(
  oldData: OpenAPISpec,
  newData: OpenAPISpec
): OpenAPISpec {
  const { definitions: oldDefs = {} } = oldData;
  const { definitions: newDefs = {}, ...data } = newData;

  return {
    ...data,
    definitions: {
      ...oldDefs,
      ...newDefs
    }
  };
}

async function readJson(version: string): Promise<OpenAPISpec> {
  console.log("Downloading OpenAPI specification:", version);

  const content = await readInput(
    `https://raw.githubusercontent.com/kubernetes/kubernetes/v${version}/api/openapi-spec/swagger.json`
  );

  return JSON.parse(content);
}

(async () => {
  let data: OpenAPISpec = {};

  for (const version of VERSIONS) {
    data = mergeOpenAPISpec(data, await readJson(version));
  }

  await outputJson(join(__dirname, "../openapi/spec.json"), data, {
    spaces: 2
  });
})();
