import { expect } from "chai";
import { getImportPath } from "../gen/ts/resolve";

describe("getImportPath", () => {
  describe("given apiVersion", () => {
    const tests: { [key: string]: string | undefined } = {
      v1: "api/core/v1",
      "apps/v1": "api/apps/v1",
      "rbac.authorization.k8s.io/v1": "api/rbac/v1",
      foo: undefined
    };

    for (const key of Object.keys(tests)) {
      it(`apiVersion = ${key}`, () => {
        expect(getImportPath(key)).to.eql(tests[key]);
      });
    }
  });

  describe("given kind", () => {
    it("should return string when apiVersion exists", () => {
      expect(getImportPath("apps/v1", "Deployment")).to.eql(
        "api/apps/v1/Deployment"
      );
    });

    it("should return undefined when apiVersion does not exist", () => {
      expect(getImportPath("foo", "Pod")).to.eq(undefined);
    });
  });
});
