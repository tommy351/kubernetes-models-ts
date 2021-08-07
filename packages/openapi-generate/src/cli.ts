import yargs from "yargs";
import { readInput } from "@kubernetes-models/read-input";
import { generate } from "./generate";

interface OpenAPISpec {
  definitions?: Record<string, unknown>;
  [key: string]: unknown;
}

function mergeSpec(oldData: OpenAPISpec, newData: OpenAPISpec): OpenAPISpec {
  const { definitions: oldDefs = {} } = oldData;
  const { definitions: newDefs = {}, ...data } = newData;

  return {
    ...data,
    definitions: {
      ...oldDefs,
      ...newDefs
    }
  };
}

async function readFiles(paths: string[]): Promise<string> {
  let spec: OpenAPISpec = {};

  for (const path of paths) {
    console.log("Reading:", path);
    spec = mergeSpec(spec, JSON.parse(await readInput(path)));
  }

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
