import { describe, it, expect } from "vitest";
import { Cluster } from "../gen/postgresql.cnpg.io/v1/Cluster.js";

describe("Application", () => {
  const cluster = new Cluster({
    metadata: {
      name: "cluster-example",
    },
    spec: {
      instances: 3,
      storage: {
        size: "1Gi",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "postgresql.cnpg.io/v1");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "Cluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "postgresql.cnpg.io/v1",
      kind: "Cluster",
      metadata: {
        name: "cluster-example",
      },
      spec: {
        instances: 3,
        storage: {
          size: "1Gi",
        },
      },
    });
  });
});
