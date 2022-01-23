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
