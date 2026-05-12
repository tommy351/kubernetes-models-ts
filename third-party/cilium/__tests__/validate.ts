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
    it("should throw an error", () => {
      const lrp = new CiliumLocalRedirectPolicy({
        metadata: {
          name: "lrp",
        },
        // @ts-expect-error
        spec: {
          redirectFrontend: {},
        },
      });

      expect(() => lrp.validate()).toThrow(
        `data/spec must have required property redirectBackend`,
      );
    });
  });
});

describe("CiliumClusterwideNetworkPolicy", () => {
  describe("when endpointSelector and nodeSelector are defined", () => {
    it("should pass", () => {
      const policy = new CiliumClusterwideNetworkPolicy({
        metadata: { name: "test" },
        spec: {
          endpointSelector: {},
          nodeSelector: {},
          ingress: [],
        },
      });

      expect(() => policy.validate()).not.toThrow();
    });
  });

  describe("when endpointSelector is missing", () => {
    it("should throw an error", () => {
      const policy = new CiliumClusterwideNetworkPolicy({
        metadata: { name: "test" },
        // @ts-expect-error
        spec: {
          nodeSelector: {},
        },
      });

      expect(() => policy.validate()).toThrow(
        `data/spec must have required property endpointSelector`,
      );
    });
  });

  describe("when nodeSelector is missing", () => {
    it("should throw an error", () => {
      const policy = new CiliumClusterwideNetworkPolicy({
        metadata: { name: "test" },
        // @ts-expect-error
        spec: {
          endpointSelector: {},
        },
      });

      expect(() => policy.validate()).toThrow(
        `data/spec must have required property nodeSelector`,
      );
    });
  });
});
