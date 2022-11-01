import fetch from "make-fetch-happen";
import findCacheDir from "find-cache-dir";

export async function httpGet(url: string): Promise<string> {
  const res = await fetch(url, {
    cachePath: findCacheDir({ name: "kubernetes-models-read-input" })
  });

  if (!res.ok) {
    throw new Error(`Request "${url}" failed: ${res.status} ${res.statusText}`);
  }

  return res.text();
}
