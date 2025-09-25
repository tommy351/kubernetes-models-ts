import { describe, it, expect } from "vitest";
import { PodMonitoring } from "../gen/monitoring.googleapis.com/v1";

describe("validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const podMonitoring = new PodMonitoring({
        spec: {
          selector: {
            matchLabels: {
              "app.kubernetes.io/name": "prom-example"
            }
          },
          endpoints: [{ port: "metrics", interval: "30s" }]
        }
      });

      expect(() => podMonitoring.validate()).not.toThrow();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const podMonitoring = new PodMonitoring({
        // @ts-expect-error
        spec: {}
      });

      expect(() => podMonitoring.validate()).toThrow(
        "data/spec must have required property endpoints, data/spec must have required property selector"
      );
    });
  });
});
