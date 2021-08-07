/* eslint-disable node/no-unpublished-import */
import execa from "execa";
import { outputFile } from "fs-extra";
import { join } from "path";
import { parse, stringify } from "yaml";

const CRDS: readonly string[] = [
  "backendconfigs.cloud.google.com",
  "frontendconfigs.networking.gke.io",
  "managedcertificates.networking.gke.io",
  "servicenetworkendpointgroups.networking.gke.io"
];

const CRD_DIR = join(__dirname, "../crd");

function formatCRD(data: any): any {
  return {
    apiVersion: data.apiVersion,
    kind: data.kind,
    metadata: {
      name: data.metadata.name
    },
    spec: data.spec
  };
}

async function dumpCRD(name: string): Promise<void> {
  console.log("Dumping CRD:", name);

  const { stdout } = await execa("kubectl", ["get", "crd", name, "-o", "yaml"]);
  const data = formatCRD(parse(stdout));
  const path = join(CRD_DIR, name.split(".")[0]) + ".yaml";

  outputFile(path, stringify(data));
}

(async () => {
  for (const crd of CRDS) {
    await dumpCRD(crd);
  }
})();
