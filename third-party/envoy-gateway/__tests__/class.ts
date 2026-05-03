import { describe, it, expect } from "vitest";
import {
  BackendTrafficPolicy,
  ClientTrafficPolicy,
  EnvoyExtensionPolicy,
  EnvoyPatchPolicy,
  EnvoyProxy,
  SecurityPolicy,
} from "../gen/gateway.envoyproxy.io/v1alpha1/index.js";

describe("BackendTrafficPolicy", () => {
  const policy = new BackendTrafficPolicy({
    metadata: {
      namespace: "envoy-gateway",
      name: "target-gateway-1",
    },
    spec: {
      targetRef: {
        group: "gateway.networking.k8s.io",
        kind: "Gateway",
        name: "gateway-1",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "BackendTrafficPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "gateway.envoyproxy.io/v1alpha1",
      kind: "BackendTrafficPolicy",
      metadata: {
        namespace: "envoy-gateway",
        name: "target-gateway-1",
      },
      spec: {
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
        },
      },
    });
  });
});

describe("ClientTrafficPolicy", () => {
  const policy = new ClientTrafficPolicy({
    metadata: {
      namespace: "envoy-gateway",
      name: "target-gateway-1",
    },
    spec: {
      targetRef: {
        group: "gateway.networking.k8s.io",
        kind: "Gateway",
        name: "gateway-1",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "ClientTrafficPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "gateway.envoyproxy.io/v1alpha1",
      kind: "ClientTrafficPolicy",
      metadata: {
        namespace: "envoy-gateway",
        name: "target-gateway-1",
      },
      spec: {
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
        },
      },
    });
  });
});

describe("EnvoyPatchPolicy", () => {
  const policy = new EnvoyPatchPolicy({
    metadata: {
      namespace: "envoy-gateway-2",
      name: "edit-conn-buffer-bytes",
    },
    spec: {
      type: "JSONPatch",
      targetRef: {
        group: "gateway.networking.k8s.io",
        kind: "Gateway",
        name: "gateway-1",
      },
      jsonPatches: [
        {
          type: "type.googleapis.com/envoy.config.listener.v3.Listener",
          name: "envoy-gateway-gateway-1-http",
          operation: {
            op: "replace",
            path: "/per_connection_buffer_limit_bytes",
            value: "1024",
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "EnvoyPatchPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "gateway.envoyproxy.io/v1alpha1",
      kind: "EnvoyPatchPolicy",
      metadata: {
        namespace: "envoy-gateway-2",
        name: "edit-conn-buffer-bytes",
      },
      spec: {
        type: "JSONPatch",
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
        },
        jsonPatches: [
          {
            type: "type.googleapis.com/envoy.config.listener.v3.Listener",
            name: "envoy-gateway-gateway-1-http",
            operation: {
              op: "replace",
              path: "/per_connection_buffer_limit_bytes",
              value: "1024",
            },
          },
        ],
      },
    });
  });
});

describe("EnvoyProxy", () => {
  const proxy = new EnvoyProxy({
    metadata: {
      namespace: "envoy-gateway-system",
      name: "test",
    },
    spec: {
      telemetry: {
        accessLog: {
          settings: [
            {
              format: {
                type: "JSON",
                json: {
                  protocol: "%PROTOCOL%",
                  duration: "%DURATION%",
                },
              },
              sinks: [
                {
                  type: "File",
                  file: {
                    path: "/dev/stdout",
                  },
                },
              ],
            },
          ],
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(proxy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(proxy).toHaveProperty("kind", "EnvoyProxy");
  });

  it("validate", () => {
    expect(() => proxy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(proxy.toJSON()).toEqual({
      apiVersion: "gateway.envoyproxy.io/v1alpha1",
      kind: "EnvoyProxy",
      metadata: {
        namespace: "envoy-gateway-system",
        name: "test",
      },
      spec: {
        telemetry: {
          accessLog: {
            settings: [
              {
                format: {
                  type: "JSON",
                  json: {
                    protocol: "%PROTOCOL%",
                    duration: "%DURATION%",
                  },
                },
                sinks: [
                  {
                    type: "File",
                    file: {
                      path: "/dev/stdout",
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    });
  });
});

describe("SecurityPolicy", () => {
  const policy = new SecurityPolicy({
    metadata: {
      namespace: "envoy-gateway",
      name: "target-gateway-1",
    },
    spec: {
      targetRef: {
        group: "gateway.networking.k8s.io",
        kind: "Gateway",
        name: "gateway-1",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "SecurityPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "gateway.envoyproxy.io/v1alpha1",
      kind: "SecurityPolicy",
      metadata: {
        namespace: "envoy-gateway",
        name: "target-gateway-1",
      },
      spec: {
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
        },
      },
    });
  });
});

describe("EnvoyExtensionPolicy", () => {
  const policy = new EnvoyExtensionPolicy({
    metadata: {
      namespace: "envoy-gateway",
      name: "target-gateway-1",
    },
    spec: {
      targetRefs: [
        {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "EnvoyExtensionPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "gateway.envoyproxy.io/v1alpha1",
      kind: "EnvoyExtensionPolicy",
      metadata: {
        namespace: "envoy-gateway",
        name: "target-gateway-1",
      },
      spec: {
        targetRefs: [
          {
            group: "gateway.networking.k8s.io",
            kind: "Gateway",
            name: "gateway-1",
          },
        ],
      },
    });
  });
});
