import getStdin from "get-stdin";
import { readFile } from "fs/promises";
import { httpGet } from "./http";

const urlRegex = /^https?:\/\//;

export async function readInput(path: string): Promise<string> {
  if (path === "-") {
    return getStdin();
  }

  if (urlRegex.test(path)) {
    return httpGet(path);
  }

  return readFile(path, "utf8");
}
