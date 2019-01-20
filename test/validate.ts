import test from "ava";
import { Pod } from "../gen/ts/api/core/v1/Pod";
import { ValidationError } from "../gen/ts/ajv";

test("should pass when validation passed", t => {
  const pod = new Pod({
    spec: {
      containers: []
    }
  });

  pod.validate();
  t.pass();
});

test("should throw an error when validation failed", t => {
  const pod = new Pod({
    spec: {} as any
  });

  t.throws(() => pod.validate(), {
    instanceOf: ValidationError,
    message: "data.spec should have required property 'containers'"
  });
});
