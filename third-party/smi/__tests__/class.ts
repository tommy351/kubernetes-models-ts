import { describe, it, expect, beforeEach } from "vitest";
import { TrafficSplit } from "../gen/split.smi-spec.io/v1alpha4/TrafficSplit";

describe("TrafficSplit", () => {
  let repository: TrafficSplit;

  beforeEach(() => {
    repository = new TrafficSplit({
      metadata: { name: "example" },
      spec: {
        service: "example",
        backends: [
          { service: "example-v1", weight: 90 },
          { service: "example-v2", weight: 10 }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(repository).toHaveProperty(
      "apiVersion",
      "split.smi-spec.io/v1alpha4"
    );
  });

  it("should set kind", () => {
    expect(repository).toHaveProperty("kind", "TrafficSplit");
  });

  it("validate", () => {
    expect(() => repository.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(repository.toJSON()).toEqual({
      apiVersion: "split.smi-spec.io/v1alpha4",
      kind: "TrafficSplit",
      metadata: { name: "example" },
      spec: {
        service: "example",
        backends: [
          { service: "example-v1", weight: 90 },
          { service: "example-v2", weight: 10 }
        ]
      }
    });
  });
});
