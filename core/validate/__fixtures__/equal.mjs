import equal from "../runtime/equal.mjs";
process.stdout.write(JSON.stringify([equal(1, 1), equal(1, 2)]));
