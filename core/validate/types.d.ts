declare module "ajv-formats-draft2019" {
  import Ajv from "ajv";

  export default function (ajv: Ajv): Ajv;
}

declare module "ajv-formats-draft2019/formats/index.js" {
  import { Format } from "ajv";

  const formats: Record<string, Format>;

  export default formats;
}
