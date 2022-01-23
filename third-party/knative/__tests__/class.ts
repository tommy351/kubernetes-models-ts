import { Service } from "../gen/serving.knative.dev/v1/Service";
import { Trigger } from "../gen/eventing.knative.dev/v1/Trigger";

describe("Service", () => {
  let service: Service;

  beforeEach(() => {
    service = new Service({
      metadata: { name: "hello" },
      spec: {
        template: {
          metadata: { name: "hello-world" },
          spec: {
            containers: [
              {
                image: "gcr.io/knative-samples/helloworld-go",
                ports: [{ containerPort: 8080 }]
              }
            ]
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(service).toHaveProperty("apiVersion", "serving.knative.dev/v1");
  });

  it("should set kind", () => {
    expect(service).toHaveProperty("kind", "Service");
  });

  it("validate", () => {
    expect(() => service.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(service.toJSON()).toEqual({
      apiVersion: "serving.knative.dev/v1",
      kind: "Service",
      metadata: { name: "hello" },
      spec: {
        template: {
          metadata: { name: "hello-world" },
          spec: {
            containers: [
              {
                image: "gcr.io/knative-samples/helloworld-go",
                ports: [{ containerPort: 8080 }]
              }
            ]
          }
        }
      }
    });
  });
});

describe("Trigger", () => {
  let trigger: Trigger;

  beforeEach(() => {
    trigger = new Trigger({
      metadata: {
        name: "cloudevents-trigger",
        annotations: {
          "knative-eventing-injection": "enabled"
        }
      },
      spec: {
        broker: "example-broker",
        subscriber: {
          ref: {
            apiVersion: "serving.knative.dev/v1",
            kind: "Service",
            name: "cloudevents-player"
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(trigger).toHaveProperty("apiVersion", "eventing.knative.dev/v1");
  });

  it("should set kind", () => {
    expect(trigger).toHaveProperty("kind", "Trigger");
  });

  it("validate", () => {
    expect(() => trigger.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(trigger.toJSON()).toEqual({
      apiVersion: "eventing.knative.dev/v1",
      kind: "Trigger",
      metadata: {
        name: "cloudevents-trigger",
        annotations: {
          "knative-eventing-injection": "enabled"
        }
      },
      spec: {
        broker: "example-broker",
        subscriber: {
          ref: {
            apiVersion: "serving.knative.dev/v1",
            kind: "Service",
            name: "cloudevents-player"
          }
        }
      }
    });
  });
});
