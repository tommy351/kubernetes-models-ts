import yargs from "yargs/yargs";
import { postBuild, PostBuildArguments } from "./postbuild";
import { prePack, PrePackArguments } from "./prepack";

yargs(process.argv.slice(2))
  .command<PostBuildArguments>(
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
