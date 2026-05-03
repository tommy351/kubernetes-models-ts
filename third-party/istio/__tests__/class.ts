import { describe, it, expect } from "vitest";
import { Gateway } from "../gen/networking.istio.io/v1beta1/Gateway.js";

describe("Gateway", () => {
  const gateway = new Gateway({
    metadata: {
      name: "test",
    },
    spec: {
      selector: {
        app: "istio",
      },
      servers: [
        {
          port: {
            number: 80,
            name: "http",
            protocol: "HTTP",
          },
          hosts: ["*"],
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(gateway).toHaveProperty("apiVersion", "networking.istio.io/v1beta1");
  });

  it("should set kind", () => {
    expect(gateway).toHaveProperty("kind", "Gateway");
  });

  it("validate", () => {
    expect(() => gateway.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(gateway.toJSON()).toEqual({
      apiVersion: "networking.istio.io/v1beta1",
      kind: "Gateway",
      metadata: {
        name: "test",
      },
      spec: {
        selector: {
          app: "istio",
        },
        servers: [
          {
            port: {
              number: 80,
              name: "http",
              protocol: "HTTP",
            },
            hosts: ["*"],
          },
        ],
      },
    });
  });
});
