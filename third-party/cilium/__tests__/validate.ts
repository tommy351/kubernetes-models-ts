import { describe, it, expect } from "vitest";
import { CiliumLocalRedirectPolicy } from "../gen/cilium.io/v2/CiliumLocalRedirectPolicy.js";
import { CiliumClusterwideNetworkPolicy } from "../gen/cilium.io/v2/CiliumClusterwideNetworkPolicy.js";

describe("CiliumLocalRedirectPolicy", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const lrp = new CiliumLocalRedirectPolicy({
        metadata: {
          name: "lrp",
        },
        spec: {
          redirectFrontend: {
            serviceMatcher: {
              serviceName: "my-service",
              namespace: "default",
            },
          },
          redirectBackend: {
            localEndpointSelector: {
              matchLabels: {
                name: "proxy",
              },
            },
            toPorts: [
              {
                port: "8080",
                protocol: "TCP",
              },
            ],
          },
        },
      });

      expect(() => lrp.validate()).not.toThrow();
    });
  });

  describe("when validation failed", () => {
    it("should require one redirectFrontend matcher", () => {
      const lrp = new CiliumLocalRedirectPolicy({
        metadata: {
          name: "lrp",
        },
        spec: {
          // @ts-expect-error
          redirectFrontend: {},
          redirectBackend: {
            localEndpointSelector: {
              matchLabels: {
                name: "proxy",
              },
            },
            toPorts: [
              {
                port: "8080",
                protocol: "TCP",
              },
            ],
          },
        },
      });

      expect(() => lrp.validate()).toThrow(
        `data/spec/redirectFrontend must have required property addressMatcher, data/spec/redirectFrontend must have required property serviceMatcher, data/spec/redirectFrontend must match exactly one schema in "oneOf"`,
      );
    });
  });
});

describe("CiliumClusterwideNetworkPolicy", () => {
  describe("when endpointSelector and nodeSelector are defined", () => {
    it("should throw an error", () => {
      const policy = new CiliumClusterwideNetworkPolicy({
        metadata: { name: "test" },
        spec: {
          endpointSelector: {},
          nodeSelector: {},
          ingress: [],
        },
      });

      expect(() => policy.validate()).toThrow(
        `data/spec must match exactly one schema in "oneOf"`,
      );
    });
  });

  describe("when endpointSelector is defined", () => {
    it("should pass", () => {
      const policy = new CiliumClusterwideNetworkPolicy({
        metadata: { name: "test" },
        spec: {
          endpointSelector: {},
          ingress: [],
        },
      });

      expect(() => policy.validate()).not.toThrow();
    });
  });

  describe("when nodeSelector is defined", () => {
    it("should pass", () => {
      const policy = new CiliumClusterwideNetworkPolicy({
        metadata: { name: "test" },
        spec: {
          nodeSelector: {},
          ingress: [],
        },
      });

      expect(() => policy.validate()).not.toThrow();
    });
  });
});
