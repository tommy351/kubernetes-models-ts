import { Model } from "../model";
import { register } from "@kubernetes-models/validate";

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

  it("should move apiVersion and kind to the front", () => {
    const json = new Model({
      foo: "bar",
      apiVersion: "v1",
      kind: "Pod",
      bar: "baz"
    } as any).toJSON();

    expect(Object.entries(json)).toEqual([
      ["apiVersion", "v1"],
      ["kind", "Pod"],
      ["foo", "bar"],
      ["bar", "baz"]
    ]);
  });
});

describe("validate", () => {
  describe("when schema is not set", () => {
    it("should do nothing", () => {
      const model = new Model();
      expect(() => model.validate()).not.toThrow();
    });
  });

  describe("when schema is set", () => {
    it("works", () => {
      class MyModel extends Model<{}> {}
      const addSchema = jest.fn();
      register("foo", {});
      Model.setSchema(MyModel, "foo", addSchema);
      const model = new MyModel();
      model.validate();
      expect(addSchema).toHaveBeenCalledTimes(1);
    });
  });
});
