import { readInput } from "@kubernetes-models/read-input";
import { mkdir, writeFile } from "node:fs/promises";
import * as yaml from "js-yaml";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = "0.25.3";
const CRDS = [
  "clickhouseinstallations.clickhouse",
  "clickhouseinstallationtemplates.clickhouse",
  "clickhousekeeperinstallations.clickhouse-keeper",
  "clickhouseoperatorconfigurations.clickhouse"
];

const outputPath = fileURLToPath(new URL("../crds/crd.yaml", import.meta.url));
const output: any[] = [];

for (const crd of CRDS) {
  const content = await readInput(
    `https://raw.githubusercontent.com/Altinity/clickhouse-operator/refs/tags/release-${VERSION}/deploy/helm/clickhouse-operator/crds/CustomResourceDefinition-${crd}.altinity.com.yaml`
  );

  output.push(yaml.load(content.replace(/!!merge */g, "")));
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, output.map((x) => yaml.dump(x)).join("---\n"));
