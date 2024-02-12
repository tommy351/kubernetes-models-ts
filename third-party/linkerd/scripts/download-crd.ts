/* eslint-disable node/no-unpublished-import */
import execa from "execa";
import { mkdir, writeFile } from "fs/promises";
import yaml from "js-yaml";
import { dirname, join } from "path";

const outputPath = join(__dirname, "../crds/crd.yaml");

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === "object" && obj != null;
}

async function render(name: string, version: string): Promise<string> {
  const result = await execa("helm", [
    "template",
    "--repo",
    "https://helm.linkerd.io/stable",
    name,
    name,
    "--version",
    version
  ]);

  return result.stdout;
}

(async () => {
  const commands = [
    await render("linkerd-crds", "1.8.0"),
    await render("linkerd-multicluster", "30.11.10")
  ];
  const manifests = yaml.loadAll(commands.join("---\n"));
  const chunks: string[] = [];

  for (const manifest of manifests) {
    if (
      isObject(manifest) &&
      manifest.kind === "CustomResourceDefinition" &&
      isObject(manifest.metadata) &&
      typeof manifest.metadata.name === "string" &&
      !manifest.metadata.name.endsWith("networking.k8s.io")
    ) {
      chunks.push(yaml.dump(manifest));
    }
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, chunks.join("---\n"));
})();
