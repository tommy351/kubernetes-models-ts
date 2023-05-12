import { describe, it, expect, beforeEach } from "vitest";
import { CiliumClusterwideNetworkPolicy } from "../gen/cilium.io/v2/CiliumClusterwideNetworkPolicy";
import { CiliumLocalRedirectPolicy } from "../gen/cilium.io/v2/CiliumLocalRedirectPolicy";

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
  let cnp: CiliumClusterwideNetworkPolicy;

  beforeEach(() => {
    cnp = new CiliumClusterwideNetworkPolicy({
      metadata: {
        name: "cnp"
      },
      spec: {
        endpointSelector: {
          matchLabels: {
            "foo": "bar",
          },
        },
        ingress: [
          {
            fromCIDR: [
              '10.10.0.0/16',
            ],
            toPorts: [{
              ports: [{
                port: '1234',
                protocol: 'ANY',
              }],
            }],
          },
        ],
      },
    });
  });

  it("should set apiVersion", () => {
    expect(cnp).toHaveProperty("apiVersion", "cilium.io/v2");
  });

  it("should set kind", () => {
    expect(cnp).toHaveProperty("kind", "CiliumClusterwideNetworkPolicy");
  });

  it("should set metadata", () => {
    expect(cnp.metadata).toEqual({ name: "cnp" });
  });

  it("should set spec", () => {
    expect(cnp).toHaveProperty("spec");
  });

  it("should have ingress", () => {
    expect(cnp.spec).toHaveProperty("ingress");
  });
});
