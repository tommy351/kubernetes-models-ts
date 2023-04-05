import { describe, it, expect, beforeEach } from "vitest";
import { SpiffeID } from "../gen/spiffeid.spiffe.io/v1beta1/SpiffeID";

describe("SpiffeID", () => {
  let id: SpiffeID;

  beforeEach(() => {
    id = new SpiffeID({
      metadata: {
        name: "test-id"
      },
      spec: {
        parentId: "spiffe://example.org/spire/server",
        spiffeId: "spiffe://example.org/test",
        selector: {
          namespace: "default",
          podName: "test-pod"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(id).toHaveProperty("apiVersion", "spiffeid.spiffe.io/v1beta1");
  });

  it("should set kind", () => {
    expect(id).toHaveProperty("kind", "SpiffeID");
  });

  it("should set metadata", () => {
    expect(id.metadata).toEqual({ name: "test-id" });
  });

  it("toJSON", () => {
    expect(id.toJSON()).toEqual({
      apiVersion: "spiffeid.spiffe.io/v1beta1",
      kind: "SpiffeID",
      metadata: {
        name: "test-id"
      },
      spec: {
        parentId: "spiffe://example.org/spire/server",
        spiffeId: "spiffe://example.org/test",
        selector: {
          namespace: "default",
          podName: "test-pod"
        }
      }
    });
  });
});
