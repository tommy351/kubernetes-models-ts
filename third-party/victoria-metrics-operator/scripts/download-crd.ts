/* eslint-disable node/no-unpublished-import */
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import streamToPromise from "stream-to-promise";
import fetch from "make-fetch-happen";
import findCacheDir from "find-cache-dir";

const VERSION = "0.49.1";

const outputPath = join(__dirname, "../crds/crd.yaml");

(async () => {
  const res = await fetch(
    `https://github.com/VictoriaMetrics/operator/releases/download/v${VERSION}/crd.yaml`,
    { cachePath: findCacheDir({ name: "victoria-metrics-operator" }) }
  );

  await mkdir(dirname(outputPath), { recursive: true });

  const dest = createWriteStream(outputPath);
  await streamToPromise(res.body.pipe(dest));
})();
