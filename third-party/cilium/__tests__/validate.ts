import { describe, it, expect } from "vitest";
import { CiliumLocalRedirectPolicy } from "../gen/cilium.io/v2/CiliumLocalRedirectPolicy";
import { CiliumClusterwideNetworkPolicy } from "../gen/cilium.io/v2/CiliumClusterwideNetworkPolicy";

describe("CiliumLocalRedirectPolicy", () => {
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
        `data/spec/redirectFrontend must have required property addressMatcher, data/spec/redirectFrontend must have required property serviceMatcher, data/spec/redirectFrontend must match exactly one schema in "oneOf"`
      );
    });
  });
});

describe("CiliumClusterwideNetworkPolicy", () => {
  describe("when endpointSelector is defined", () => {
    it("should pass", () => {
      const policy = new CiliumClusterwideNetworkPolicy({
        metadata: { name: "test" },
        spec: {
          endpointSelector: {}
        }
      });

      expect(() => policy.validate()).not.toThrow();
    });
  });

  describe("when nodeSelector is defined", () => {
    it("should pass", () => {
      const policy = new CiliumClusterwideNetworkPolicy({
        metadata: { name: "test" },
        spec: {
          nodeSelector: {}
        }
      });

      expect(() => policy.validate()).not.toThrow();
    });
  });

  describe("when both endpointSelector and nodeSelector are defined", () => {
    it("should throw an error", () => {
      const policy = new CiliumClusterwideNetworkPolicy({
        metadata: { name: "test" },
        spec: {
          endpointSelector: {},
          nodeSelector: {}
        }
      });

      expect(() => policy.validate()).toThrow(
        `data/spec must match exactly one schema in "oneOf"`
      );
    });
  });

  describe("when neither endpointSelector nor nodeSelector are defined", () => {
    it("should throw an error", () => {
      const policy = new CiliumClusterwideNetworkPolicy({
        metadata: { name: "test" },
        // @ts-expect-error
        spec: {}
      });

      expect(() => policy.validate()).toThrow(
        `data/spec must have required property endpointSelector, data/spec must have required property nodeSelector, data/spec must match exactly one schema in "oneOf"`
      );
    });
  });
});
