/* eslint-disable node/no-unpublished-import */
import JSZip from "jszip";
import { createWriteStream } from "fs";
import { dirname, join } from "path";
import streamToPromise from "stream-to-promise";
import assert from "assert";
import fetch from "make-fetch-happen";
import makeDir from "make-dir";
import findCacheDir from "find-cache-dir";

const VERSION = "0.25.1";

const outputPath = join(__dirname, "../crds/crd.yaml");

(async () => {
  const res = await fetch(
    `https://github.com/VictoriaMetrics/operator/releases/download/v${VERSION}/bundle_crd.zip`,
    { cachePath: findCacheDir({ name: "victoria-metrics-operator" }) }
  );
  const zip = await JSZip.loadAsync(await res.buffer());
  const file = zip.file("release/crds/crd.yaml");
  assert(file);

  await makeDir(dirname(outputPath));

  const dest = createWriteStream(outputPath);
  await streamToPromise(file.nodeStream().pipe(dest));
})();
