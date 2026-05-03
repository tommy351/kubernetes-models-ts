import { describe, it, expect } from "vitest";
import { Postgres } from "../gen/kubedb.com/v1alpha2/Postgres.js";

describe("Postgres", () => {
  const pg = new Postgres({
    metadata: { name: "example" },
    spec: {
      version: "13.2",
      storageType: "Durable",
      storage: {
        storageClassName: "standard",
        accessModes: ["ReadWriteOnce"],
        resources: {
          requests: { storage: "1Gi" },
        },
      },
      terminationPolicy: "DoNotTerminate",
    },
  });

  it("should set apiVersion", () => {
    expect(pg).toHaveProperty("apiVersion", "kubedb.com/v1alpha2");
  });

  it("should set kind", () => {
    expect(pg).toHaveProperty("kind", "Postgres");
  });

  it("validate", () => {
    expect(() => pg.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(pg.toJSON()).toEqual({
      apiVersion: "kubedb.com/v1alpha2",
      kind: "Postgres",
      metadata: { name: "example" },
      spec: {
        version: "13.2",
        storageType: "Durable",
        storage: {
          storageClassName: "standard",
          accessModes: ["ReadWriteOnce"],
          resources: {
            requests: { storage: "1Gi" },
          },
        },
        terminationPolicy: "DoNotTerminate",
      },
    });
  });
});
