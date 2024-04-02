import ucs2length from "../runtime/ucs2length.mjs";
process.stdout.write(JSON.stringify([ucs2length("foo"), ucs2length("💩")]));
