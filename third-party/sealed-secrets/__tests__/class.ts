import { SealedSecret } from "../gen/bitnami.com/v1alpha1/SealedSecret";

describe("SealedSecret", () => {
  let config: SealedSecret;

  beforeEach(() => {
    config = new SealedSecret({
      metadata: {
        name: "test"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(config).toHaveProperty("apiVersion", "bitnami.com/v1alpha1");
  });

  it("should set kind", () => {
    expect(config).toHaveProperty("kind", "SealedSecret");
  });

  it("should set metadata", () => {
    expect(config.metadata).toEqual({ name: "test" });
  });

  it("should not set sepc", () => {
    expect(config).not.toHaveProperty("spec");
  });

  it("toJSON", () => {
    expect(config.toJSON()).toEqual({
      apiVersion: "bitnami.com/v1alpha1",
      kind: "SealedSecret",
      metadata: {
        name: "test"
      }
    });
  });
});
