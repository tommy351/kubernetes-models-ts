import { describe, it, expect, vi } from "vitest";
import { Model, setValidateFunc } from "../model";
import { ValidateFunc } from "@kubernetes-models/validate";

describe("toJSON", () => {
  it("should not set undefined props", () => {
    const json = new Model({
      spec: undefined
    }).toJSON();

    expect(json).toEqual({});
  });

  it("should not set undefined props in an object", () => {
    const json = new Model({
      spec: {
        nodeName: undefined
      }
    }).toJSON();

    expect(json).toEqual({
      spec: {}
    });
  });

  it("should not set undefined props in an array", () => {
    const json = new Model({
      spec: {
        containers: [
          {
            name: "foo",
            image: undefined
          }
        ]
      }
    }).toJSON();

    expect(json).toEqual({
      spec: {
        containers: [{ name: "foo" }]
      }
    });
  });
});

describe("validate", () => {
  describe("when validate function is not set", () => {
    it("should do nothing", () => {
      const model = new Model();
      expect(() => model.validate()).not.toThrow();
    });
  });

  describe("when validate function is set", () => {
    it("works", () => {
      const validate = vi.fn();
      class MyModel extends Model<unknown> {}
      setValidateFunc(MyModel, validate as unknown as ValidateFunc<unknown>);

      const model = new MyModel();
      model.validate();
      expect(validate).toHaveBeenCalledTimes(1);
      expect(validate).toHaveBeenCalledWith(model);
    });
  });
});
