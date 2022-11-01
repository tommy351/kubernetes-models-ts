import { HTTPRoute } from "../gen/gateway.networking.k8s.io/v1beta1/HTTPRoute";

describe("HTTPRoute", () => {
  let route: HTTPRoute;

  beforeEach(() => {
    route = new HTTPRoute({
      metadata: {
        name: "http-route"
      },
      spec: {
        parentRefs: [
          {
            kind: "Gateway",
            name: "foo-gateway"
          }
        ],
        rules: [
          {
            backendRefs: [{ name: "foo-svc", port: 8080 }]
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(route).toHaveProperty(
      "apiVersion",
      "gateway.networking.k8s.io/v1beta1"
    );
  });

  it("should set kind", () => {
    expect(route).toHaveProperty("kind", "HTTPRoute");
  });

  it("validate", () => {
    expect(() => route.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(route.toJSON()).toEqual({
      apiVersion: "gateway.networking.k8s.io/v1beta1",
      kind: "HTTPRoute",
      metadata: {
        name: "http-route"
      },
      spec: {
        parentRefs: [
          {
            kind: "Gateway",
            name: "foo-gateway"
          }
        ],
        rules: [
          {
            backendRefs: [{ name: "foo-svc", port: 8080 }]
          }
        ]
      }
    });
  });
});
