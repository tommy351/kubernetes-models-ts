import yargs from "yargs/yargs";
import { generate } from "./generate";
import { inject } from "./inject";

yargs(process.argv.slice(2))
  .command(
    "generate",
    "Generate export map",
    (cmd) => {
      return cmd
        .option("cwd", {
          type: "string",
          default: process.cwd(),
          defaultDescription: "CWD",
          description: "Current working directory."
        })
        .option("include", {
          type: "array",
          description:
            "Files to include. All TypeScript files are included by default.",
          default: ["**/*.ts"]
        })
        .option("exclude", {
          type: "array",
          description: "Files to exclude.",
          default: []
        })
        .option("ignoreFile", {
          type: "string",
          description: "Exclude files using a .gitignore style file.",
          default: ".export-map-ignore"
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
