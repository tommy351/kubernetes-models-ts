import Re2 from "../runtime/re2.mjs";
process.stdout.write(JSON.stringify(new Re2("foo").source));
