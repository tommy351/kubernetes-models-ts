/* eslint-disable node/no-unpublished-import */
import {
  generate,
  mergeOpenAPISpecs
} from "@kubernetes-models/openapi-generate";
import { readInput } from "@kubernetes-models/read-input";
import { join } from "path";
import { OpenAPIV2 } from "openapi-types";

type Document = OpenAPIV2.Document<any>;

/**
 * Older versions first. Add only versions with removed APIs and latest version.
 *
 * Check the following link for removed APIs.
 * https://kubernetes.io/docs/reference/using-api/deprecation-guide/
 */
const VERSIONS = [
  // Old versions with removed APIs
  "1.15.9",
  "1.21.3",
  // Latest version
  "1.22.0"
];

async function fetchSpec(): Promise<Document> {
  const specs: OpenAPIV2.Document[] = [];

  for (const ver of VERSIONS) {
    const url = `https://raw.githubusercontent.com/kubernetes/kubernetes/v${ver}/api/openapi-spec/swagger.json`;

    console.log("Reading:", url);
    specs.push(JSON.parse(await readInput(url)));
  }

  return mergeOpenAPISpecs<Document>(specs);
}

function patchStatefulSetSpec(spec: Document): void {
  const pvcSpec =
    spec.definitions?.["io.k8s.api.core.v1.PersistentVolumeClaim"];
  if (!pvcSpec) return;

  const volumeClaimTemplates =
    spec.definitions?.["io.k8s.api.apps.v1.StatefulSetSpec"]?.properties
      ?.volumeClaimTemplates;
  if (!volumeClaimTemplates || !volumeClaimTemplates.items) return;

  volumeClaimTemplates.items = pvcSpec as any;
}

(async () => {
  const spec = await fetchSpec();

  patchStatefulSetSpec(spec);

  await generate({
    input: JSON.stringify(spec),
    outputPath: join(__dirname, "../gen")
  });
})();
