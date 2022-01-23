import { readJSON, writeJSON } from "fs-extra";

export interface InjectArguments {
  package: string;
  export: string;
}

export async function inject(args: InjectArguments): Promise<void> {
  const json = await readJSON(args.package);
  const exportMap = await readJSON(args.export);

  json.exports = exportMap;

  await writeJSON(args.package, json, {
    spaces: 2
  });

  console.log("Injected export map %s into %s", args.export, args.package);
}
