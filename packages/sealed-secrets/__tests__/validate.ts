import { SealedSecret } from "../gen/bitnami.com/v1alpha1/SealedSecret";

describe("validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const config = new SealedSecret({
        spec: {
          encryptedData: {
            foo: "12345679"
          }
        }
      });

      expect(() => config.validate()).not.toThrow();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const config = new SealedSecret({
        spec: {
          encryptedData: "sdf"
        }
      });

      expect(() => config.validate()).toThrow(
        "data/spec/encryptedData must be object"
      );
    });
  });
});
