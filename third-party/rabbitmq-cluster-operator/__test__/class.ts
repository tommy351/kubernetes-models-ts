import { RabbitmqCluster } from "../gen/rabbitmq.com/v1beta1/RabbitmqCluster";

describe("RabbitmqCluster", () => {
  let cluster: RabbitmqCluster;

  beforeEach(() => {
    cluster = new RabbitmqCluster({
      metadata: {
        name: "example",
      },
      spec: {
        replicas: 2,
        service: {
          type: "ClusterIP",
        },
        persistence: {
          storageClassName: "standard",
          storage: "10Gi",
        },
        rabbitmq: {
          additionalPlugins: ["rabbitmq_peer_discovery_k8s"],
        }
      },
    });
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty(
      "apiVersion",
      "rabbitmq.com/v1beta1"
    );
  })

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "RabbitmqCluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "rabbitmq.com/v1beta1",
      kind: "RabbitmqCluster",
      metadata: {
        name: "example",
      },
      spec: {
        replicas: 2,
        service: {
          type: "ClusterIP",
        },
        persistence: {
          storageClassName: "standard",
          storage: "10Gi",
        },
        rabbitmq: {
          additionalPlugins: ["rabbitmq_peer_discovery_k8s"],
        }
      },
    });
  });
});
