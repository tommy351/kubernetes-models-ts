import {
  generate,
  isAPIMachineryID
} from "@kubernetes-models/openapi-generate";
import { readInput } from "@kubernetes-models/read-input";
import { type OpenAPIV2 } from "openapi-types";
import { mapValues, omit } from "es-toolkit";
import { trimPrefix } from "@kubernetes-models/string-util";
import { fileURLToPath } from "node:url";

type Document = OpenAPIV2.Document<any>;

// The following version should match the latest version in `first-part/kubernetes-models/scripts/build.ts`.
const VERSION = "1.33.0";

async function fetchSpec(): Promise<Document> {
  return JSON.parse(
    await readInput(
      `https://raw.githubusercontent.com/tommy351/kubernetes-openapi-spec/main/openapi/${VERSION}.json`
    )
  );
}

function pickAPIMachinerySpec(doc: Document): void {
  if (!doc.definitions) return;

  doc.definitions = Object.fromEntries(
    Object.entries(doc.definitions).filter(([key]) => isAPIMachineryID(key))
  );
}

/**
 * Remove GVK info to prevent openapi-generate moving definition files based on
 * their GVKs.
 */
function omitGVK(doc: Document): void {
  if (!doc.definitions) return;

  doc.definitions = mapValues(doc.definitions, (def) =>
    omit(def, ["x-kubernetes-group-version-kind"])
  );
}

const spec = await fetchSpec();

pickAPIMachinerySpec(spec);
omitGVK(spec);

await generate({
  input: JSON.stringify(spec),
  outputPath: fileURLToPath(new URL("../gen", import.meta.url)),
  rewriteDefinitionPath(path) {
    return trimPrefix(path, "apimachinery/pkg/");
  }
});
