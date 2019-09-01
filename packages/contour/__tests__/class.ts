import { IngressRoute } from "../gen/contour.heptio.com/v1beta1/IngressRoute";

describe("IngressRoute", () => {
  let route: IngressRoute;

  beforeEach(() => {
    route = new IngressRoute({
      metadata: {
        name: "foo"
      },
      spec: {
        virtualhost: {
          fqdn: "foo.example.com"
        },
        routes: [
          {
            match: "/",
            services: [
              {
                name: "foo",
                port: 80
              }
            ]
          }
        ]
      }
    });
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
        name: "foo"
      },
      spec: {
        virtualhost: {
          fqdn: "foo.example.com"
        },
        routes: [
          {
            match: "/",
            services: [
              {
                name: "foo",
                port: 80
              }
            ]
          }
        ]
      }
    });
  });
});
