import yargs from "yargs";
import { readInput } from "@kubernetes-models/read-input";
import { generate } from "./generate";
import { mergeOpenAPISpecs } from "./utils";

async function readFiles(paths: string[]): Promise<string> {
  const data = await Promise.all(paths.map((path) => readInput(path)));
  const spec = mergeOpenAPISpecs(data.map((x) => JSON.parse(x)));

  return JSON.stringify(spec);
}

export async function run(): Promise<void> {
  const args = await yargs
    .pkgConf("openapi-generate")
    .option("input", {
      type: "array",
      describe: "Path of the input file or URL",
      demandOption: true,
      string: true
    })
    .option("output", {
      type: "string",
      describe: "Path of output files",
      demandOption: true
    })
    .parse();

  try {
    await generate({
      input: await readFiles(args.input),
      outputPath: args.output
    });
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}
