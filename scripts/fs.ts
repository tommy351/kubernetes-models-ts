import fs from "fs";
import { dirname } from "path";
import { promisify } from "util";

export const access = promisify(fs.access);
export const mkdir = promisify(fs.mkdir);
export const readFile = promisify(fs.readFile);

const fsWriteFile = promisify(fs.writeFile);

export async function mkdirAll(path: string) {
  const parent = dirname(path);

  try {
    await access(parent);
  } catch (err) {
    await mkdirAll(parent);
  }

  try {
    await mkdir(path);
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}

export async function writeFile(path: string, content: any) {
  await mkdirAll(dirname(path));
  await fsWriteFile(path, content);
}
