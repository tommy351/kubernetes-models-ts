import { describe, it, expect, beforeEach } from "vitest";
import { SpiceDBCluster } from "../gen/authzed.com/v1alpha1/SpiceDBCluster";

describe("SpiceDBCluster", () => {
  let cluster: SpiceDBCluster;

  beforeEach(() => {
    cluster = new SpiceDBCluster({
      metadata: {
        name: "dev"
      },
      spec: {
        channel: "stable",
        version: "v1.14.0",
        config: {
          datastoreEngine: "memory"
        },
        secretName: "dev-spicedb-secret"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "authzed.com/v1alpha1");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "SpiceDBCluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "authzed.com/v1alpha1",
      kind: "SpiceDBCluster",
      metadata: {
        name: "dev"
      },
      spec: {
        channel: "stable",
        version: "v1.14.0",
        config: {
          datastoreEngine: "memory"
        },
        secretName: "dev-spicedb-secret"
      }
    });
  });
});
