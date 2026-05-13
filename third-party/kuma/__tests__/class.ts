import { describe, it, expect } from "vitest";
import { Mesh } from "../gen/kuma.io/v1alpha1/Mesh.js";
import { MeshTrafficPermission } from "../gen/kuma.io/v1alpha1/MeshTrafficPermission.js";
import { MeshHealthCheck } from "../gen/kuma.io/v1alpha1/MeshHealthCheck.js";

describe("Mesh", () => {
  const mesh = new Mesh({
    metadata: {
      name: "default",
    },
    spec: {
      mtls: {
        enabledBackend: "ca-1",
        backends: [
          {
            name: "ca-1",
            type: "builtin",
          },
        ],
      },
    },
  });

  it("should set apiVersion", () => {
    expect(mesh).toHaveProperty("apiVersion", "kuma.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(mesh).toHaveProperty("kind", "Mesh");
  });

  it("validate", () => {
    expect(() => mesh.validate()).not.toThrow();
  });
});

describe("MeshTrafficPermission", () => {
  const mtp = new MeshTrafficPermission({
    metadata: {
      name: "allow-all",
      namespace: "kuma-system",
    },
    spec: {
      targetRef: {
        kind: "Mesh",
      },
      from: [
        {
          targetRef: {
            kind: "Mesh",
          },
          default: {
            action: "Allow",
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(mtp).toHaveProperty("apiVersion", "kuma.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(mtp).toHaveProperty("kind", "MeshTrafficPermission");
  });

  it("validate", () => {
    expect(() => mtp.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(mtp.toJSON()).toEqual({
      apiVersion: "kuma.io/v1alpha1",
      kind: "MeshTrafficPermission",
      metadata: {
        name: "allow-all",
        namespace: "kuma-system",
      },
      spec: {
        targetRef: {
          kind: "Mesh",
        },
        from: [
          {
            targetRef: {
              kind: "Mesh",
            },
            default: {
              action: "Allow",
            },
          },
        ],
      },
    });
  });
});

describe("MeshHealthCheck", () => {
  const hc = new MeshHealthCheck({
    metadata: {
      name: "redis-health-check",
      namespace: "kuma-system",
    },
    spec: {
      targetRef: {
        kind: "Mesh",
      },
      to: [
        {
          targetRef: {
            kind: "MeshService",
            name: "redis",
          },
          default: {
            interval: "10s",
            timeout: "2s",
            unhealthyThreshold: 3,
            healthyThreshold: 1,
            tcp: {
              disabled: false,
            },
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(hc).toHaveProperty("apiVersion", "kuma.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(hc).toHaveProperty("kind", "MeshHealthCheck");
  });

  it("validate", () => {
    expect(() => hc.validate()).not.toThrow();
  });
});
