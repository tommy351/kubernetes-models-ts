import { describe, it, expect, beforeEach } from "vitest";
import { SealedSecret } from "../gen/bitnami.com/v1alpha1/SealedSecret";

describe("SealedSecret", () => {
  let secret: SealedSecret;

  beforeEach(() => {
    secret = new SealedSecret({
      metadata: {
        name: "test"
      },
      spec: {
        encryptedData: {
          foo: "bar"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(secret).toHaveProperty("apiVersion", "bitnami.com/v1alpha1");
  });

  it("should set kind", () => {
    expect(secret).toHaveProperty("kind", "SealedSecret");
  });

  it("should set metadata", () => {
    expect(secret.metadata).toEqual({ name: "test" });
  });

  it("toJSON", () => {
    expect(secret.toJSON()).toEqual({
      apiVersion: "bitnami.com/v1alpha1",
      kind: "SealedSecret",
      metadata: {
        name: "test"
      },
      spec: {
        encryptedData: {
          foo: "bar"
        }
      }
    });
  });
});
