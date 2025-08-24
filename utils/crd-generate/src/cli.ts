import yargs from "yargs";
import { readInput } from "@kubernetes-models/read-input";
import { generate, GenerateOptions } from "./generate";

async function readFiles(paths: string[]): Promise<string> {
  const documents: string[] = [];

  for (const path of paths) {
    console.log("Reading:", path);
    documents.push(await readInput(path));
  }

  return documents.join("\n---\n");
}

export async function run(): Promise<void> {
  const args = await yargs
    .pkgConf("crd-generate")
    .option("input", {
      type: "array",
      describe: "Path of the input file or URL",
      string: true,
      demandOption: true
    })
    .option("output", {
      type: "string",
      describe: "Path of output files",
      demandOption: true
    })
    .option("yamlVersion", {
      type: "string",
      describe: "YAML version.",
      choices: ["1.0", "1.1", "1.2"]
    })
    .option("customBaseClassName", {
      type: "string",
      describe: "Base class import name",
      default: "Model"
    })
    .option("customBaseClassImportPath", {
      type: "string",
      describe: "Base class import path",
      default: "@kubernetes-models/base"
    })
    .parse();

  try {
    await generate({
      input: await readFiles(args.input),
      outputPath: args.output,
      yamlVersion: args.yamlVersion as GenerateOptions["yamlVersion"],
      customBaseClassName: args.customBaseClassName,
      customBaseClassImportPath: args.customBaseClassImportPath
    });
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}
