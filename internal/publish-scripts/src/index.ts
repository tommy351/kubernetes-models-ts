import yargs from "yargs/yargs";
import { postBuild } from "./postbuild";
import { prePack } from "./prepack";

yargs(process.argv.slice(2))
  .command(
    "postbuild",
    "Run postbuild script",
    (cmd) => {
      return cmd.option("cwd", {
        type: "string",
        default: process.cwd(),
        defaultDescription: "CWD",
        description: "Current working directory."
      });
    },
    postBuild
  )
  .command(
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
