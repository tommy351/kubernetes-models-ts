import { BackendConfig } from "../gen/cloud.google.com/v1beta1/BackendConfig";

describe("validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const config = new BackendConfig({
        spec: {
          iap: {
            enabled: true,
            oauthclientCredentials: {
                secretName: 'oauth-secret'
            }
          }
        }
      });

      config.validate();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const config = new BackendConfig({
        spec: {
            iap: {} as any
        }
      });

      expect(() => config.validate()).toThrow(
        "data.spec.iap should have required property 'enabled'"
      );
    });
  });
});