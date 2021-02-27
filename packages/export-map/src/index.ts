import yargs from "yargs/yargs";
import { generate } from "./generate";
import { inject } from "./inject";

yargs(process.argv.slice(2))
  .command(
    "generate",
    "Generate export map",
    (cmd) => {
      return cmd
        .option("path", {
          type: "string",
          demandOption: true,
          description: "Path of package folder."
        })
        .option("export", {
          type: "string",
          demandOption: true,
          description: "Path of export map."
        });
    },
    generate
  )
  .command(
    "inject",
    "Inject export map into package.json",
    (cmd) => {
      return cmd
        .option("package", {
          type: "string",
          demandOption: true,
          description: "Path of package.json."
        })
        .option("export", {
          type: "string",
          demandOption: true,
          description: "Path of export map."
        });
    },
    inject
  )
  .demandCommand()
  .showHelpOnFail(false).argv;
