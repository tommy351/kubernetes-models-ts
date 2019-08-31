import request from "request-promise-native";
import hasha from "hasha";
import baseX from "base-x";
import { getOrSetCache } from "./cache";

const base62 = baseX(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
);

function generateKey(url: string): string {
  const buf = hasha(url, {
    algorithm: "sha256",
    encoding: "buffer"
  });

  return base62.encode(buf);
}

export async function httpGet(url: string): Promise<string> {
  return getOrSetCache(generateKey(url), async () => request(url));
}
