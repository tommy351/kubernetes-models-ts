import { describe, it, expect } from "vitest";
import { PropagationPolicy } from "../gen/policy.karmada.io/v1alpha1/PropagationPolicy.js";
import { ClusterPropagationPolicy } from "../gen/policy.karmada.io/v1alpha1/ClusterPropagationPolicy.js";
import { OverridePolicy } from "../gen/policy.karmada.io/v1alpha1/OverridePolicy.js";
import { Cluster } from "../gen/cluster.karmada.io/v1alpha1/Cluster.js";
import { ResourceBinding } from "../gen/work.karmada.io/v1alpha2/ResourceBinding.js";
import { FederatedHPA } from "../gen/autoscaling.karmada.io/v1alpha1/FederatedHPA.js";
import { MultiClusterService } from "../gen/networking.karmada.io/v1alpha1/MultiClusterService.js";
import { ResourceRegistry } from "../gen/search.karmada.io/v1alpha1/ResourceRegistry.js";

describe("PropagationPolicy", () => {
  const policy = new PropagationPolicy({
    metadata: {
      name: "example-policy",
      namespace: "default",
    },
    spec: {
      resourceSelectors: [
        {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "nginx",
        },
      ],
      placement: {
        clusterAffinity: {
          clusterNames: ["member1", "member2"],
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "policy.karmada.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "PropagationPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "policy.karmada.io/v1alpha1",
      kind: "PropagationPolicy",
      metadata: {
        name: "example-policy",
        namespace: "default",
      },
      spec: {
        resourceSelectors: [
          {
            apiVersion: "apps/v1",
            kind: "Deployment",
            name: "nginx",
          },
        ],
        placement: {
          clusterAffinity: {
            clusterNames: ["member1", "member2"],
          },
        },
      },
    });
  });
});

describe("ClusterPropagationPolicy", () => {
  const policy = new ClusterPropagationPolicy({
    metadata: {
      name: "cluster-wide-policy",
    },
    spec: {
      resourceSelectors: [
        {
          apiVersion: "v1",
          kind: "Namespace",
          name: "team-a",
        },
      ],
      placement: {
        clusterAffinity: {
          clusterNames: ["member1"],
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "policy.karmada.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "ClusterPropagationPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });
});

describe("OverridePolicy", () => {
  const policy = new OverridePolicy({
    metadata: {
      name: "example-override",
      namespace: "default",
    },
    spec: {
      resourceSelectors: [
        {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "nginx",
        },
      ],
      overrideRules: [
        {
          targetCluster: {
            clusterNames: ["member1"],
          },
          overriders: {
            imageOverrider: [
              {
                component: "Registry",
                operator: "replace",
                value: "registry.example.com",
              },
            ],
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "policy.karmada.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "OverridePolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });
});

describe("Cluster", () => {
  const cluster = new Cluster({
    metadata: {
      name: "member1",
    },
    spec: {
      syncMode: "Push",
      apiEndpoint: "https://member1.example.com:6443",
      secretRef: {
        namespace: "karmada-cluster",
        name: "member1",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "cluster.karmada.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "Cluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });
});

describe("ResourceBinding", () => {
  const rb = new ResourceBinding({
    metadata: {
      name: "nginx-deployment",
      namespace: "default",
    },
    spec: {
      resource: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        name: "nginx",
        namespace: "default",
      },
      clusters: [
        { name: "member1", replicas: 2 },
        { name: "member2", replicas: 1 },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(rb).toHaveProperty("apiVersion", "work.karmada.io/v1alpha2");
  });

  it("should set kind", () => {
    expect(rb).toHaveProperty("kind", "ResourceBinding");
  });

  it("validate", () => {
    expect(() => rb.validate()).not.toThrow();
  });
});

describe("FederatedHPA", () => {
  const fhpa = new FederatedHPA({
    metadata: {
      name: "nginx-fhpa",
      namespace: "default",
    },
    spec: {
      scaleTargetRef: {
        apiVersion: "apps/v1",
        kind: "Deployment",
        name: "nginx",
      },
      minReplicas: 1,
      maxReplicas: 10,
      metrics: [
        {
          type: "Resource",
          resource: {
            name: "cpu",
            target: {
              type: "Utilization",
              averageUtilization: 80,
            },
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(fhpa).toHaveProperty(
      "apiVersion",
      "autoscaling.karmada.io/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(fhpa).toHaveProperty("kind", "FederatedHPA");
  });

  it("validate", () => {
    expect(() => fhpa.validate()).not.toThrow();
  });
});

describe("MultiClusterService", () => {
  const mcs = new MultiClusterService({
    metadata: {
      name: "nginx-mcs",
      namespace: "default",
    },
    spec: {
      types: ["CrossCluster"],
      ports: [
        {
          port: 80,
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(mcs).toHaveProperty("apiVersion", "networking.karmada.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(mcs).toHaveProperty("kind", "MultiClusterService");
  });

  it("validate", () => {
    expect(() => mcs.validate()).not.toThrow();
  });
});

describe("ResourceRegistry", () => {
  const rr = new ResourceRegistry({
    metadata: {
      name: "example-registry",
    },
    spec: {
      targetCluster: {
        clusterNames: ["member1"],
      },
      resourceSelectors: [
        {
          apiVersion: "apps/v1",
          kind: "Deployment",
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(rr).toHaveProperty("apiVersion", "search.karmada.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(rr).toHaveProperty("kind", "ResourceRegistry");
  });

  it("validate", () => {
    expect(() => rr.validate()).not.toThrow();
  });
});
