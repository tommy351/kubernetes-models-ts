import execa from "execa";
import { generate } from "@kubernetes-models/openapi-generate";
import { join } from "path";
import yargs from "yargs";

async function run(): Promise<void> {
  const args = await yargs
    .pkgConf("go-crd-generate")
    .option("output", {
      type: "string",
      describe: "Path of output files",
      demandOption: true
    })
    .parse();

  const { stdout } = await execa("go", ["run", join(__dirname, "../cmd")], {
    stderr: "inherit"
  });

  await generate({
    input: stdout,
    outputPath: args.output,
    externalAPIMachinery: true,
    externalKubernetesModels: true
  });
}

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
