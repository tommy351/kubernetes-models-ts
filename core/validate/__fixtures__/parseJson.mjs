import {
  parseJson,
  parseJsonNumber,
  parseJsonString
} from "../runtime/parseJson.mjs";
process.stdout.write(
  JSON.stringify([
    parseJson(`{"foo": "bar"}`, 0),
    parseJsonNumber("123", 0),
    parseJsonString(`"foo"`, 1)
  ])
);
