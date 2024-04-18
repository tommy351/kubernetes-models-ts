import { describe, it, expect, beforeEach } from "vitest";
import { EC2NodeClass } from "../gen/karpenter.k8s.aws/v1beta1";
import { NodeClaim } from "../gen/karpenter.sh/v1beta1";
import { NodePool } from "../gen/karpenter.sh/v1beta1";

describe("EC2NodeClass", () => {
  let nodeClass: EC2NodeClass;

  beforeEach(() => {
    nodeClass = new EC2NodeClass({
      metadata: { name: "test" },
      spec: {
        amiFamily: "AL2",
        subnetSelectorTerms: [{ tags: { "aws-cdk:subnet-name": "private" } }],
        securityGroupSelectorTerms: [{ name: "test" }]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(nodeClass).toHaveProperty("apiVersion", "karpenter.k8s.aws/v1beta1");
  });

  it("should set kind", () => {
    expect(nodeClass).toHaveProperty("kind", "EC2NodeClass");
  });

  it("should set metadata", () => {
    expect(nodeClass.metadata).toEqual({ name: "test" });
  });

  it("should set sepc", () => {
    expect(nodeClass).toHaveProperty("spec");
  });

  it("toJSON", () => {
    expect(nodeClass.toJSON()).toEqual({
      apiVersion: "karpenter.k8s.aws/v1beta1",
      kind: "EC2NodeClass",
      metadata: { name: "test" },
      spec: {
        amiFamily: "AL2",
        subnetSelectorTerms: [{ tags: { "aws-cdk:subnet-name": "private" } }],
        securityGroupSelectorTerms: [{ name: "test" }]
      }
    });
  });
});

describe("NodeClaim", () => {
  let nodeClaim: NodeClaim;

  beforeEach(() => {
    nodeClaim = new NodeClaim({
      metadata: { name: "test" },
      spec: {
        nodeClassRef: {
          name: "test"
        },
        requirements: [
          {
            key: "karpenter.sh/instance-type",
            operator: "In",
            values: ["m5.large"]
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(nodeClaim).toHaveProperty("apiVersion", "karpenter.sh/v1beta1");
  });

  it("should set kind", () => {
    expect(nodeClaim).toHaveProperty("kind", "NodeClaim");
  });

  it("should set metadata", () => {
    expect(nodeClaim.metadata).toEqual({ name: "test" });
  });

  it("should set sepc", () => {
    expect(nodeClaim).toHaveProperty("spec");
  });

  it("toJSON", () => {
    expect(nodeClaim.toJSON()).toEqual({
      apiVersion: "karpenter.sh/v1beta1",
      kind: "NodeClaim",
      metadata: { name: "test" },
      spec: {
        nodeClassRef: {
          name: "test"
        },
        requirements: [
          {
            key: "karpenter.sh/instance-type",
            operator: "In",
            values: ["m5.large"]
          }
        ]
      }
    });
  });
});

describe("NodePool", () => {
  let nodePool: NodePool;

  beforeEach(() => {
    nodePool = new NodePool({
      metadata: { name: "test" },
      spec: {
        template: {
          spec: {
            nodeClassRef: { name: "test" },
            requirements: [
              {
                key: "karpenter.sh/instance-type",
                operator: "In",
                values: ["m5.large"]
              }
            ]
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(nodePool).toHaveProperty("apiVersion", "karpenter.sh/v1beta1");
  });

  it("should set kind", () => {
    expect(nodePool).toHaveProperty("kind", "NodePool");
  });

  it("should set metadata", () => {
    expect(nodePool.metadata).toEqual({ name: "test" });
  });

  it("should set sepc", () => {
    expect(nodePool).toHaveProperty("spec");
  });

  it("toJSON", () => {
    expect(nodePool.toJSON()).toEqual({
      apiVersion: "karpenter.sh/v1beta1",
      kind: "NodePool",
      metadata: { name: "test" },
      spec: {
        template: {
          spec: {
            nodeClassRef: { name: "test" },
            requirements: [
              {
                key: "karpenter.sh/instance-type",
                operator: "In",
                values: ["m5.large"]
              }
            ]
          }
        }
      }
    });
  });
});
