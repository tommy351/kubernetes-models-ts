import { describe, it, expect } from "vitest";
import { Component } from "../gen/dapr.io/v1alpha1/Component.js";
import { Configuration } from "../gen/dapr.io/v1alpha1/Configuration.js";
import { HTTPEndpoint } from "../gen/dapr.io/v1alpha1/HTTPEndpoint.js";
import { Resiliency } from "../gen/dapr.io/v1alpha1/Resiliency.js";
import { Subscription as SubscriptionV1 } from "../gen/dapr.io/v1alpha1/Subscription.js";
import { Subscription as SubscriptionV2 } from "../gen/dapr.io/v2alpha1/Subscription.js";

describe("Component", () => {
  const component = new Component({
    metadata: {
      name: "statestore",
      namespace: "default",
    },
    spec: {
      type: "state.redis",
      version: "v1",
      metadata: [
        { name: "redisHost", value: "redis:6379" },
        { name: "redisPassword", value: "" },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(component).toHaveProperty("apiVersion", "dapr.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(component).toHaveProperty("kind", "Component");
  });

  it("validate", () => {
    expect(() => component.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(component.toJSON()).toEqual({
      apiVersion: "dapr.io/v1alpha1",
      kind: "Component",
      metadata: {
        name: "statestore",
        namespace: "default",
      },
      spec: {
        type: "state.redis",
        version: "v1",
        metadata: [
          { name: "redisHost", value: "redis:6379" },
          { name: "redisPassword", value: "" },
        ],
      },
    });
  });
});

describe("Configuration", () => {
  const config = new Configuration({
    metadata: {
      name: "tracing",
      namespace: "default",
    },
    spec: {
      tracing: {
        samplingRate: "1",
        zipkin: {
          endpointAddress:
            "http://zipkin.default.svc.cluster.local:9411/api/v2/spans",
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(config).toHaveProperty("apiVersion", "dapr.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(config).toHaveProperty("kind", "Configuration");
  });

  it("validate", () => {
    expect(() => config.validate()).not.toThrow();
  });
});

describe("HTTPEndpoint", () => {
  const endpoint = new HTTPEndpoint({
    metadata: {
      name: "external-api",
      namespace: "default",
    },
    spec: {
      baseUrl: "https://api.example.com",
      headers: [{ name: "Accept-Language", value: "en-US" }],
    },
  });

  it("should set apiVersion", () => {
    expect(endpoint).toHaveProperty("apiVersion", "dapr.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(endpoint).toHaveProperty("kind", "HTTPEndpoint");
  });

  it("validate", () => {
    expect(() => endpoint.validate()).not.toThrow();
  });
});

describe("Resiliency", () => {
  const resiliency = new Resiliency({
    metadata: {
      name: "myresiliency",
      namespace: "default",
    },
    spec: {
      policies: {
        timeouts: {
          general: "5s",
        },
        retries: {
          pubsubRetry: {
            policy: "constant",
            duration: "5s",
            maxRetries: 10,
          },
        },
      },
      targets: {
        apps: {
          appA: {
            timeout: "general",
            retry: "pubsubRetry",
          },
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(resiliency).toHaveProperty("apiVersion", "dapr.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(resiliency).toHaveProperty("kind", "Resiliency");
  });

  it("validate", () => {
    expect(() => resiliency.validate()).not.toThrow();
  });
});

describe("Subscription v1alpha1", () => {
  const subscription = new SubscriptionV1({
    metadata: {
      name: "order-sub",
      namespace: "default",
    },
    spec: {
      topic: "orders",
      pubsubname: "pubsub",
      route: "/orders",
    },
  });

  it("should set apiVersion", () => {
    expect(subscription).toHaveProperty("apiVersion", "dapr.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(subscription).toHaveProperty("kind", "Subscription");
  });

  it("validate", () => {
    expect(() => subscription.validate()).not.toThrow();
  });
});

describe("Subscription v2alpha1", () => {
  const subscription = new SubscriptionV2({
    metadata: {
      name: "order-sub",
      namespace: "default",
    },
    spec: {
      topic: "orders",
      pubsubname: "pubsub",
      routes: {
        rules: [
          {
            match: 'event.type == "order.created"',
            path: "/orders/created",
          },
        ],
        default: "/orders",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(subscription).toHaveProperty("apiVersion", "dapr.io/v2alpha1");
  });

  it("should set kind", () => {
    expect(subscription).toHaveProperty("kind", "Subscription");
  });

  it("validate", () => {
    expect(() => subscription.validate()).not.toThrow();
  });
});
