import { describe, it, expect, beforeEach } from "vitest";
import {
  BackendTrafficPolicy,
  ClientTrafficPolicy,
  EnvoyPatchPolicy,
  EnvoyProxy,
  SecurityPolicy
} from "../gen/gateway.envoyproxy.io/v1alpha1";
import * as v05 from "../gen/config.gateway.envoyproxy.io/v1alpha1";

describe("BackendTrafficPolicy", () => {
  let policy: BackendTrafficPolicy;

  beforeEach(() => {
    policy = new BackendTrafficPolicy({
      metadata: {
        namespace: "envoy-gateway",
        name: "target-gateway-1"
      },
      spec: {
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
          namespace: "envoy-gateway"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1"
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
        name: "target-gateway-1"
      },
      spec: {
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
          namespace: "envoy-gateway"
        }
      }
    });
  });
});

describe("ClientTrafficPolicy", () => {
  let policy: ClientTrafficPolicy;

  beforeEach(() => {
    policy = new ClientTrafficPolicy({
      metadata: {
        namespace: "envoy-gateway",
        name: "target-gateway-1"
      },
      spec: {
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
          namespace: "envoy-gateway"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1"
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
        name: "target-gateway-1"
      },
      spec: {
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
          namespace: "envoy-gateway"
        }
      }
    });
  });
});

describe("EnvoyPatchPolicy", () => {
  let policy: EnvoyPatchPolicy;

  beforeEach(() => {
    policy = new EnvoyPatchPolicy({
      metadata: {
        namespace: "envoy-gateway-2",
        name: "edit-conn-buffer-bytes"
      },
      spec: {
        type: "JSONPatch",
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
          namespace: "envoy-gateway"
        },
        jsonPatches: [
          {
            type: "type.googleapis.com/envoy.config.listener.v3.Listener",
            name: "envoy-gateway-gateway-1-http",
            operation: {
              op: "replace",
              path: "/per_connection_buffer_limit_bytes",
              value: "1024"
            }
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1"
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
        name: "edit-conn-buffer-bytes"
      },
      spec: {
        type: "JSONPatch",
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
          namespace: "envoy-gateway"
        },
        jsonPatches: [
          {
            type: "type.googleapis.com/envoy.config.listener.v3.Listener",
            name: "envoy-gateway-gateway-1-http",
            operation: {
              op: "replace",
              path: "/per_connection_buffer_limit_bytes",
              value: "1024"
            }
          }
        ]
      }
    });
  });
});

describe("EnvoyProxy", () => {
  let proxy: EnvoyProxy;

  beforeEach(() => {
    proxy = new EnvoyProxy({
      metadata: {
        namespace: "envoy-gateway-system",
        name: "test"
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
                    duration: "%DURATION%"
                  }
                },
                sinks: [
                  {
                    type: "File",
                    file: {
                      path: "/dev/stdout"
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(proxy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1"
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
        name: "test"
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
                    duration: "%DURATION%"
                  }
                },
                sinks: [
                  {
                    type: "File",
                    file: {
                      path: "/dev/stdout"
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    });
  });
});

describe("SecurityPolicy", () => {
  let policy: SecurityPolicy;

  beforeEach(() => {
    policy = new SecurityPolicy({
      metadata: {
        namespace: "envoy-gateway",
        name: "target-gateway-1"
      },
      spec: {
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
          namespace: "envoy-gateway"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty(
      "apiVersion",
      "gateway.envoyproxy.io/v1alpha1"
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
        name: "target-gateway-1"
      },
      spec: {
        targetRef: {
          group: "gateway.networking.k8s.io",
          kind: "Gateway",
          name: "gateway-1",
          namespace: "envoy-gateway"
        }
      }
    });
  });
});

describe("v0.5.0", () => {
  describe("EnvoyProxy", () => {
    let proxy: v05.EnvoyProxy;

    beforeEach(() => {
      proxy = new v05.EnvoyProxy({
        metadata: {
          namespace: "envoy-gateway-system",
          name: "test"
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
                      duration: "%DURATION%"
                    }
                  },
                  sinks: [
                    {
                      type: "File",
                      file: {
                        path: "/dev/stdout"
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
      });
    });

    it("should set apiVersion", () => {
      expect(proxy).toHaveProperty(
        "apiVersion",
        "config.gateway.envoyproxy.io/v1alpha1"
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
        apiVersion: "config.gateway.envoyproxy.io/v1alpha1",
        kind: "EnvoyProxy",
        metadata: {
          namespace: "envoy-gateway-system",
          name: "test"
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
                      duration: "%DURATION%"
                    }
                  },
                  sinks: [
                    {
                      type: "File",
                      file: {
                        path: "/dev/stdout"
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
      });
    });
  });
});
