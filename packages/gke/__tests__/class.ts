import { BackendConfig } from "../gen/cloud.google.com/v1beta1/BackendConfig";

describe("BackendConfig", () => {
  let config: BackendConfig;

  beforeEach(() => {
    config = new BackendConfig({
      metadata: {
        name: "test"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(config).toHaveProperty("apiVersion", "cloud.google.com/v1beta1");
  });

  it("should set kind", () => {
    expect(config).toHaveProperty("kind", "BackendConfig");
  });

  it("should set metadata", () => {
    expect(config.metadata).toEqual({ name: "test" });
  });

  it("should not set sepc", () => {
    expect(config).not.toHaveProperty("spec");
  });

  it("toJSON", () => {
    expect(config.toJSON()).toEqual({
      apiVersion: "cloud.google.com/v1beta1",
      kind: "BackendConfig",
      metadata: {
        name: "test"
      }
    });
  });
});
