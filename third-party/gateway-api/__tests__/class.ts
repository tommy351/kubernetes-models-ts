import { describe, it, expect } from "vitest";
import { HTTPRoute } from "../gen/gateway.networking.k8s.io/v1/HTTPRoute.js";
import { HTTPRoute as HTTPRouteV1Beta1 } from "../gen/gateway.networking.k8s.io/v1beta1/HTTPRoute.js";

describe("HTTPRoute", () => {
  const route = new HTTPRoute({
    metadata: {
      name: "http-route",
    },
    spec: {
      parentRefs: [
        {
          kind: "Gateway",
          name: "foo-gateway",
        },
      ],
      rules: [
        {
          backendRefs: [{ name: "foo-svc", port: 8080 }],
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(route).toHaveProperty("apiVersion", "gateway.networking.k8s.io/v1");
  });

  it("should set kind", () => {
    expect(route).toHaveProperty("kind", "HTTPRoute");
  });

  it("validate", () => {
    expect(() => route.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(route.toJSON()).toEqual({
      apiVersion: "gateway.networking.k8s.io/v1",
      kind: "HTTPRoute",
      metadata: {
        name: "http-route",
      },
      spec: {
        parentRefs: [
          {
            kind: "Gateway",
            name: "foo-gateway",
          },
        ],
        rules: [
          {
            backendRefs: [{ name: "foo-svc", port: 8080 }],
          },
        ],
      },
    });
  });
});

describe("HTTPRoute ucs2length validation", () => {
  function buildRoute(name: string): HTTPRoute {
    return new HTTPRoute({
      metadata: { name: "http-route" },
      spec: {
        parentRefs: [{ kind: "Gateway", name }],
        rules: [{ backendRefs: [{ name: "foo-svc", port: 8080 }] }],
      },
    });
  }

  it("passes when parentRefs[].name length is at the maxLength boundary", () => {
    expect(() => buildRoute("a".repeat(253)).validate()).not.toThrow();
  });

  it("throws when parentRefs[].name exceeds maxLength", () => {
    expect(() => buildRoute("a".repeat(254)).validate()).toThrow(
      "must NOT be longer than 253 characters",
    );
  });

  it("throws when parentRefs[].name is shorter than minLength", () => {
    expect(() => buildRoute("").validate()).toThrow(
      "must NOT be shorter than 1 character",
    );
  });

  it("counts surrogate pairs as a single code point", () => {
    // 127 emoji = String#length 254 (UTF-16 code units) but ucs2length 127.
    // Native .length would fail maxLength=253; ucs2length must accept it.
    const name = "🎉".repeat(127);
    expect(name.length).toBe(254);
    expect(() => buildRoute(name).validate()).not.toThrow();
  });

  it("rejects surrogate-pair strings that exceed maxLength in code points", () => {
    expect(() => buildRoute("🎉".repeat(254)).validate()).toThrow(
      "must NOT be longer than 253 characters",
    );
  });
});

describe("HTTPRoute v1beta1", () => {
  const route = new HTTPRouteV1Beta1({
    metadata: {
      name: "http-route",
    },
    spec: {
      parentRefs: [
        {
          kind: "Gateway",
          name: "foo-gateway",
        },
      ],
      rules: [
        {
          backendRefs: [{ name: "foo-svc", port: 8080 }],
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(route).toHaveProperty(
      "apiVersion",
      "gateway.networking.k8s.io/v1beta1",
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
        name: "http-route",
      },
      spec: {
        parentRefs: [
          {
            kind: "Gateway",
            name: "foo-gateway",
          },
        ],
        rules: [
          {
            backendRefs: [{ name: "foo-svc", port: 8080 }],
          },
        ],
      },
    });
  });
});
