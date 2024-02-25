import { describe, it, expect, beforeEach } from "vitest";
import { K8ssandraCluster } from "../gen/k8ssandra.io/v1alpha1";

describe("K8ssandraCluster", () => {
  let cluster: K8ssandraCluster;

  beforeEach(() => {
    cluster = new K8ssandraCluster({
      metadata: { name: "hello" },
      spec: {
        cassandra: {
          datacenters: [
            {
              metadata: {
                name: "hello"
              },
              size: 3
            }
          ]
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "k8ssandra.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "K8ssandraCluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "k8ssandra.io/v1alpha1",
      kind: "K8ssandraCluster",
      metadata: { name: "hello" },
      spec: {
        cassandra: {
          datacenters: [
            {
              metadata: {
                name: "hello"
              },
              size: 3
            }
          ]
        }
      }
    });
  });
});
