import { readInput } from "@kubernetes-models/read-input";
import { mkdir, writeFile } from "node:fs/promises";
import * as yaml from "js-yaml";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = "1.31.0";

const outputPath = fileURLToPath(new URL("../crds/crd.yaml", import.meta.url));
const content = await readInput(
  `https://raw.githubusercontent.com/fluxcd/flagger/v${VERSION}/artifacts/flagger/crd.yaml`
);
const manifests: any[] = yaml.loadAll(content);

for (const manifest of manifests) {
  if (
    manifest.apiVersion === "apiextensions.k8s.io/v1" &&
    manifest.kind === "CustomResourceDefinition"
  ) {
    for (const ver of manifest.spec.versions) {
      // The original description of `apiVersion` and `kind` is invalid in YAML.
      // Reset these properties to fix the issue.
      ver.schema.openAPIV3Schema.properties.apiVersion = { type: "string" };
      ver.schema.openAPIV3Schema.properties.kind = { type: "string" };
    }
  }
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, manifests.map((x) => yaml.dump(x)).join("---\n"));
