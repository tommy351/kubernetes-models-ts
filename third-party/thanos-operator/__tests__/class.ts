import { describe, it, expect } from "vitest";
import { Thanos } from "../gen/monitoring.banzaicloud.io/v1alpha1/Thanos.js";

describe("Thanos", () => {
  const thanos = new Thanos({
    metadata: { name: "example" },
    spec: {
      query: {},
      rule: {},
      storeGateway: {}
    }
  });

  it("should set apiVersion", () => {
    expect(thanos).toHaveProperty(
      "apiVersion",
      "monitoring.banzaicloud.io/v1alpha1"
    );
  });

  it("should set kind", () => {
    expect(thanos).toHaveProperty("kind", "Thanos");
  });

  it("validate", () => {
    expect(() => thanos.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(thanos.toJSON()).toEqual({
      apiVersion: "monitoring.banzaicloud.io/v1alpha1",
      kind: "Thanos",
      metadata: { name: "example" },
      spec: {
        query: {},
        rule: {},
        storeGateway: {}
      }
    });
  });
});
