/* eslint-disable node/no-unpublished-import */
import JSZip from "jszip";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import streamToPromise from "stream-to-promise";
import assert from "assert";
import fetch from "make-fetch-happen";
import findCacheDir from "find-cache-dir";

const VERSION = "0.37.1";

const outputPath = join(__dirname, "../crds/crd.yaml");

(async () => {
  const res = await fetch(
    `https://github.com/VictoriaMetrics/operator/releases/download/v${VERSION}/bundle_crd.zip`,
    { cachePath: findCacheDir({ name: "victoria-metrics-operator" }) }
  );
  const zip = await JSZip.loadAsync(await res.buffer());
  const file = zip.file("release/crds/crd.yaml");
  assert(file);

  await mkdir(dirname(outputPath), { recursive: true });

  const dest = createWriteStream(outputPath);
  await streamToPromise(file.nodeStream().pipe(dest));
})();
