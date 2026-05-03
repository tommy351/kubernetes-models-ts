import { describe, it, expect } from "vitest";
import { Milvus } from "../gen/milvus.io/v1beta1/Milvus.js";
import { MilvusUpgrade } from "../gen/milvus.io/v1beta1/MilvusUpgrade.js";
import { MilvusCluster } from "../gen/milvus.io/v1alpha1/MilvusCluster.js";

describe("Milvus", () => {
  const milvus = new Milvus({
    metadata: {
      name: "milvus",
    },
    spec: {
      mode: "cluster",
      components: {
        image: "milvusdb/milvus:v2.6.15",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(milvus).toHaveProperty("apiVersion", "milvus.io/v1beta1");
  });

  it("should set kind", () => {
    expect(milvus).toHaveProperty("kind", "Milvus");
  });

  it("validate", () => {
    expect(() => milvus.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(milvus.toJSON()).toEqual({
      apiVersion: "milvus.io/v1beta1",
      kind: "Milvus",
      metadata: {
        name: "milvus",
      },
      spec: {
        mode: "cluster",
        components: {
          image: "milvusdb/milvus:v2.6.15",
        },
      },
    });
  });
});

describe("MilvusUpgrade", () => {
  const upgrade = new MilvusUpgrade({
    metadata: {
      name: "upgrade",
    },
    spec: {
      milvus: {
        name: "milvus",
      },
      sourceVersion: "v2.5.0",
      targetVersion: "v2.6.15",
    },
  });

  it("should set apiVersion", () => {
    expect(upgrade).toHaveProperty("apiVersion", "milvus.io/v1beta1");
  });

  it("should set kind", () => {
    expect(upgrade).toHaveProperty("kind", "MilvusUpgrade");
  });

  it("validate", () => {
    expect(() => upgrade.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(upgrade.toJSON()).toEqual({
      apiVersion: "milvus.io/v1beta1",
      kind: "MilvusUpgrade",
      metadata: {
        name: "upgrade",
      },
      spec: {
        milvus: {
          name: "milvus",
        },
        sourceVersion: "v2.5.0",
        targetVersion: "v2.6.15",
      },
    });
  });
});

describe("MilvusCluster", () => {
  const cluster = new MilvusCluster({
    metadata: {
      name: "cluster",
    },
    spec: {
      components: {
        image: "milvusdb/milvus:v2.6.15",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "milvus.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "MilvusCluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "milvus.io/v1alpha1",
      kind: "MilvusCluster",
      metadata: {
        name: "cluster",
      },
      spec: {
        components: {
          image: "milvusdb/milvus:v2.6.15",
        },
      },
    });
  });
});
