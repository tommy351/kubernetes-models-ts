import { describe, it, expect } from "vitest";
import { CloneSet } from "../gen/apps.kruise.io/v1alpha1/CloneSet.js";
import { SidecarSet } from "../gen/apps.kruise.io/v1alpha1/SidecarSet.js";
import { BroadcastJob } from "../gen/apps.kruise.io/v1alpha1/BroadcastJob.js";
import { StatefulSet } from "../gen/apps.kruise.io/v1beta1/StatefulSet.js";
import { PodUnavailableBudget } from "../gen/policy.kruise.io/v1alpha1/PodUnavailableBudget.js";

describe("CloneSet", () => {
  const cloneSet = new CloneSet({
    metadata: {
      name: "sample",
      namespace: "default",
    },
    spec: {
      replicas: 5,
      selector: {
        matchLabels: { app: "sample" },
      },
      template: {
        metadata: {
          labels: { app: "sample" },
        },
        spec: {
          containers: [
            {
              name: "main",
              image: "nginx:alpine",
            },
          ],
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(cloneSet).toHaveProperty("apiVersion", "apps.kruise.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(cloneSet).toHaveProperty("kind", "CloneSet");
  });

  it("validate", () => {
    expect(() => cloneSet.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cloneSet.toJSON()).toEqual({
      apiVersion: "apps.kruise.io/v1alpha1",
      kind: "CloneSet",
      metadata: {
        name: "sample",
        namespace: "default",
      },
      spec: {
        replicas: 5,
        selector: {
          matchLabels: { app: "sample" },
        },
        template: {
          metadata: {
            labels: { app: "sample" },
          },
          spec: {
            containers: [
              {
                name: "main",
                image: "nginx:alpine",
              },
            ],
          },
        },
      },
    });
  });
});

describe("SidecarSet", () => {
  const sidecarSet = new SidecarSet({
    metadata: {
      name: "test-sidecarset",
    },
    spec: {
      selector: {
        matchLabels: { app: "sample" },
      },
      containers: [
        {
          podInjectPolicy: "BeforeAppContainer",
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(sidecarSet).toHaveProperty("apiVersion", "apps.kruise.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(sidecarSet).toHaveProperty("kind", "SidecarSet");
  });

  it("validate", () => {
    expect(() => sidecarSet.validate()).not.toThrow();
  });
});

describe("BroadcastJob", () => {
  const job = new BroadcastJob({
    metadata: {
      name: "test-broadcastjob",
      namespace: "default",
    },
    spec: {
      template: {
        spec: {
          restartPolicy: "Never",
          containers: [
            {
              name: "main",
              image: "busybox:1.36",
              command: ["echo", "hello"],
            },
          ],
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(job).toHaveProperty("apiVersion", "apps.kruise.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(job).toHaveProperty("kind", "BroadcastJob");
  });

  it("validate", () => {
    expect(() => job.validate()).not.toThrow();
  });
});

describe("StatefulSet v1beta1", () => {
  const sts = new StatefulSet({
    metadata: {
      name: "test-sts",
      namespace: "default",
    },
    spec: {
      replicas: 3,
      serviceName: "test-sts",
      selector: {
        matchLabels: { app: "sample" },
      },
      template: {
        metadata: {
          labels: { app: "sample" },
        },
        spec: {
          containers: [
            {
              name: "main",
              image: "nginx:alpine",
            },
          ],
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(sts).toHaveProperty("apiVersion", "apps.kruise.io/v1beta1");
  });

  it("should set kind", () => {
    expect(sts).toHaveProperty("kind", "StatefulSet");
  });

  it("validate", () => {
    expect(() => sts.validate()).not.toThrow();
  });
});

describe("PodUnavailableBudget", () => {
  const pub = new PodUnavailableBudget({
    metadata: {
      name: "test-pub",
      namespace: "default",
    },
    spec: {
      selector: {
        matchLabels: { app: "sample" },
      },
      maxUnavailable: "25%",
    },
  });

  it("should set apiVersion", () => {
    expect(pub).toHaveProperty("apiVersion", "policy.kruise.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(pub).toHaveProperty("kind", "PodUnavailableBudget");
  });

  it("validate", () => {
    expect(() => pub.validate()).not.toThrow();
  });
});
