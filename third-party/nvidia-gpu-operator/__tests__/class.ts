import { describe, it, expect } from "vitest";
import { ClusterPolicy } from "../gen/nvidia.com/v1/ClusterPolicy.js";
import { NVIDIADriver } from "../gen/nvidia.com/v1alpha1/NVIDIADriver.js";

describe("ClusterPolicy", () => {
  const policy = new ClusterPolicy({
    metadata: {
      name: "cluster-policy",
      namespace: "gpu-operator",
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "nvidia.com/v1");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "ClusterPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "nvidia.com/v1",
      kind: "ClusterPolicy",
      metadata: {
        name: "cluster-policy",
        namespace: "gpu-operator",
      },
    });
  });
});

describe("NVIDIADriver", () => {
  const driver = new NVIDIADriver({
    metadata: {
      name: "gpu-driver",
      namespace: "gpu-operator",
    },
    spec: {
      driverType: "gpu",
      image: "nvcr.io/nvidia/driver",
      repository: "nvcr.io/nvidia",
      version: "550.90.07",
    },
  });

  it("should set apiVersion", () => {
    expect(driver).toHaveProperty("apiVersion", "nvidia.com/v1alpha1");
  });

  it("should set kind", () => {
    expect(driver).toHaveProperty("kind", "NVIDIADriver");
  });

  it("validate", () => {
    expect(() => driver.validate()).not.toThrow();
  });
});
