import { describe, it, expect } from "vitest";
import { CiliumLocalRedirectPolicy } from "../gen/cilium.io/v2/CiliumLocalRedirectPolicy";

describe("validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const lrp = new CiliumLocalRedirectPolicy({
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

      expect(() => lrp.validate()).not.toThrow();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const lrp = new CiliumLocalRedirectPolicy({
        metadata: {
          name: "lrp"
        },
        spec: {
          // @ts-expect-error
          redirectFrontend: {},
          redirectBackend: {
            localEndpointSelector: {},
            toPorts: []
          }
        }
      });

      expect(() => lrp.validate()).toThrow(
        "data/spec/redirectFrontend must have required property 'addressMatcher', data/spec/redirectFrontend must have required property 'serviceMatcher', data/spec/redirectFrontend must match exactly one schema in oneOf"
      );
    });
  });
});
