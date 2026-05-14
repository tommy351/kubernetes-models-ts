import { readInput } from "@kubernetes-models/read-input";
import { mkdir, writeFile } from "node:fs/promises";
import * as yaml from "js-yaml";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const VERSION = "1.19.5";

const outputPath = fileURLToPath(new URL("../crds/crd.yaml", import.meta.url));
const content = await readInput(
  `https://raw.githubusercontent.com/rook/rook/v${VERSION}/deploy/examples/crds.yaml`,
);

// Rook ships a single combined CRD bundle. A handful of subschemas use
// `nullable: true` without an explicit `type`, which Ajv rejects. The
// crd-generate pipeline infers `type: object`/`array` from `properties`/`items`,
// but composition keywords (`anyOf`/`allOf`/`oneOf`) leave the schema untyped.
// Walk the tree and patch those leaves.
function patchNullable(node: unknown): void {
  if (Array.isArray(node)) {
    for (const item of node) patchNullable(item);
    return;
  }
  if (!node || typeof node !== "object") return;

  const obj = node as Record<string, unknown>;
  if (
    obj.nullable === true &&
    typeof obj.type !== "string" &&
    !("properties" in obj) &&
    !("items" in obj) &&
    !("$ref" in obj)
  ) {
    if (Array.isArray(obj.anyOf) || Array.isArray(obj.oneOf)) {
      // `x-kubernetes-int-or-string: true` patterns. Use `string` so the
      // generated TS schema accepts the canonical string form (e.g. "5Gi");
      // Ajv will still accept it and pattern validation handles numbers.
      obj.type = "string";
    }
  }

  for (const value of Object.values(obj)) {
    patchNullable(value);
  }
}

const manifests = yaml
  .loadAll(content)
  .filter(
    (m: any) =>
      m &&
      m.apiVersion === "apiextensions.k8s.io/v1" &&
      m.kind === "CustomResourceDefinition",
  );

for (const manifest of manifests as any[]) {
  for (const version of manifest.spec.versions ?? []) {
    if (version.schema?.openAPIV3Schema) {
      patchNullable(version.schema.openAPIV3Schema);
    }
  }
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, manifests.map((x) => yaml.dump(x)).join("---\n"));
