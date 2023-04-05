import { describe, it, expect, beforeEach } from "vitest";
import { GrafanaAgent } from "../gen/monitoring.grafana.com/v1alpha1/GrafanaAgent";

describe("GrafanaAgent", () => {
  let agent: GrafanaAgent;

  beforeEach(() => {
    agent = new GrafanaAgent({
      metadata: { name: "grafana-agent" },
      spec: {
        image: "grafana/agent:v0.21.2",
        logLevel: "info",
        metrics: {
          instanceSelector: {
            matchLabels: {
              agent: "grafana-agent-metrics"
            }
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(agent).toHaveProperty(
      "apiVersion",
      "monitoring.grafana.com/v1alpha1"
    );
  });

  it("should set kind", () => {
    expect(agent).toHaveProperty("kind", "GrafanaAgent");
  });

  it("validate", () => {
    expect(() => agent.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(agent.toJSON()).toEqual({
      apiVersion: "monitoring.grafana.com/v1alpha1",
      kind: "GrafanaAgent",
      metadata: { name: "grafana-agent" },
      spec: {
        image: "grafana/agent:v0.21.2",
        logLevel: "info",
        metrics: {
          instanceSelector: {
            matchLabels: {
              agent: "grafana-agent-metrics"
            }
          }
        }
      }
    });
  });
});
