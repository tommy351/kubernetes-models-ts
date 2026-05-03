import { type KeywordDefinition, _ } from "ajv";
import refMod from "ajv/dist/vocabularies/core/ref.js";

const ref = refMod.default;

const keyword: KeywordDefinition = {
  keyword: "nullableRef",
  schemaType: "string",
  errors: false,
  code(cxt) {
    const { gen, data } = cxt;

    gen.if(_`${data} !== null`);
    ref.code(cxt);
    gen.endIf();
  },
};

export default keyword;
