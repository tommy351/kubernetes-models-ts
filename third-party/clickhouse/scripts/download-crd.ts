/* eslint-disable node/no-unpublished-import */
import { readInput } from "@kubernetes-models/read-input";
import { mkdir, writeFile } from "fs/promises";
import yaml from "js-yaml";
import { dirname, join } from "path";

const VERSION = "0.25.3";
const CRDS = [
  "clickhouseinstallations.clickhouse",
  "clickhouseinstallationtemplates.clickhouse",
  "clickhousekeeperinstallations.clickhouse-keeper",
  "clickhouseoperatorconfigurations.clickhouse"
];

const outputPath = join(__dirname, "../crds/crd.yaml");

(async () => {
  const output: any[] = [];

  for (const crd of CRDS) {
    const content = await readInput(
      `https://raw.githubusercontent.com/Altinity/clickhouse-operator/refs/tags/release-${VERSION}/deploy/helm/clickhouse-operator/crds/CustomResourceDefinition-${crd}.altinity.com.yaml`
    );

    output.push(yaml.load(content.replace(/!!merge */g, "")));
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output.map((x) => yaml.dump(x)).join("---\n"));
})();
