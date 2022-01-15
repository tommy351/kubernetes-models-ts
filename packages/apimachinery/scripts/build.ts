/* eslint-disable node/no-unpublished-import */
import { generate } from "@kubernetes-models/openapi-generate";
import { readInput } from "@kubernetes-models/read-input";
import { join } from "path";
import { OpenAPIV2 } from "openapi-types";

type Document = OpenAPIV2.Document<any>;

const VERSION = "1.22.0";

async function fetchSpec(): Promise<Document> {
  return JSON.parse(
    await readInput(
      `https://raw.githubusercontent.com/kubernetes/kubernetes/v${VERSION}/api/openapi-spec/swagger.json`
    )
  );
}

function pickAPIMachinerySpec(doc: Document): void {
  if (!doc.definitions) return;

  doc.definitions = Object.fromEntries(
    Object.entries(doc.definitions).filter(([key]) =>
      key.startsWith("io.k8s.apimachinery.")
    )
  );
}

(async () => {
  const spec = await fetchSpec();

  pickAPIMachinerySpec(spec);

  await generate({
    input: JSON.stringify(spec),
    outputPath: join(__dirname, "../gen")
  });
})();
