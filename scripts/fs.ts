import fs from "fs";
import { dirname } from "path";

const { access, mkdir, writeFile: fsWriteFile, readFile } = fs.promises;

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

export { access, mkdir, readFile };
