import yargs from "yargs";
import { readInput } from "@kubernetes-models/read-input";
import { generate } from "./generate";

export async function run(): Promise<void> {
  const args = await yargs
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
    .parse();

  try {
    await generate({
      input: await readInput(args.input),
      outputPath: args.output
    });
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}
