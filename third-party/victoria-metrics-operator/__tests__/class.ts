import { VMCluster } from "../gen/operator.victoriametrics.com/v1beta1/VMCluster";

describe("VMCluster", () => {
  let cluster: VMCluster;

  beforeEach(() => {
    cluster = new VMCluster({
      metadata: { name: "example" },
      spec: {
        retentionPeriod: "12",
        vmstorage: {
          replicaCount: 2
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty(
      "apiVersion",
      "operator.victoriametrics.com/v1beta1"
    );
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "VMCluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "operator.victoriametrics.com/v1beta1",
      kind: "VMCluster",
      metadata: { name: "example" },
      spec: {
        retentionPeriod: "12",
        vmstorage: {
          replicaCount: 2
        }
      }
    });
  });
});
