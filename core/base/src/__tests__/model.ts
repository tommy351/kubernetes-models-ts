import { describe, it, expect, vi } from "vitest";
import { Model, setSchema } from "../model";
import { register } from "@kubernetes-models/validate";

describe("validate", () => {
  describe("when schema is not set", () => {
    it("should do nothing", () => {
      const model = new Model();
      expect(() => model.validate()).not.toThrow();
    });
  });

  describe("when schema is set", () => {
    it("works", () => {
      class MyModel extends Model<unknown> {}
      const addSchema = vi.fn();
      register("foo", {});
      setSchema(MyModel, "foo", addSchema);
      const model = new MyModel();
      model.validate();
      expect(addSchema).toHaveBeenCalledTimes(1);
    });
  });
});
