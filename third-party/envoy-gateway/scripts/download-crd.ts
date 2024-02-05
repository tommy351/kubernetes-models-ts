/* eslint-disable node/no-unpublished-import */
import { readInput } from "@kubernetes-models/read-input";
import { mkdir, writeFile } from "fs/promises";
import yaml from "js-yaml";
import { dirname, join } from "path";

const VERSION = "0.6.0";

const outputPath = join(__dirname, "../crds/crd.yaml");

(async () => {
  const content = await readInput(
    `https://github.com/envoyproxy/gateway/releases/download/v${VERSION}/install.yaml`
  );
  const manifests: any[] = yaml.loadAll(content);
  const output: any[] = [];

  for (const manifest of manifests) {
    if (
      manifest &&
      manifest.apiVersion === "apiextensions.k8s.io/v1" &&
      manifest.kind === "CustomResourceDefinition" &&
      manifest.spec?.group === "gateway.envoyproxy.io"
    ) {
      output.push(manifest);
    }
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output.map((x) => yaml.dump(x)).join("---\n"));
})();
