import fs from "fs";
import { dirname, join } from "path";
import { promisify } from "util";

export const access = promisify(fs.access);
export const mkdir = promisify(fs.mkdir);
export const readFile = promisify(fs.readFile);
export const readDir = promisify(fs.readdir);
export const stat = promisify(fs.stat);
export const copyFile = promisify(fs.copyFile);

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

export async function copyDir(src: string, dst: string) {
  const files = await readDir(src);

  await mkdirAll(dst);

  for (const file of files) {
    const srcPath = join(src, file);
    const dstPath = join(dst, file);
    const stats = await stat(srcPath);

    if (stats.isDirectory()) {
      await copyDir(srcPath, dstPath);
    } else {
      await copyFile(srcPath, dstPath);
    }
  }
}
