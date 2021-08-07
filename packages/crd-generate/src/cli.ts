import yargs from "yargs";
import { readInput } from "@kubernetes-models/read-input";
import { generate, GenerateOptions } from "./generate";

export async function run(): Promise<void> {
  const args = await yargs
    .pkgConf("crd-generate")
    .option("input", {
      type: "string",
      describe: "Path of the input file or URL",
      required: true
    })
    .option("output", {
      type: "string",
      describe: "Path of output files",
      required: true
    })
    .option("yamlVersion", {
      type: "string",
      describe: "YAML version.",
      choices: ["1.0", "1.1", "1.2"]
    })
    .parse();

  try {
    await generate({
      input: await readInput(args.input),
      outputPath: args.output,
      yamlVersion: args.yamlVersion as GenerateOptions["yamlVersion"]
    });
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}
