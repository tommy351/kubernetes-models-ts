import { describe, it, expect, beforeEach } from "vitest";
import { IngressRoute } from "../gen/traefik.containo.us/v1alpha1/IngressRoute";

describe("IngressRoute", () => {
  let ingressRoute: IngressRoute;

  beforeEach(() => {
    ingressRoute = new IngressRoute({
      metadata: {
        name: "test"
      },
      spec: {
        entryPoints: ["web"],
        routes: [
          {
            match: "Host(`example.com`)",
            kind: "Rule",
            services: [
              {
                name: "test",
                port: 80
              }
            ]
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(ingressRoute).toHaveProperty(
      "apiVersion",
      "traefik.containo.us/v1alpha1"
    );
  });

  it("should set kind", () => {
    expect(ingressRoute).toHaveProperty("kind", "IngressRoute");
  });

  it("validate", () => {
    expect(() => ingressRoute.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(ingressRoute.toJSON()).toEqual({
      apiVersion: "traefik.containo.us/v1alpha1",
      kind: "IngressRoute",
      metadata: {
        name: "test"
      },
      spec: {
        entryPoints: ["web"],
        routes: [
          {
            match: "Host(`example.com`)",
            kind: "Rule",
            services: [
              {
                name: "test",
                port: 80
              }
            ]
          }
        ]
      }
    });
  });
});
