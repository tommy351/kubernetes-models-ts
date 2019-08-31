import yargs from "yargs";
import { readFile, writeFile, copyDir } from "./fs";
import { join } from "path";
import { Definition, GenerateFunc } from "./types";
import { generateDefinitions } from "./generators/definition";
import { generateAliases } from "./generators/alias";
import { generateSchemas } from "./generators/schema";

const generators: GenerateFunc[] = [
  generateDefinitions,
  generateSchemas,
  generateAliases
];

const { argv } = yargs
  .option("file", {
    description: "Path of OpenAPI spec",
    required: true,
    type: "string"
  })
  .option("output", {
    description: "Output path",
    required: true,
    type: "string"
  });

(async () => {
  const { definitions } = JSON.parse(await readFile(argv.file, "utf8"));
  const arr = Object.keys(definitions)
    .filter(id => !id.startsWith("io.k8s.kubernetes."))
    .map(id => new Definition(id, definitions[id]));
  const generatedPaths = new Set<string>();

  for (const fn of generators) {
    const files = await fn(arr);

    for (const file of files) {
      if (generatedPaths.has(file.path)) {
        throw new Error(`Path conflict: ${file.path}`);
      }

      await writeFile(join(argv.output, file.path), file.content);
      generatedPaths.add(file.path);
      console.log("Generating:", file.path);
    }
  }

  await copyDir(join(__dirname, "..", "src"), join(argv.output, "_src"));
})().catch(console.error);
