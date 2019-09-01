import getStdin from "get-stdin";
import { readFile } from "fs";
import { promisify } from "util";
import { httpGet } from "./http";

const readFileAsync = promisify(readFile);
const urlRegex = /^https?:\/\//;

export async function readInput(path: string): Promise<string> {
  if (path === "-") {
    return getStdin();
  }

  if (urlRegex.test(path)) {
    return httpGet(path);
  }

  return readFileAsync(path, "utf8");
}
