import { describe, it, expect } from "vitest";
import { ServiceMonitor } from "../gen/monitoring.coreos.com/v1/ServiceMonitor";

describe("validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const config = new ServiceMonitor({
        spec: {
          selector: {
            matchLabels: {
              app: "some-app"
            }
          },
          endpoints: [
            {
              port: "web"
            }
          ]
        }
      });

      expect(() => config.validate()).not.toThrow();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const config = new ServiceMonitor({
        spec: {
          // @ts-expect-error
          selector: "some-app",
          endpoints: []
        }
      });

      expect(() => config.validate()).toThrow(
        "data/spec/selector must be object"
      );
    });
  });
});
