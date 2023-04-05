import { describe, it, expect, beforeEach } from "vitest";
import { Canary } from "../gen/flagger.app/v1beta1/Canary";

describe("Canary", () => {
  let canary: Canary;

  beforeEach(() => {
    canary = new Canary({
      metadata: {
        name: "example"
      },
      spec: {
        targetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "example"
        },
        service: { port: 9898 },
        analysis: {
          interval: "1m",
          threshold: 10,
          maxWeight: 50,
          stepWeight: 5
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(canary).toHaveProperty("apiVersion", "flagger.app/v1beta1");
  });

  it("should set kind", () => {
    expect(canary).toHaveProperty("kind", "Canary");
  });

  it("validate", () => {
    expect(() => canary.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(canary.toJSON()).toEqual({
      apiVersion: "flagger.app/v1beta1",
      kind: "Canary",
      metadata: {
        name: "example"
      },
      spec: {
        targetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "example"
        },
        service: { port: 9898 },
        analysis: {
          interval: "1m",
          threshold: 10,
          maxWeight: 50,
          stepWeight: 5
        }
      }
    });
  });
});
