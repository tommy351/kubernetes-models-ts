import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import yargs from "yargs";
import { execa } from "execa";

interface GoWork {
  Use?: { DiskPath: string }[];
}

const rootDir = fileURLToPath(new URL("..", import.meta.url));

const args = await yargs(process.argv.slice(2))
  .option("force", {
    type: "boolean",
    default: false,
    description: "Run even when no Go-related files are staged",
  })
  .parse();

async function hasStagedGoFiles(): Promise<boolean> {
  const { exitCode } = await execa(
    "git",
    [
      "diff",
      "--cached",
      "--quiet",
      "--",
      ":(glob)**/*.go",
      ":(glob)**/go.mod",
      ":(glob)**/go.sum",
      ":(glob)**/go.work",
      ":(glob)**/go.work.sum",
    ],
    { cwd: rootDir, reject: false },
  );
  return exitCode === 1;
}

if (args.force || (await hasStagedGoFiles())) {
  const { stdout: workEditJson } = await execa(
    "go",
    ["work", "edit", "-json"],
    { cwd: rootDir },
  );
  const modules = ((JSON.parse(workEditJson) as GoWork).Use ?? []).map(
    (entry) => entry.DiskPath,
  );

  await execa("go", ["work", "sync"], { cwd: rootDir, stdio: "inherit" });

  for (const dir of modules) {
    await execa("go", ["mod", "tidy"], {
      cwd: resolve(rootDir, dir),
      stdio: "inherit",
    });
  }

  const paths = ["go.work", "go.work.sum"];
  for (const dir of modules) {
    paths.push(`${dir}/go.mod`, `${dir}/go.sum`);
  }

  await execa("git", ["add", "--", ...paths], {
    cwd: rootDir,
    stdio: "inherit",
  });
}
