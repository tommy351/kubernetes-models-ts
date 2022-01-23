import { Pod } from "../gen/v1/Pod";
import { PodSpec } from "../gen/v1/PodSpec";
import { Service } from "../gen/v1/Service";
import { Deployment } from "../gen/apps/v1/Deployment";

describe("With GVK", () => {
  describe.each([
    // Interface with TypeMeta only
    [{ apiVersion: "v1", kind: "Pod" }, true],
    // Interface with incorrect apiVersion
    [{ apiVersion: "v2", kind: "Pod" }, false],
    // Interface with incorrect kind
    [{ apiVersion: "v1", kind: "Service" }, false],
    // Interface with valid data
    [{ apiVersion: "v1", kind: "Pod", metadata: { name: "test" } }, true],
    // Interface with invalid data (it doesn't matter anyway)
    [{ apiVersion: "v1", kind: "Pod", foo: "bar" }, true],
    // null
    [null, false],
    // undefined
    [undefined, false],
    // Empty object
    [{}, false],
    // Boolean
    [true, false],
    // Number
    [3.14, false],
    // Array
    [[], false],
    // String
    ["foo", false],
    // Class without any data
    [new Pod(), true],
    // Class with valid data
    [new Pod({ metadata: { name: "test" } }), true],
    // Class with incorrect apiVersion
    [new Deployment(), false],
    // Class with incorrect kind
    [new Service(), false]
  ])("Pod.is(%p)", (value, expected) => {
    it(`should return ${expected}`, () => {
      expect(Pod.is(value)).toEqual(expected);
    });
  });
});

describe("Without GVK", () => {
  it("should not have a type guard", () => {
    expect(PodSpec).not.toHaveProperty("is");
  });
});
