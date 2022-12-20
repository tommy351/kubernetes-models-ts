/* eslint-disable node/no-unpublished-import */
import { readInput } from "@kubernetes-models/read-input";
import { mkdir, writeFile } from "fs/promises";
import yaml from "js-yaml";
import { dirname, join } from "path";

const VERSION = "1.27.0";

const outputPath = join(__dirname, "../crds/crd.yaml");

(async () => {
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
})();
