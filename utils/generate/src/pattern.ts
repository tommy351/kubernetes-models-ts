import { type KeywordDefinition, str, _, Name } from "ajv";
import { RE2 } from "re2-wasm";

// https://github.com/ajv-validator/ajv/blob/c8b37f448f77448656222a5a5e279432857f7e9f/lib/vocabularies/validation/pattern.ts
const keyword: KeywordDefinition = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  error: {
    message: ({ schemaCode }) => str`must match pattern "${schemaCode}"`,
    params: ({ schemaCode }) => _`{pattern: ${schemaCode}}`
  },
  code(cxt) {
    const { data, schema, it, gen } = cxt;
    const u = it.opts.unicodeRegExp ? "u" : "";
    let pattern: Name;

    try {
      const re = new RegExp(schema, u);
      pattern = gen.scopeValue("pattern", {
        key: schema,
        ref: re,
        code: _`new RegExp(${schema}, ${u})`
      });
    } catch {
      const re = new RE2(schema, u);
      const func = gen.scopeValue("func", {
        ref: RE2,
        code: _`require("ajv/dist/runtime/re2").default`
      });
      pattern = gen.scopeValue("pattern", {
        key: schema,
        ref: re,
        code: _`new ${func}(${schema}, ${u})`
      });
    }

    cxt.fail(_`!${pattern}.test(${data})`);
  }
};

export default keyword;
