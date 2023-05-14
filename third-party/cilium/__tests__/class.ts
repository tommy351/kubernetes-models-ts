import { describe, it, expect, beforeEach } from "vitest";
import { CiliumLocalRedirectPolicy } from "../gen/cilium.io/v2/CiliumLocalRedirectPolicy";
import { CiliumClusterwideNetworkPolicy } from "../gen/cilium.io/v2/CiliumClusterwideNetworkPolicy";

describe("CiliumLocalRedirectPolicy", () => {
  let lrp: CiliumLocalRedirectPolicy;

  beforeEach(() => {
    lrp = new CiliumLocalRedirectPolicy({
      metadata: {
        name: "lrp"
      },
      spec: {
        redirectFrontend: {
          serviceMatcher: {
            serviceName: "my-service",
            namespace: "default"
          }
        },
        redirectBackend: {
          localEndpointSelector: {
            matchLabels: {
              name: "proxy"
            }
          },
          toPorts: [
            {
              port: "8080",
              protocol: "TCP"
            }
          ]
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(lrp).toHaveProperty("apiVersion", "cilium.io/v2");
  });

  it("should set kind", () => {
    expect(lrp).toHaveProperty("kind", "CiliumLocalRedirectPolicy");
  });

  it("should set metadata", () => {
    expect(lrp.metadata).toEqual({ name: "lrp" });
  });

  it("should set sepc", () => {
    expect(lrp).toHaveProperty("spec");
  });

  it("toJSON", () => {
    expect(lrp.toJSON()).toEqual({
      apiVersion: "cilium.io/v2",
      kind: "CiliumLocalRedirectPolicy",
      metadata: {
        name: "lrp"
      },
      spec: {
        redirectFrontend: {
          serviceMatcher: {
            serviceName: "my-service",
            namespace: "default"
          }
        },
        redirectBackend: {
          localEndpointSelector: {
            matchLabels: {
              name: "proxy"
            }
          },
          toPorts: [
            {
              port: "8080",
              protocol: "TCP"
            }
          ]
        }
      }
    });
  });
});

describe("CiliumClusterwideNetworkPolicy", () => {
  let policy: CiliumClusterwideNetworkPolicy;

  beforeEach(() => {
    policy = new CiliumClusterwideNetworkPolicy({
      metadata: {
        name: "example"
      },
      spec: {
        endpointSelector: { matchLabels: { app: "service" } },
        ingress: [
          {
            fromEndpoints: [{ matchLabels: { env: "prod" } }]
          },
          {
            toPorts: [
              {
                ports: [{ port: "80", protocol: "TCP" }],
                rules: {
                  http: [
                    {
                      method: "GET",
                      path: "/public"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "cilium.io/v2");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "CiliumClusterwideNetworkPolicy");
  });

  it("should set metadata", () => {
    expect(policy.metadata).toEqual({ name: "example" });
  });

  it("should set sepc", () => {
    expect(policy).toHaveProperty("spec");
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "cilium.io/v2",
      kind: "CiliumClusterwideNetworkPolicy",
      metadata: {
        name: "example"
      },
      spec: {
        endpointSelector: { matchLabels: { app: "service" } },
        ingress: [
          {
            fromEndpoints: [{ matchLabels: { env: "prod" } }]
          },
          {
            toPorts: [
              {
                ports: [{ port: "80", protocol: "TCP" }],
                rules: {
                  http: [
                    {
                      method: "GET",
                      path: "/public"
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    });
  });
});
