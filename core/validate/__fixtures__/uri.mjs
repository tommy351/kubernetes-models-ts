import uri from "../runtime/uri.mjs";
process.stdout.write(JSON.stringify(uri.parse("https://example.com/foo")));
