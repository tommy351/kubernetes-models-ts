import { describe, it, expect, beforeEach } from "vitest";
import { OpenTelemetryCollector } from "../gen/opentelemetry.io/v1beta1/OpenTelemetryCollector";
import { Instrumentation } from "../gen/opentelemetry.io/v1alpha1/Instrumentation";

describe("OpenTelemetryCollector", () => {
  let collector: OpenTelemetryCollector;

  beforeEach(() => {
    collector = new OpenTelemetryCollector({
      metadata: { name: "my-collector" },
      spec: {
        mode: "deployment",
        image:
          "ghcr.io/open-telemetry/opentelemetry-collector-releases/opentelemetry-collector-contrib:0.96.0",
        managementState: "managed",
        config: {
          receivers: {
            otlp: {
              protocols: {
                grpc: {},
                http: {}
              }
            }
          },
          exporters: {
            prometheus: {
              endpoint: "0.0.0.0:8889"
            }
          },
          service: {
            pipelines: {
              metrics: {
                receivers: ["otlp"],
                exporters: ["prometheus"]
              }
            }
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(collector).toHaveProperty("apiVersion", "opentelemetry.io/v1beta1");
  });

  it("should set kind", () => {
    expect(collector).toHaveProperty("kind", "OpenTelemetryCollector");
  });

  it("validate", () => {
    expect(() => collector.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(collector.toJSON()).toEqual({
      apiVersion: "opentelemetry.io/v1beta1",
      kind: "OpenTelemetryCollector",
      metadata: { name: "my-collector" },
      spec: {
        mode: "deployment",
        image:
          "ghcr.io/open-telemetry/opentelemetry-collector-releases/opentelemetry-collector-contrib:0.96.0",
        managementState: "managed",
        config: {
          receivers: {
            otlp: {
              protocols: {
                grpc: {},
                http: {}
              }
            }
          },
          exporters: {
            prometheus: {
              endpoint: "0.0.0.0:8889"
            }
          },
          service: {
            pipelines: {
              metrics: {
                receivers: ["otlp"],
                exporters: ["prometheus"]
              }
            }
          }
        }
      }
    });
  });
});

describe("Instrumentation", () => {
  let instrumentation: Instrumentation;

  describe("basic-example", () => {
    beforeEach(() => {
      instrumentation = new Instrumentation({
        metadata: { name: "my-instrumentation" },
        spec: {
          exporter: {
            endpoint: "http://my-collector-collector:4318"
          },
          propagators: ["tracecontext", "baggage"],
          sampler: {
            type: "parentbased_traceidratio",
            argument: "0.25"
          },
          nodejs: {
            image: "auto"
          },
          java: {
            image: "auto"
          }
        }
      });
    });

    it("should set apiVersion", () => {
      expect(instrumentation).toHaveProperty(
        "apiVersion",
        "opentelemetry.io/v1alpha1"
      );
    });

    it("should set kind", () => {
      expect(instrumentation).toHaveProperty("kind", "Instrumentation");
    });

    it("validate", () => {
      expect(() => instrumentation.validate()).not.toThrow();
    });

    it("toJSON", () => {
      expect(instrumentation.toJSON()).toEqual({
        apiVersion: "opentelemetry.io/v1alpha1",
        kind: "Instrumentation",
        metadata: { name: "my-instrumentation" },
        spec: {
          exporter: {
            endpoint: "http://my-collector-collector:4318"
          },
          propagators: ["tracecontext", "baggage"],
          sampler: {
            type: "parentbased_traceidratio",
            argument: "0.25"
          },
          nodejs: {
            image: "auto"
          },
          java: {
            image: "auto"
          }
        }
      });
    });
  });

  describe("multi-language-example", () => {
    beforeEach(() => {
      instrumentation = new Instrumentation({
        metadata: { name: "all-languages" },
        spec: {
          exporter: {
            endpoint: "http://otel-collector:4317"
          },
          propagators: ["tracecontext", "baggage", "b3"],
          sampler: {
            type: "always_on"
          },
          nodejs: {
            image: "auto"
          },
          python: {
            image: "auto"
          },
          java: {
            image: "auto",
            env: [
              {
                name: "OTEL_JAVAAGENT_DEBUG",
                value: "true"
              }
            ]
          },
          dotnet: {
            image: "auto"
          },
          resource: {
            addK8sUIDAttributes: true,
            resourceAttributes: {
              "service.namespace": "monitoring",
              "deployment.environment": "production"
            }
          }
        }
      });
    });

    it("should set apiVersion", () => {
      expect(instrumentation).toHaveProperty(
        "apiVersion",
        "opentelemetry.io/v1alpha1"
      );
    });

    it("should set kind", () => {
      expect(instrumentation).toHaveProperty("kind", "Instrumentation");
    });

    it("validate", () => {
      expect(() => instrumentation.validate()).not.toThrow();
    });

    it("toJSON", () => {
      expect(instrumentation.toJSON()).toEqual({
        apiVersion: "opentelemetry.io/v1alpha1",
        kind: "Instrumentation",
        metadata: { name: "all-languages" },
        spec: {
          exporter: {
            endpoint: "http://otel-collector:4317"
          },
          propagators: ["tracecontext", "baggage", "b3"],
          sampler: {
            type: "always_on"
          },
          nodejs: {
            image: "auto"
          },
          python: {
            image: "auto"
          },
          java: {
            image: "auto",
            env: [
              {
                name: "OTEL_JAVAAGENT_DEBUG",
                value: "true"
              }
            ]
          },
          dotnet: {
            image: "auto"
          },
          resource: {
            addK8sUIDAttributes: true,
            resourceAttributes: {
              "service.namespace": "monitoring",
              "deployment.environment": "production"
            }
          }
        }
      });
    });
  });
});
