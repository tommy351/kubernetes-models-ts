import { describe, it, expect } from "vitest";
import { CephCluster } from "../gen/ceph.rook.io/v1/CephCluster.js";
import { CephBlockPool } from "../gen/ceph.rook.io/v1/CephBlockPool.js";
import { CephFilesystem } from "../gen/ceph.rook.io/v1/CephFilesystem.js";
import { CephObjectStore } from "../gen/ceph.rook.io/v1/CephObjectStore.js";
import { CephObjectStoreUser } from "../gen/ceph.rook.io/v1/CephObjectStoreUser.js";
import { CephNFS } from "../gen/ceph.rook.io/v1/CephNFS.js";

describe("CephCluster", () => {
  const cluster = new CephCluster({
    metadata: {
      name: "rook-ceph",
      namespace: "rook-ceph",
    },
    spec: {
      cephVersion: {
        image: "quay.io/ceph/ceph:v18.2.4",
      },
      dataDirHostPath: "/var/lib/rook",
      mon: {
        count: 3,
      },
      storage: {
        useAllNodes: true,
        useAllDevices: true,
      },
    },
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "ceph.rook.io/v1");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "CephCluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "ceph.rook.io/v1",
      kind: "CephCluster",
      metadata: {
        name: "rook-ceph",
        namespace: "rook-ceph",
      },
      spec: {
        cephVersion: {
          image: "quay.io/ceph/ceph:v18.2.4",
        },
        dataDirHostPath: "/var/lib/rook",
        mon: {
          count: 3,
        },
        storage: {
          useAllNodes: true,
          useAllDevices: true,
        },
      },
    });
  });
});

describe("CephBlockPool", () => {
  const pool = new CephBlockPool({
    metadata: {
      name: "replicapool",
      namespace: "rook-ceph",
    },
    spec: {
      failureDomain: "host",
      replicated: {
        size: 3,
      },
    },
  });

  it("should set apiVersion", () => {
    expect(pool).toHaveProperty("apiVersion", "ceph.rook.io/v1");
  });

  it("should set kind", () => {
    expect(pool).toHaveProperty("kind", "CephBlockPool");
  });

  it("validate", () => {
    expect(() => pool.validate()).not.toThrow();
  });
});

describe("CephFilesystem", () => {
  const fs = new CephFilesystem({
    metadata: {
      name: "myfs",
      namespace: "rook-ceph",
    },
    spec: {
      metadataPool: {
        replicated: {
          size: 3,
        },
      },
      dataPools: [
        {
          name: "replicated",
          replicated: {
            size: 3,
          },
        },
      ],
      metadataServer: {
        activeCount: 1,
        activeStandby: true,
      },
    },
  });

  it("should set apiVersion", () => {
    expect(fs).toHaveProperty("apiVersion", "ceph.rook.io/v1");
  });

  it("should set kind", () => {
    expect(fs).toHaveProperty("kind", "CephFilesystem");
  });

  it("validate", () => {
    expect(() => fs.validate()).not.toThrow();
  });
});

describe("CephObjectStore", () => {
  const store = new CephObjectStore({
    metadata: {
      name: "my-store",
      namespace: "rook-ceph",
    },
    spec: {
      metadataPool: {
        replicated: {
          size: 3,
        },
      },
      dataPool: {
        replicated: {
          size: 3,
        },
      },
      gateway: {
        port: 80,
        instances: 1,
      },
    },
  });

  it("should set apiVersion", () => {
    expect(store).toHaveProperty("apiVersion", "ceph.rook.io/v1");
  });

  it("should set kind", () => {
    expect(store).toHaveProperty("kind", "CephObjectStore");
  });

  it("validate", () => {
    expect(() => store.validate()).not.toThrow();
  });
});

describe("CephObjectStoreUser", () => {
  const user = new CephObjectStoreUser({
    metadata: {
      name: "my-user",
      namespace: "rook-ceph",
    },
    spec: {
      store: "my-store",
      displayName: "My Object Store User",
    },
  });

  it("should set apiVersion", () => {
    expect(user).toHaveProperty("apiVersion", "ceph.rook.io/v1");
  });

  it("should set kind", () => {
    expect(user).toHaveProperty("kind", "CephObjectStoreUser");
  });

  it("validate", () => {
    expect(() => user.validate()).not.toThrow();
  });
});

describe("CephNFS", () => {
  const nfs = new CephNFS({
    metadata: {
      name: "my-nfs",
      namespace: "rook-ceph",
    },
    spec: {
      server: {
        active: 1,
      },
    },
  });

  it("should set apiVersion", () => {
    expect(nfs).toHaveProperty("apiVersion", "ceph.rook.io/v1");
  });

  it("should set kind", () => {
    expect(nfs).toHaveProperty("kind", "CephNFS");
  });

  it("validate", () => {
    expect(() => nfs.validate()).not.toThrow();
  });
});
