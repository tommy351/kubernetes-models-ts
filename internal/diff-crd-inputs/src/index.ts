import { readFile } from "node:fs/promises";
import { execa } from "execa";
import yargs from "yargs";
import { parseAllDocuments } from "yaml";
import { type GroupVersionKind } from "@kubernetes-models/generate";
import { readInput } from "@kubernetes-models/read-input";

interface CRDDiff {
  removedKinds: string[];
  removedVersions: string[];
}

function kindKey(crd: GroupVersionKind): string {
  return `${crd.group}/${crd.kind}`;
}

async function readInputAt(
  ref: string | null,
  relPath: string,
): Promise<string[]> {
  let content: string;
  try {
    content =
      ref === null
        ? await readFile(relPath, "utf8")
        : (await execa("git", ["show", `${ref}:${relPath}`])).stdout;
  } catch (err) {
    console.error(
      `[warn] cannot read ${relPath} at ${ref ?? "working tree"}: ${(err as Error).message}`,
    );
    return [];
  }
  try {
    const json = JSON.parse(content);
    const input = json?.["crd-generate"]?.input;
    return Array.isArray(input)
      ? input.filter((s) => typeof s === "string")
      : [];
  } catch (err) {
    console.error(
      `[warn] invalid JSON in ${relPath} at ${ref ?? "working tree"}: ${(err as Error).message}`,
    );
    return [];
  }
}

function extractCRDs(doc: unknown): GroupVersionKind[] {
  if (!doc || typeof doc !== "object") return [];
  const d = doc as Record<string, any>;
  if (d.kind !== "CustomResourceDefinition") return [];
  const group: unknown = d.spec?.group;
  const kind: unknown = d.spec?.names?.kind;
  if (typeof group !== "string" || typeof kind !== "string") return [];
  const out: GroupVersionKind[] = [];
  if (Array.isArray(d.spec?.versions)) {
    for (const v of d.spec.versions) {
      if (typeof v?.name === "string") {
        out.push({ group, kind, version: v.name });
      }
    }
  } else if (typeof d.spec?.version === "string") {
    out.push({ group, kind, version: d.spec.version });
  }
  return out;
}

async function fetchUrlCRDs(url: string): Promise<GroupVersionKind[]> {
  let text: string;
  try {
    text = await readInput(url);
  } catch (err) {
    console.error(`[warn] ${(err as Error).message}`);
    return [];
  }
  let docs: unknown[];
  try {
    docs = parseAllDocuments(text).map((d) => d.toJS());
  } catch (err) {
    console.error(`[warn] parse failed ${url}: ${(err as Error).message}`);
    return [];
  }
  return docs.flatMap(extractCRDs);
}

function indexByKind(crds: GroupVersionKind[]): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  for (const crd of crds) {
    const key = kindKey(crd);
    let versions = out.get(key);
    if (!versions) {
      versions = new Set();
      out.set(key, versions);
    }
    versions.add(crd.version);
  }
  return out;
}

function buildDiff(
  oldCrds: GroupVersionKind[],
  newCrds: GroupVersionKind[],
): CRDDiff {
  const oldIdx = indexByKind(oldCrds);
  const newIdx = indexByKind(newCrds);
  const removedKinds: string[] = [];
  const removedVersions: string[] = [];
  for (const [kind, oldVersions] of oldIdx) {
    const newVersions = newIdx.get(kind);
    if (!newVersions) {
      removedKinds.push(kind);
      continue;
    }
    for (const v of oldVersions) {
      if (!newVersions.has(v)) {
        removedVersions.push(`${kind}/${v}`);
      }
    }
  }
  removedKinds.sort();
  removedVersions.sort();
  return { removedKinds, removedVersions };
}

function printReport(pkg: string, diff: CRDDiff): void {
  console.log(`## ${pkg}`);
  if (diff.removedKinds.length === 0 && diff.removedVersions.length === 0) {
    console.log("  no CRD kinds or versions removed");
    return;
  }
  if (diff.removedKinds.length) {
    console.log("removed kinds:");
    for (const k of diff.removedKinds) {
      console.log(`  - ${k}`);
    }
  }
  if (diff.removedVersions.length) {
    console.log("removed versions:");
    for (const v of diff.removedVersions) {
      console.log(`  - ${v}`);
    }
  }
  console.log(
    "\n# Suggestion: keep the old yaml URL and add the new yaml URL to crd-generate.input.",
  );
}

async function main(): Promise<void> {
  const args = await yargs(process.argv.slice(2))
    .option("package", {
      type: "string",
      demandOption: true,
      description: "Package path (e.g. third-party/cert-manager)",
    })
    .option("base", {
      type: "string",
      default: "master",
      description: "Git ref to compare against (old)",
    })
    .option("head", {
      type: "string",
      description: "Git ref to compare from (new). Defaults to working tree.",
    })
    .option("json", {
      type: "boolean",
      default: false,
      description: "Emit JSON instead of text",
    })
    .strict()
    .parse();

  const relPath = `${args.package.replace(/\/+$/, "")}/package.json`;
  const [oldUrls, newUrls] = await Promise.all([
    readInputAt(args.base, relPath),
    readInputAt(args.head ?? null, relPath),
  ]);

  const uniqueUrls = [...new Set([...oldUrls, ...newUrls])];
  const urlCache = new Map<string, GroupVersionKind[]>();
  await Promise.all(
    uniqueUrls.map(async (url) => {
      urlCache.set(url, await fetchUrlCRDs(url));
    }),
  );
  const resolve = (urls: string[]): GroupVersionKind[] =>
    urls.flatMap((url) => urlCache.get(url) ?? []);

  const diff = buildDiff(resolve(oldUrls), resolve(newUrls));

  if (args.json) {
    console.log(JSON.stringify({ pkg: relPath, ...diff }, null, 2));
  } else {
    printReport(relPath, diff);
  }
}

await main();
