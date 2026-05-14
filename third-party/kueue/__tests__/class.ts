import { describe, it, expect } from "vitest";
import { ClusterQueue } from "../gen/kueue.x-k8s.io/v1beta2/ClusterQueue.js";
import { LocalQueue } from "../gen/kueue.x-k8s.io/v1beta2/LocalQueue.js";
import { ResourceFlavor } from "../gen/kueue.x-k8s.io/v1beta2/ResourceFlavor.js";
import { Workload } from "../gen/kueue.x-k8s.io/v1beta2/Workload.js";
import { WorkloadPriorityClass } from "../gen/kueue.x-k8s.io/v1beta2/WorkloadPriorityClass.js";
import { AdmissionCheck } from "../gen/kueue.x-k8s.io/v1beta2/AdmissionCheck.js";
import { Topology } from "../gen/kueue.x-k8s.io/v1beta2/Topology.js";
import { ClusterQueue as ClusterQueueV1beta1 } from "../gen/kueue.x-k8s.io/v1beta1/ClusterQueue.js";

describe("ClusterQueue", () => {
  const queue = new ClusterQueue({
    metadata: {
      name: "cluster-queue",
    },
    spec: {
      namespaceSelector: {},
      resourceGroups: [
        {
          coveredResources: ["cpu", "memory"],
          flavors: [
            {
              name: "default-flavor",
              resources: [
                { name: "cpu", nominalQuota: "9" },
                { name: "memory", nominalQuota: "36Gi" },
              ],
            },
          ],
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(queue).toHaveProperty("apiVersion", "kueue.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(queue).toHaveProperty("kind", "ClusterQueue");
  });

  it("validate", () => {
    expect(() => queue.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(queue.toJSON()).toEqual({
      apiVersion: "kueue.x-k8s.io/v1beta2",
      kind: "ClusterQueue",
      metadata: {
        name: "cluster-queue",
      },
      spec: {
        namespaceSelector: {},
        resourceGroups: [
          {
            coveredResources: ["cpu", "memory"],
            flavors: [
              {
                name: "default-flavor",
                resources: [
                  { name: "cpu", nominalQuota: "9" },
                  { name: "memory", nominalQuota: "36Gi" },
                ],
              },
            ],
          },
        ],
      },
    });
  });
});

describe("LocalQueue", () => {
  const lq = new LocalQueue({
    metadata: {
      name: "user-queue",
      namespace: "default",
    },
    spec: {
      clusterQueue: "cluster-queue",
    },
  });

  it("should set apiVersion", () => {
    expect(lq).toHaveProperty("apiVersion", "kueue.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(lq).toHaveProperty("kind", "LocalQueue");
  });

  it("validate", () => {
    expect(() => lq.validate()).not.toThrow();
  });
});

describe("ResourceFlavor", () => {
  const rf = new ResourceFlavor({
    metadata: {
      name: "default-flavor",
    },
    spec: {
      nodeLabels: {
        "instance-type": "on-demand",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(rf).toHaveProperty("apiVersion", "kueue.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(rf).toHaveProperty("kind", "ResourceFlavor");
  });

  it("validate", () => {
    expect(() => rf.validate()).not.toThrow();
  });
});

describe("Workload", () => {
  const workload = new Workload({
    metadata: {
      name: "example-workload",
      namespace: "default",
    },
    spec: {
      queueName: "user-queue",
      podSets: [
        {
          name: "main",
          count: 1,
          template: {
            spec: {
              containers: [
                {
                  name: "main",
                  image: "busybox",
                  resources: {
                    requests: {
                      cpu: "1",
                      memory: "200Mi",
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(workload).toHaveProperty("apiVersion", "kueue.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(workload).toHaveProperty("kind", "Workload");
  });

  it("validate", () => {
    expect(() => workload.validate()).not.toThrow();
  });
});

describe("WorkloadPriorityClass", () => {
  const wpc = new WorkloadPriorityClass({
    metadata: {
      name: "high-priority",
    },
    value: 1000,
    description: "High priority workloads",
  });

  it("should set apiVersion", () => {
    expect(wpc).toHaveProperty("apiVersion", "kueue.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(wpc).toHaveProperty("kind", "WorkloadPriorityClass");
  });

  it("validate", () => {
    expect(() => wpc.validate()).not.toThrow();
  });
});

describe("AdmissionCheck", () => {
  const ac = new AdmissionCheck({
    metadata: {
      name: "prov-req",
    },
    spec: {
      controllerName: "kueue.x-k8s.io/provisioning-request",
    },
  });

  it("should set apiVersion", () => {
    expect(ac).toHaveProperty("apiVersion", "kueue.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(ac).toHaveProperty("kind", "AdmissionCheck");
  });

  it("validate", () => {
    expect(() => ac.validate()).not.toThrow();
  });
});

describe("Topology", () => {
  const topology = new Topology({
    metadata: {
      name: "default",
    },
    spec: {
      levels: [
        { nodeLabel: "cloud.provider.com/topology-block" },
        { nodeLabel: "cloud.provider.com/topology-rack" },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(topology).toHaveProperty("apiVersion", "kueue.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(topology).toHaveProperty("kind", "Topology");
  });

  it("validate", () => {
    expect(() => topology.validate()).not.toThrow();
  });
});

describe("ClusterQueue v1beta1", () => {
  const queue = new ClusterQueueV1beta1({
    metadata: {
      name: "cluster-queue",
    },
    spec: {
      namespaceSelector: {},
    },
  });

  it("should set apiVersion", () => {
    expect(queue).toHaveProperty("apiVersion", "kueue.x-k8s.io/v1beta1");
  });

  it("should set kind", () => {
    expect(queue).toHaveProperty("kind", "ClusterQueue");
  });

  it("validate", () => {
    expect(() => queue.validate()).not.toThrow();
  });
});
