import { describe, it, expect, beforeEach } from "vitest";
import { ServiceMonitor } from "../gen/monitoring.coreos.com/v1/ServiceMonitor";

describe("ServiceMonitor", () => {
  let config: ServiceMonitor;

  beforeEach(() => {
    config = new ServiceMonitor({
      metadata: {
        name: "test"
      },
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
  });

  it("should set apiVersion", () => {
    expect(config).toHaveProperty("apiVersion", "monitoring.coreos.com/v1");
  });

  it("should set kind", () => {
    expect(config).toHaveProperty("kind", "ServiceMonitor");
  });

  it("should set metadata", () => {
    expect(config.metadata).toEqual({ name: "test" });
  });

  it("toJSON", () => {
    expect(config.toJSON()).toEqual({
      apiVersion: "monitoring.coreos.com/v1",
      kind: "ServiceMonitor",
      metadata: {
        name: "test"
      },
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
  });
});
