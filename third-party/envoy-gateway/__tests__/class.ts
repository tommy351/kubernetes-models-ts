import { describe, it, expect, beforeEach } from "vitest";
import { Gateway } from "../gen/gateway.networking.k8s.io/v1/Gateway";
import { GatewayClass } from "../gen/gateway.networking.k8s.io/v1/GatewayClass";
import { HTTPRoute } from "../gen/gateway.networking.k8s.io/v1/HTTPRoute";

describe("GatewayClass", () => {
  let gatewayClass: GatewayClass;

  beforeEach(() => {
    gatewayClass = new GatewayClass({
      metadata: {
        name: "eg"
      },
      spec: {
        controllerName: "gateway.envoyproxy.io/gatewayclass-controller"
      }
    });

    it("should set apiVersion", () => {
      expect(gatewayClass).toHaveProperty("apiVersion", "gateway.networking.k8s.io/v1");
    });

    it("should set kind", () => {
      expect(gatewayClass).toHaveProperty("kind", "GatewayClass");
    });

    it("validate", () => {
      expect(() => gatewayClass.validate()).not.toThrow();
    });

    it("toJSON", () => {
      expect(gatewayClass.toJSON()).toEqual({
        apiVersion: "gateway.networking.k8s.io/v1",
        kind: "GatewayClass",
        metadata: {
          name: "eg"
        },
        spec: {
          controllerName: "gateway.envoyproxy.io/gatewayclass-controller"
        }
      });
    });
  });

  describe("Gateway", () => {
    let gateway: Gateway;

    beforeEach(() => {
      gateway = new Gateway({
        metadata: {
          name: "eg"
        },
        spec: {
          gatewayClassName: "eg",
          listeners: [
            {
              name: "http",
              protocol: "HTTP",
              port: 80
            }
          ]
        }
      });
    });

    it("should set apiVersion", () => {
      expect(gateway).toHaveProperty("apiVersion", "gateway.networking.k8s.io/v1");
    });

    it("should set kind", () => {
      expect(gateway).toHaveProperty("kind", "Gateway");
    });

    it("validate", () => {
      expect(() => gateway.validate()).not.toThrow();
    });

    it("toJSON", () => {
      expect(gateway.toJSON()).toEqual({
        apiVersion: "gateway.networking.k8s.io/v1",
        kind: "Gateway",
        metadata: {
          name: "eg"
        },
        spec: {
          gatewayClassName: "eg",
          listeners: [
            {
              name: "http",
              protocol: "HTTP",
              port: 80
            }
          ]
        }
      });
    });
  });

  describe("HTTPRoute", () => {
    let httpRoute: HTTPRoute;

    beforeEach(() => {
      httpRoute = new HTTPRoute({
        metadata: {
          name: "backend"
        },
        spec: {
          parentRefs: [
            {
              name: "eg"
            }
          ],
          hostnames: [
            "www.example.com"
          ],
          rules: [
            {
              backendRefs: [
                {
                  group: "",
                  kind: "Service",
                  name: "backend",
                  port: 3000,
                  weight: 1
                }
              ],
              matches: [
                {
                  path: {
                    type: "PathPrefix",
                    value: "/"
                  }
                }
              ]
            }
          ]
        }
      });
    });

    it("should set apiVersion", () => {
      expect(httpRoute).toHaveProperty("apiVersion", "gateway.networking.k8s.io/v1");
    });

    it("should set kind", () => {
      expect(httpRoute).toHaveProperty("kind", "HTTPRoute");
    });

    it("validate", () => {
      expect(() => httpRoute.validate()).not.toThrow();
    });

    it("toJSON", () => {
      expect(httpRoute.toJSON()).toEqual({
        apiVersion: "gateway.networking.k8s.io/v1",
        kind: "HTTPRoute",
        metadata: {
          name: "backend"
        },
        spec: {
          parentRefs: [
            {
              name: "eg"
            }
          ],
          hostnames: [
            "www.example.com"
          ],
          rules: [
            {
              backendRefs: [
                {
                  group: "",
                  kind: "Service",
                  name: "backend",
                  port: 3000,
                  weight: 1
                }
              ],
              matches: [
                {
                  path: {
                    type: "PathPrefix",
                    value: "/"
                  }
                }
              ]
            }
          ]
        }
      });
    });
  });
});
