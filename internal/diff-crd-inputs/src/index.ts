import { readFile } from "node:fs/promises";
import { execa } from "execa";
import yargs from "yargs";
import { parseAllDocuments } from "yaml";
import { readInput } from "@kubernetes-models/read-input";

interface SchemaNode {
  type?: string | string[];
  $ref?: string;
  properties?: Record<string, SchemaNode>;
  items?: SchemaNode;
  required?: string[];
  enum?: unknown[];
  format?: string;
  pattern?: string;
  oneOf?: SchemaNode[];
  anyOf?: SchemaNode[];
  allOf?: SchemaNode[];
  additionalProperties?: boolean | SchemaNode;
}

interface CRDVersion {
  group: string;
  kind: string;
  version: string;
  schema: SchemaNode;
}

type ChangeKind =
  | "type-change"
  | "property-removed"
  | "required-property-added"
  | "optional-property-added"
  | "required-to-optional"
  | "optional-to-required"
  | "enum-value-removed"
  | "enum-value-added"
  | "format-change"
  | "pattern-change";

interface SchemaChange {
  path: string;
  kind: ChangeKind;
  detail?: string;
  breaking: boolean;
}

interface CRDDiff {
  key: string;
  status: "added" | "removed" | "modified" | "unchanged";
  changes: SchemaChange[];
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

function extractCRDs(doc: unknown): CRDVersion[] {
  if (!doc || typeof doc !== "object") return [];
  const d = doc as Record<string, any>;
  if (d.kind !== "CustomResourceDefinition") return [];
  const group: unknown = d.spec?.group;
  const kind: unknown = d.spec?.names?.kind;
  if (typeof group !== "string" || typeof kind !== "string") return [];
  const out: CRDVersion[] = [];
  const globalSchema: SchemaNode | undefined =
    d.spec?.validation?.openAPIV3Schema;
  if (Array.isArray(d.spec?.versions)) {
    for (const v of d.spec.versions) {
      const schema: SchemaNode | undefined =
        v?.schema?.openAPIV3Schema ?? globalSchema;
      if (schema && typeof v?.name === "string") {
        out.push({ group, kind, version: v.name, schema });
      }
    }
  } else if (typeof d.spec?.version === "string" && globalSchema) {
    out.push({ group, kind, version: d.spec.version, schema: globalSchema });
  }
  return out;
}

async function fetchUrlCRDs(url: string): Promise<CRDVersion[]> {
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

function buildCRDMap(
  urls: string[],
  cache: Map<string, CRDVersion[]>,
): Map<string, CRDVersion> {
  const map = new Map<string, CRDVersion>();
  for (const url of urls) {
    for (const crd of cache.get(url) ?? []) {
      map.set(`${crd.group}/${crd.kind}/${crd.version}`, crd);
    }
  }
  return map;
}

function addChange(
  out: SchemaChange[],
  path: string,
  kind: ChangeKind,
  breaking: boolean,
  detail?: string,
): void {
  out.push(
    detail ? { path, kind, breaking, detail } : { path, kind, breaking },
  );
}

function asSchemaNode(s: unknown): SchemaNode {
  return s && typeof s === "object" ? s : {};
}

function typeOf(s: SchemaNode): string {
  if (s.type) return Array.isArray(s.type) ? s.type.join("|") : s.type;
  if (s.$ref) return `ref(${s.$ref})`;
  if (s.oneOf) return "oneOf";
  if (s.anyOf) return "anyOf";
  if (s.allOf) return "allOf";
  return "any";
}

function compareScalarField(
  out: SchemaChange[],
  path: string,
  a: SchemaNode,
  b: SchemaNode,
  field: "format" | "pattern",
  breaking: boolean,
): void {
  if ((a[field] ?? null) === (b[field] ?? null)) return;
  addChange(
    out,
    path,
    `${field}-change`,
    breaking,
    `${a[field] ?? "∅"} → ${b[field] ?? "∅"}`,
  );
}

function diffSchema(
  rawA: unknown,
  rawB: unknown,
  path: string,
  out: SchemaChange[],
): void {
  if (path === "status") return;

  const a = asSchemaNode(rawA);
  const b = asSchemaNode(rawB);

  const ta = typeOf(a);
  const tb = typeOf(b);
  if (ta !== tb) {
    addChange(out, path, "type-change", true, `${ta} → ${tb}`);
    return;
  }

  if (Array.isArray(a.enum) || Array.isArray(b.enum)) {
    const aEnum = new Set(a.enum ?? []);
    const bEnum = new Set(b.enum ?? []);
    const removed = [...aEnum].filter((v) => !bEnum.has(v));
    const added = [...bEnum].filter((v) => !aEnum.has(v));
    if (removed.length) {
      addChange(
        out,
        path,
        "enum-value-removed",
        true,
        removed.map(String).join(","),
      );
    }
    if (added.length) {
      addChange(
        out,
        path,
        "enum-value-added",
        false,
        added.map(String).join(","),
      );
    }
  }

  compareScalarField(out, path, a, b, "format", true);
  compareScalarField(out, path, a, b, "pattern", false);

  if (ta === "object" || a.properties || b.properties) {
    const aReq = new Set<string>(Array.isArray(a.required) ? a.required : []);
    const bReq = new Set<string>(Array.isArray(b.required) ? b.required : []);
    const aProps = a.properties ?? {};
    const bProps = b.properties ?? {};
    const propKeys = new Set([...Object.keys(aProps), ...Object.keys(bProps)]);
    for (const key of propKeys) {
      const subPath = path ? `${path}.${key}` : key;
      const inA = key in aProps;
      const inB = key in bProps;
      if (inA && !inB) {
        addChange(out, subPath, "property-removed", true);
        continue;
      }
      if (!inA && inB) {
        const required = bReq.has(key);
        addChange(
          out,
          subPath,
          required ? "required-property-added" : "optional-property-added",
          required,
        );
        continue;
      }
      if (aReq.has(key) && !bReq.has(key)) {
        addChange(out, subPath, "required-to-optional", false);
      } else if (!aReq.has(key) && bReq.has(key)) {
        addChange(out, subPath, "optional-to-required", true);
      }
      diffSchema(aProps[key], bProps[key], subPath, out);
    }
    if (
      a.additionalProperties &&
      typeof a.additionalProperties === "object" &&
      b.additionalProperties &&
      typeof b.additionalProperties === "object"
    ) {
      diffSchema(
        a.additionalProperties,
        b.additionalProperties,
        `${path}{*}`,
        out,
      );
    }
  }

  if (a.items && b.items) {
    diffSchema(a.items, b.items, `${path}[]`, out);
  }
}

function buildDiffs(
  oldCRDs: Map<string, CRDVersion>,
  newCRDs: Map<string, CRDVersion>,
): CRDDiff[] {
  const crdKeys = [...new Set([...oldCRDs.keys(), ...newCRDs.keys()])].sort();
  const diffs: CRDDiff[] = [];
  for (const key of crdKeys) {
    const a = oldCRDs.get(key);
    const b = newCRDs.get(key);
    if (a && !b) {
      diffs.push({ key, status: "removed", changes: [] });
    } else if (!a && b) {
      diffs.push({ key, status: "added", changes: [] });
    } else if (a && b) {
      const changes: SchemaChange[] = [];
      diffSchema(a.schema, b.schema, "", changes);
      diffs.push({
        key,
        status: changes.length ? "modified" : "unchanged",
        changes,
      });
    }
  }
  return diffs;
}

function printReport(pkg: string, diffs: CRDDiff[]): void {
  console.log(`## ${pkg}`);
  let added = 0;
  let removed = 0;
  let modified = 0;
  let breaking = 0;

  for (const d of diffs) {
    if (d.status === "added") {
      console.log(`+ added CRD: ${d.key}`);
      added++;
    } else if (d.status === "removed") {
      console.log(`- removed CRD: ${d.key}  [BREAKING]`);
      removed++;
      breaking++;
    } else if (d.status === "modified") {
      console.log(`~ modified CRD: ${d.key}`);
      modified++;
      for (const c of d.changes) {
        const flag = c.breaking ? " [BREAKING]" : "";
        const det = c.detail ? ` (${c.detail})` : "";
        console.log(`    ${c.kind}: ${c.path || "<root>"}${det}${flag}`);
        if (c.breaking) breaking++;
      }
    }
  }

  if (diffs.every((d) => d.status === "unchanged")) {
    console.log("  no schema changes");
  }
  console.log(`\n# Summary`);
  console.log(`CRDs added:    ${added}`);
  console.log(`CRDs removed:  ${removed}`);
  console.log(`CRDs modified: ${modified}`);
  console.log(`Breaking:      ${breaking}`);
}

async function main(): Promise<void> {
  const args = await yargs(process.argv.slice(2))
    .positional("package", {
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
  const urlCache = new Map<string, CRDVersion[]>();
  await Promise.all(
    uniqueUrls.map(async (url) => {
      urlCache.set(url, await fetchUrlCRDs(url));
    }),
  );

  const oldCRDs = buildCRDMap(oldUrls, urlCache);
  const newCRDs = buildCRDMap(newUrls, urlCache);
  const diffs = buildDiffs(oldCRDs, newCRDs);

  if (args.json) {
    console.log(JSON.stringify({ pkg: relPath, diffs }, null, 2));
  } else {
    printReport(relPath, diffs);
  }
}

await main();
