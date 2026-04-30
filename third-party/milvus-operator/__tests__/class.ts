import { describe, it, expect, beforeEach } from "vitest";
import { Milvus } from "../gen/milvus.io/v1beta1/Milvus";

describe("Milvus", () => {
  let milvus: Milvus;

  beforeEach(() => {
    milvus = new Milvus({
      metadata: {
        name: "milvus"
      },
      spec: {
        mode: "cluster",
        components: {
          image: "milvusdb/milvus:v2.6.15"
        }
      }
    });
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
        name: "milvus"
      },
      spec: {
        mode: "cluster",
        components: {
          image: "milvusdb/milvus:v2.6.15"
        }
      }
    });
  });
});
