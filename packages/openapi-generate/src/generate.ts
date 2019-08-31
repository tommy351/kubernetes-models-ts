import { writeFile } from "fs";
import { join, dirname } from "path";
import makeDir from "make-dir";
import { promisify } from "util";
import { Definition, GenerateFunc } from "./types";
import { generateDefinitions } from "./generators/definition";
import { generateAliases } from "./generators/alias";
import { generateSchemas } from "./generators/schema";

const writeFileAsync = promisify(writeFile);

const generators: GenerateFunc[] = [
  generateDefinitions,
  generateSchemas,
  generateAliases
];

export interface GenerateOptions {
  input: string;
  outputPath: string;
}

export async function generate(options: GenerateOptions): Promise<void> {
  const { definitions } = JSON.parse(options.input);
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

      const path = join(options.outputPath, file.path);

      await makeDir(dirname(path));
      await writeFileAsync(path, file.content);
      generatedPaths.add(file.path);
      console.log("Generating:", file.path);
    }
  }
}
