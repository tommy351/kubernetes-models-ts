import { describe, it, expect } from "vitest";
import { BackendConfig } from "../gen/cloud.google.com/v1beta1/BackendConfig";

describe("validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const config = new BackendConfig({
        spec: {
          iap: {
            enabled: true,
            oauthclientCredentials: {
              secretName: "oauth-secret"
            }
          }
        }
      });

      expect(() => config.validate()).not.toThrow();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const config = new BackendConfig({
        spec: {
          // @ts-expect-error
          iap: {}
        }
      });

      expect(() => config.validate()).toThrow(
        "data/spec/iap must have required property enabled, data/spec/iap must have required property oauthclientCredentials"
      );
    });
  });
});
