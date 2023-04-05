import { describe, it, expect, beforeEach } from "vitest";
import { Jaeger } from "../gen/jaegertracing.io/v1/Jaeger";

describe("Jaeger", () => {
  let jaeger: Jaeger;

  beforeEach(() => {
    jaeger = new Jaeger({
      metadata: { name: "hello" },
      spec: {
        strategy: "production",
        collector: {
          maxReplicas: 5,
          resources: {
            limits: {
              cpu: "100m",
              memory: "128Mi"
            }
          }
        },
        storage: {
          type: "elasticsearch",
          options: {
            es: {
              "server-urls": "http://elasticsearch:9200"
            }
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(jaeger).toHaveProperty("apiVersion", "jaegertracing.io/v1");
  });

  it("should set kind", () => {
    expect(jaeger).toHaveProperty("kind", "Jaeger");
  });

  it("validate", () => {
    expect(() => jaeger.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(jaeger.toJSON()).toEqual({
      apiVersion: "jaegertracing.io/v1",
      kind: "Jaeger",
      metadata: { name: "hello" },
      spec: {
        strategy: "production",
        collector: {
          maxReplicas: 5,
          resources: {
            limits: {
              cpu: "100m",
              memory: "128Mi"
            }
          }
        },
        storage: {
          type: "elasticsearch",
          options: {
            es: {
              "server-urls": "http://elasticsearch:9200"
            }
          }
        }
      }
    });
  });
});
