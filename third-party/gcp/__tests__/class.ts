import { describe, it, expect, beforeEach } from "vitest";
import { PodMonitoring } from "../gen/monitoring.googleapis.com/v1";

describe("monitoring.googleapis.com/v1/PodMonitoring", () => {
  let podMonitoring: PodMonitoring;

  beforeEach(() => {
    podMonitoring = new PodMonitoring({
      metadata: {
        name: "prom-example"
      },
      spec: {
        selector: {
          matchLabels: {
            "app.kubernetes.io/name": "prom-example"
          }
        },
        endpoints: [{ port: "metrics", interval: "30s" }]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(podMonitoring).toHaveProperty(
      "apiVersion",
      "monitoring.googleapis.com/v1"
    );
  });

  it("should set kind", () => {
    expect(podMonitoring).toHaveProperty("kind", "PodMonitoring");
  });

  it("should set metadata", () => {
    expect(podMonitoring.metadata).toEqual({ name: "prom-example" });
  });

  it("toJSON", () => {
    expect(podMonitoring.toJSON()).toEqual({
      apiVersion: "monitoring.googleapis.com/v1",
      kind: "PodMonitoring",
      metadata: {
        name: "prom-example"
      },
      spec: {
        selector: {
          matchLabels: {
            "app.kubernetes.io/name": "prom-example"
          }
        },
        endpoints: [{ port: "metrics", interval: "30s" }]
      }
    });
  });
});
