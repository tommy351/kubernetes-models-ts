import { describe, it, expect, beforeEach } from "vitest";
import { TidbCluster } from "../gen/pingcap.com/v1alpha1/TidbCluster";

describe("TidbCluster", () => {
  let cluster: TidbCluster;

  beforeEach(() => {
    cluster = new TidbCluster({
      metadata: {
        name: "cluster-sample"
      },
      spec: {
        version: "v6.5.0",
        timezone: "UTC",
        pvReclaimPolicy: "Retain",
        enableDynamicConfiguration: true,
        configUpdateStrategy: "RollingUpdate",
        discovery: {},
        helper: {
          image: "alpine:3.16.0"
        },
        pd: {
          baseImage: "pingcap/pd",
          maxFailoverCount: 0,
          replicas: 1,
          requests: {
            storage: "1Gi"
          },
          config: {}
        },
        tikv: {
          baseImage: "pingcap/tikv",
          maxFailoverCount: 0,
          evictLeaderTimeout: "1m",
          replicas: 1,
          requests: {
            storage: "1Gi"
          },
          config: {
            storage: {
              "reserve-space": "0MB"
            },
            rocksdb: {
              "max-open-files": 256
            },
            raftdb: {
              "max-open-files": 256
            }
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "pingcap.com/v1alpha1");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "TidbCluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "pingcap.com/v1alpha1",
      kind: "TidbCluster",
      metadata: {
        name: "cluster-sample"
      },
      spec: {
        version: "v6.5.0",
        timezone: "UTC",
        pvReclaimPolicy: "Retain",
        enableDynamicConfiguration: true,
        configUpdateStrategy: "RollingUpdate",
        discovery: {},
        helper: {
          image: "alpine:3.16.0"
        },
        pd: {
          baseImage: "pingcap/pd",
          maxFailoverCount: 0,
          replicas: 1,
          requests: {
            storage: "1Gi"
          },
          config: {}
        },
        tikv: {
          baseImage: "pingcap/tikv",
          maxFailoverCount: 0,
          evictLeaderTimeout: "1m",
          replicas: 1,
          requests: {
            storage: "1Gi"
          },
          config: {
            storage: {
              "reserve-space": "0MB"
            },
            rocksdb: {
              "max-open-files": 256
            },
            raftdb: {
              "max-open-files": 256
            }
          }
        }
      }
    });
  });
});
