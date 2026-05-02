import { readInput } from "@kubernetes-models/read-input";
import { mkdir, writeFile } from "fs/promises";
import * as yaml from "js-yaml";
import { dirname } from "path";
import { fileURLToPath } from "url";

const VERSIONS = ["0.5.0", "1.0.0"];

const outputPath = fileURLToPath(new URL("../crds/crd.yaml", import.meta.url));
const output: any[] = [];

for (const version of VERSIONS) {
  const content = await readInput(
    `https://github.com/envoyproxy/gateway/releases/download/v${version}/install.yaml`
  );
  const manifests: any[] = yaml.loadAll(content);

  for (const manifest of manifests) {
    if (
      manifest &&
      manifest.apiVersion === "apiextensions.k8s.io/v1" &&
      manifest.kind === "CustomResourceDefinition" &&
      (manifest.spec?.group === "config.gateway.envoyproxy.io" ||
        manifest.spec?.group === "gateway.envoyproxy.io")
    ) {
      output.push(manifest);
    }
  }
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, output.map((x) => yaml.dump(x)).join("---\n"));
