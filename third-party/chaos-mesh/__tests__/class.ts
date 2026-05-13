import { describe, it, expect } from "vitest";
import { PodChaos } from "../gen/chaos-mesh.org/v1alpha1/PodChaos.js";
import { NetworkChaos } from "../gen/chaos-mesh.org/v1alpha1/NetworkChaos.js";
import { Schedule } from "../gen/chaos-mesh.org/v1alpha1/Schedule.js";
import { Workflow } from "../gen/chaos-mesh.org/v1alpha1/Workflow.js";

describe("PodChaos", () => {
  const chaos = new PodChaos({
    metadata: {
      name: "pod-failure-example",
      namespace: "default",
    },
    spec: {
      action: "pod-failure",
      mode: "one",
      duration: "30s",
      selector: {
        namespaces: ["default"],
        labelSelectors: {
          app: "web",
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(chaos).toHaveProperty("apiVersion", "chaos-mesh.org/v1alpha1");
  });

  it("should set kind", () => {
    expect(chaos).toHaveProperty("kind", "PodChaos");
  });

  it("validate", () => {
    expect(() => chaos.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(chaos.toJSON()).toEqual({
      apiVersion: "chaos-mesh.org/v1alpha1",
      kind: "PodChaos",
      metadata: {
        name: "pod-failure-example",
        namespace: "default",
      },
      spec: {
        action: "pod-failure",
        mode: "one",
        duration: "30s",
        selector: {
          namespaces: ["default"],
          labelSelectors: {
            app: "web",
          },
        },
      },
    });
  });
});

describe("NetworkChaos", () => {
  const chaos = new NetworkChaos({
    metadata: {
      name: "network-delay-example",
      namespace: "default",
    },
    spec: {
      action: "delay",
      mode: "all",
      duration: "5m",
      direction: "to",
      delay: {
        latency: "100ms",
        correlation: "25",
        jitter: "10ms",
      },
      selector: {
        namespaces: ["default"],
        labelSelectors: {
          app: "api",
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(chaos).toHaveProperty("apiVersion", "chaos-mesh.org/v1alpha1");
  });

  it("should set kind", () => {
    expect(chaos).toHaveProperty("kind", "NetworkChaos");
  });

  it("validate", () => {
    expect(() => chaos.validate()).not.toThrow();
  });
});

describe("Schedule", () => {
  const schedule = new Schedule({
    metadata: {
      name: "scheduled-pod-chaos",
      namespace: "default",
    },
    spec: {
      schedule: "*/5 * * * *",
      historyLimit: 2,
      concurrencyPolicy: "Forbid",
      type: "PodChaos",
      podChaos: {
        action: "pod-kill",
        mode: "one",
        selector: {
          namespaces: ["default"],
          labelSelectors: {
            app: "web",
          },
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(schedule).toHaveProperty("apiVersion", "chaos-mesh.org/v1alpha1");
  });

  it("should set kind", () => {
    expect(schedule).toHaveProperty("kind", "Schedule");
  });

  it("validate", () => {
    expect(() => schedule.validate()).not.toThrow();
  });
});

describe("Workflow", () => {
  const workflow = new Workflow({
    metadata: {
      name: "try-workflow",
      namespace: "default",
    },
    spec: {
      entry: "the-entry",
      templates: [
        {
          name: "the-entry",
          templateType: "Serial",
          deadline: "240s",
          children: ["network-chaos"],
        },
        {
          name: "network-chaos",
          templateType: "NetworkChaos",
          deadline: "20s",
          networkChaos: {
            action: "delay",
            mode: "one",
            selector: {
              namespaces: ["default"],
              labelSelectors: {
                app: "web",
              },
            },
            delay: {
              latency: "90ms",
              correlation: "25",
              jitter: "90ms",
            },
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(workflow).toHaveProperty("apiVersion", "chaos-mesh.org/v1alpha1");
  });

  it("should set kind", () => {
    expect(workflow).toHaveProperty("kind", "Workflow");
  });

  it("validate", () => {
    expect(() => workflow.validate()).not.toThrow();
  });
});
