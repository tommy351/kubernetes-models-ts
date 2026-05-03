import { describe, it, expect } from "vitest";
import { IngressRoute } from "../gen/contour.heptio.com/v1beta1/IngressRoute.js";
import { HTTPProxy } from "../gen/projectcontour.io/v1/HTTPProxy.js";

describe("IngressRoute", () => {
  const route = new IngressRoute({
    metadata: {
      name: "foo",
    },
    spec: {
      virtualhost: {
        fqdn: "foo.example.com",
      },
      routes: [
        {
          match: "/",
          services: [
            {
              name: "foo",
              port: 80,
            },
          ],
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(route).toHaveProperty("apiVersion", "contour.heptio.com/v1beta1");
  });

  it("should set kind", () => {
    expect(route).toHaveProperty("kind", "IngressRoute");
  });

  it("validate", () => {
    expect(() => route.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(route.toJSON()).toEqual({
      apiVersion: "contour.heptio.com/v1beta1",
      kind: "IngressRoute",
      metadata: {
        name: "foo",
      },
      spec: {
        virtualhost: {
          fqdn: "foo.example.com",
        },
        routes: [
          {
            match: "/",
            services: [
              {
                name: "foo",
                port: 80,
              },
            ],
          },
        ],
      },
    });
  });
});

describe("HTTPProxy", () => {
  const proxy = new HTTPProxy({
    metadata: {
      name: "foo",
    },
    spec: {
      virtualhost: {
        fqdn: "foo.example.com",
      },
      routes: [
        {
          conditions: [
            {
              prefix: "/",
            },
          ],
          services: [
            {
              name: "foo",
              port: 80,
            },
          ],
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(proxy).toHaveProperty("apiVersion", "projectcontour.io/v1");
  });

  it("should set kind", () => {
    expect(proxy).toHaveProperty("kind", "HTTPProxy");
  });

  it("validate", () => {
    expect(() => proxy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(proxy.toJSON()).toEqual({
      apiVersion: "projectcontour.io/v1",
      kind: "HTTPProxy",
      metadata: {
        name: "foo",
      },
      spec: {
        virtualhost: {
          fqdn: "foo.example.com",
        },
        routes: [
          {
            conditions: [
              {
                prefix: "/",
              },
            ],
            services: [
              {
                name: "foo",
                port: 80,
              },
            ],
          },
        ],
      },
    });
  });
});
