/* eslint-disable node/no-unpublished-import */
import execa from "execa";
import { mkdir, writeFile } from "fs/promises";
import yaml from "js-yaml";
import { dirname, join } from "path";

const helmCRDsVersion = "1.8.0";
const helmMultiClusterVersion = "30.11.10";

const outputPath = join(__dirname, "../crds/crd.yaml");

(async () => {
  const commands = [
    await execa("helm", [
      "template",
      "--repo",
      "https://helm.linkerd.io/stable",
      "linkerd-crds",
      "linkerd-crds",
      "--namespace",
      "linkerd",
      "--version",
      helmCRDsVersion
    ]),
    await execa("helm", [
      "template",
      "--repo",
      "https://helm.linkerd.io/stable",
      "linkerd-multicluster",
      "linkerd-multicluster",
      "--namespace",
      "linkerd-multicluster",
      "--version",
      helmMultiClusterVersion
    ])
  ];

  const manifests: any[] = yaml.loadAll(
    commands.map((x) => x.stdout).join("---\n")
  );
  const output: any[] = [];

  for (const manifest of manifests) {
    if (manifest && manifest.kind === "CustomResourceDefinition") {
      output.push(manifest);
    }
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output.map((x) => yaml.dump(x)).join("---\n"));
})();
