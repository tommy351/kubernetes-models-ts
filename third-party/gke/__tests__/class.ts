import { describe, it, expect, beforeEach } from "vitest";
import { BackendConfig } from "../gen/cloud.google.com/v1beta1/BackendConfig";
import { SpannerInstance } from "../gen/spanner.cnrm.cloud.google.com/v1beta1/SpannerInstance";

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

describe("SpannerInstance", () => {
  let instance: SpannerInstance;

  beforeEach(() => {
    instance = new SpannerInstance({
      metadata: {
        name: "spanner-example"
      },
      spec: {
        config: "regional-us-west1",
        displayName: "Spanner Example",
        numNodes: 1
      }
    });
  });

  it("should set apiVersion", () => {
    expect(instance).toHaveProperty(
      "apiVersion",
      "spanner.cnrm.cloud.google.com/v1beta1"
    );
  });

  it("should set kind", () => {
    expect(instance).toHaveProperty("kind", "SpannerInstance");
  });

  it("should set metadata", () => {
    expect(instance.metadata).toEqual({ name: "spanner-example" });
  });

  it("should set spec", () => {
    expect(instance.spec).toEqual({
      config: "regional-us-west1",
      displayName: "Spanner Example",
      numNodes: 1
    });
  });

  it("toJSON", () => {
    expect(instance.toJSON()).toEqual({
      apiVersion: "spanner.cnrm.cloud.google.com/v1beta1",
      kind: "SpannerInstance",
      metadata: {
        name: "spanner-example"
      },
      spec: {
        config: "regional-us-west1",
        displayName: "Spanner Example",
        numNodes: 1
      }
    });
  });
});
