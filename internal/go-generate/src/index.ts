import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generate } from "./generate.js";

const args = await yargs(hideBin(process.argv))
  .pkgConf("go-generate")
  .option("input", {
    type: "array",
    describe: "Path of the input Go package",
    string: true,
    demandOption: true,
  })
  .option("output", {
    type: "string",
    describe: "Path of output files",
    demandOption: true,
  })
  .parse();

await generate({
  input: args.input,
  outputPath: args.output,
});
