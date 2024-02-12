import { describe, it, expect, beforeEach } from "vitest";

import { ServiceProfile } from "../gen/linkerd.io/v1alpha2/ServiceProfile";
import { Link } from "../gen/multicluster.linkerd.io/v1alpha1/Link";
import { HTTPRoute } from "../gen/policy.linkerd.io/v1beta3/HTTPRoute";

describe("ServiceProfile", () => {
  let profile: ServiceProfile;

  beforeEach(() => {
    profile = new ServiceProfile({
      metadata: {
        name: "test"
      },
      spec: {
        routes: [
          {
            name: "test",
            condition: {
              method: "GET"
            }
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(profile).toHaveProperty("apiVersion", "linkerd.io/v1alpha2");
  });

  it("should set kind", () => {
    expect(profile).toHaveProperty("kind", "ServiceProfile");
  });

  it("should set metadata", () => {
    expect(profile.metadata).toEqual({ name: "test" });
  });

  it("should set spec", () => {
    expect(profile.spec).toEqual({
      routes: [
        {
          name: "test",
          condition: {
            method: "GET"
          }
        }
      ]
    });
  });

  it("toJSON", () => {
    expect(profile.toJSON()).toEqual({
      apiVersion: "linkerd.io/v1alpha2",
      kind: "ServiceProfile",
      metadata: {
        name: "test"
      },
      spec: {
        routes: [
          {
            name: "test",
            condition: {
              method: "GET"
            }
          }
        ]
      }
    });
  });
});

describe("Link", () => {
  let link: Link;

  beforeEach(() => {
    link = new Link({
      metadata: {
        name: "test"
      },
      spec: {
        targetClusterName: "test"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(link).toHaveProperty(
      "apiVersion",
      "multicluster.linkerd.io/v1alpha1"
    );
  });

  it("should set kind", () => {
    expect(link).toHaveProperty("kind", "Link");
  });

  it("should set metadata", () => {
    expect(link.metadata).toEqual({ name: "test" });
  });

  it("should set spec", () => {
    expect(link.spec).toEqual({
      targetClusterName: "test"
    });
  });

  it("toJSON", () => {
    expect(link.toJSON()).toEqual({
      apiVersion: "multicluster.linkerd.io/v1alpha1",
      kind: "Link",
      metadata: {
        name: "test"
      },
      spec: {
        targetClusterName: "test"
      }
    });
  });
});

describe("HTTPRoute", () => {
  let route: HTTPRoute;

  beforeEach(() => {
    route = new HTTPRoute({
      metadata: {
        name: "test"
      },
      spec: {
        rules: [
          {
            matches: [{ method: "GET" }]
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(route).toHaveProperty("apiVersion", "policy.linkerd.io/v1beta3");
  });

  it("should set kind", () => {
    expect(route).toHaveProperty("kind", "HTTPRoute");
  });

  it("should set metadata", () => {
    expect(route.metadata).toEqual({ name: "test" });
  });

  it("should set spec", () => {
    expect(route.spec).toEqual({
      rules: [
        {
          matches: [{ method: "GET" }]
        }
      ]
    });
  });

  it("toJSON", () => {
    expect(route.toJSON()).toEqual({
      apiVersion: "policy.linkerd.io/v1beta3",
      kind: "HTTPRoute",
      metadata: {
        name: "test"
      },
      spec: {
        rules: [
          {
            matches: [{ method: "GET" }]
          }
        ]
      }
    });
  });
});
