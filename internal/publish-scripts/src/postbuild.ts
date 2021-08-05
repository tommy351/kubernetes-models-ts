import { generate } from "@kubernetes-models/export-map";
import { join } from "path";

export interface PostBuildArguments {
  cwd: string;
}

export async function postBuild(args: PostBuildArguments): Promise<void> {
  const genDir = join(args.cwd, "gen");

  await generate({
    cwd: genDir,
    export: join(genDir, "export-map.json"),
    ignoreFile: join(args.cwd, ".export-map-ignore")
  });
}
