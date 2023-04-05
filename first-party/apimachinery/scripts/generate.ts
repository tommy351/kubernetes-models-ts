/* eslint-disable node/no-unpublished-import */
import {
  generate,
  isAPIMachineryID
} from "@kubernetes-models/openapi-generate";
import { readInput } from "@kubernetes-models/read-input";
import { join } from "path";
import { OpenAPIV2 } from "openapi-types";
import { mapValues, omit } from "lodash";
import { trimPrefix } from "@kubernetes-models/string-util";

type Document = OpenAPIV2.Document<any>;

// The following version should match the latest version in `first-part/kubernetes-models/scripts/build.ts`.
const VERSION = "1.25.0";

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
    omit(def, "x-kubernetes-group-version-kind")
  );
}

(async () => {
  const spec = await fetchSpec();

  pickAPIMachinerySpec(spec);
  omitGVK(spec);

  await generate({
    input: JSON.stringify(spec),
    outputPath: join(__dirname, "../gen"),
    rewriteDefinitionPath(path) {
      return trimPrefix(path, "apimachinery/pkg/");
    }
  });
})();
