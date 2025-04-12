import yargs from "yargs/yargs";
import { build, BuildArguments } from "./build";
import { prePack, PrePackArguments } from "./prepack";

yargs(process.argv.slice(2))
  .command<BuildArguments>(
    "build",
    "Run build script",
    (cmd) => {
      return cmd
        .option("cwd", {
          type: "string",
          default: process.cwd(),
          defaultDescription: "CWD",
          description: "Current working directory."
        })
        .option("include-hidden", {
          type: "boolean",
          description: "Include hidden files in the export map."
        });
    },
    build
  )
  .command<PrePackArguments>(
    "prepack",
    "Run prepack script",
    (cmd) => {
      return cmd.option("cwd", {
        type: "string",
        default: process.cwd(),
        defaultDescription: "CWD",
        description: "Current working directory."
      });
    },
    prePack
  )
  .demandCommand()
  .showHelpOnFail(false).argv;
