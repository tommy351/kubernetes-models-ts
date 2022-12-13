import { Redis } from "../gen/redis.redis.opstreelabs.in/v1beta1/Redis";
import { RedisCluster } from "../gen/redis.redis.opstreelabs.in/v1beta1/RedisCluster";

describe("Redis", () => {
  let redis: Redis;

  beforeEach(() => {
    redis = new Redis({
      metadata: { name: "example" },
      spec: {
        kubernetesConfig: {
          image: "quay.io/opstree/redis:v7.0.5"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(redis).toHaveProperty(
      "apiVersion",
      "redis.redis.opstreelabs.in/v1beta1"
    );
  });

  it("should set kind", () => {
    expect(redis).toHaveProperty("kind", "Redis");
  });

  it("validate", () => {
    expect(() => redis.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(redis.toJSON()).toEqual({
      apiVersion: "redis.redis.opstreelabs.in/v1beta1",
      kind: "Redis",
      metadata: { name: "example" },
      spec: {
        kubernetesConfig: {
          image: "quay.io/opstree/redis:v7.0.5"
        }
      }
    });
  });
});

describe("RedisCluster", () => {
  let cluster: RedisCluster;

  beforeEach(() => {
    cluster = new RedisCluster({
      metadata: { name: "example" },
      spec: {
        clusterSize: 3,
        clusterVersion: "v7",
        persistenceEnabled: true,
        kubernetesConfig: {
          image: "quay.io/opstree/redis:v7.0.5"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty(
      "apiVersion",
      "redis.redis.opstreelabs.in/v1beta1"
    );
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "RedisCluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "redis.redis.opstreelabs.in/v1beta1",
      kind: "RedisCluster",
      metadata: { name: "example" },
      spec: {
        clusterSize: 3,
        clusterVersion: "v7",
        persistenceEnabled: true,
        kubernetesConfig: {
          image: "quay.io/opstree/redis:v7.0.5"
        }
      }
    });
  });
});
