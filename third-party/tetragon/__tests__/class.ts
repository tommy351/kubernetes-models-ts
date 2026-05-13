import { describe, it, expect } from "vitest";
import { TracingPolicy } from "../gen/cilium.io/v1alpha1/TracingPolicy.js";
import { TracingPolicyNamespaced } from "../gen/cilium.io/v1alpha1/TracingPolicyNamespaced.js";
import { PodInfo } from "../gen/cilium.io/v1alpha1/PodInfo.js";

describe("TracingPolicy", () => {
  const policy = new TracingPolicy({
    metadata: {
      name: "sys-write",
    },
    spec: {
      kprobes: [
        {
          call: "sys_write",
          syscall: true,
          args: [
            {
              index: 0,
              type: "int",
            },
          ],
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "cilium.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "TracingPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "cilium.io/v1alpha1",
      kind: "TracingPolicy",
      metadata: {
        name: "sys-write",
      },
      spec: {
        kprobes: [
          {
            call: "sys_write",
            syscall: true,
            args: [
              {
                index: 0,
                type: "int",
              },
            ],
          },
        ],
      },
    });
  });
});

describe("TracingPolicyNamespaced", () => {
  const policy = new TracingPolicyNamespaced({
    metadata: {
      name: "namespaced-sys-write",
      namespace: "default",
    },
    spec: {
      kprobes: [
        {
          call: "sys_write",
          syscall: true,
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "cilium.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "TracingPolicyNamespaced");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });
});

describe("PodInfo", () => {
  const podInfo = new PodInfo({
    metadata: {
      name: "example-pod",
      namespace: "default",
    },
    spec: {
      hostNetwork: false,
      nodeName: "node-1",
    },
    status: {
      podIP: "10.0.0.1",
      podIPs: [{ IP: "10.0.0.1" }],
    },
  });

  it("should set apiVersion", () => {
    expect(podInfo).toHaveProperty("apiVersion", "cilium.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(podInfo).toHaveProperty("kind", "PodInfo");
  });

  it("validate", () => {
    expect(() => podInfo.validate()).not.toThrow();
  });
});
