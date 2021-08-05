import { pathExists, copy } from "fs-extra";

export async function copyIfExists(src: string, dest: string): Promise<void> {
  if (await pathExists(src)) {
    await copy(src, dest);
  }
}
