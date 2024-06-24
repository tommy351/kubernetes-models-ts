import { describe, it, expect, beforeEach } from "vitest";
import { TempoMonolithic } from "../gen/tempo.grafana.com/v1alpha1/TempoMonolithic";
import { TempoStack } from "../gen/tempo.grafana.com/v1alpha1/TempoStack";

describe("TempoMonolithic", () => {
  let cluster: TempoMonolithic;

  beforeEach(() => {
    cluster = new TempoMonolithic({
      metadata: {
        name: "dev"
      },
      spec: {
        storage: {
          traces: { gcs: { secret: "tempo-traces" }, backend: "gcs" }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "tempo.grafana.com/v1alpha1");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "TempoMonolithic");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "tempo.grafana.com/v1alpha1",
      kind: "TempoMonolithic",
      metadata: {
        name: "dev"
      },
      spec: {
        storage: {
          traces: { gcs: { secret: "tempo-traces" }, backend: "gcs" }
        }
      }
    });
  });
});

describe("TempoStack", () => {
  let cluster: TempoStack;

  beforeEach(() => {
    cluster = new TempoStack({
      metadata: {
        name: "dev"
      },
      spec: {
        storage: {
          secret: {
            name: "tempo-traces",
            type: "gcs"
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "tempo.grafana.com/v1alpha1");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "TempoStack");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "tempo.grafana.com/v1alpha1",
      kind: "TempoStack",
      metadata: {
        name: "dev"
      },
      spec: {
        storage: {
          secret: {
            name: "tempo-traces",
            type: "gcs"
          }
        }
      }
    });
  });
});
