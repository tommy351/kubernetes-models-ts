import fetch from "make-fetch-happen";
import findCacheDir from "find-cache-dir";

export async function httpGet(url: string): Promise<string> {
  const res = await fetch(url, {
    cachePath: findCacheDir({ name: "kubernetes-models-read-input" })
  });

  return res.text();
}
