import { describe, it, expect, beforeEach } from "vitest";
import { Kafka } from "../gen/kafka.strimzi.io/v1beta2/Kafka";

describe("Kafka", () => {
  let kafka: Kafka;

  beforeEach(() => {
    kafka = new Kafka({
      metadata: {
        name: "my-cluster",
        annotations: {
          "strimzi.io/node-pools": "enabled",
          "strimzi.io/kraft": "enabled"
        }
      },
      spec: {
        kafka: {
          version: "4.0.0",
          metadataVersion: "4.0-IV3",
          listeners: [
            { name: "plain", port: 9092, type: "internal", tls: false },
            { name: "tls", port: 9093, type: "internal", tls: true }
          ],
          config: {
            "offsets.topic.replication.factor": 1,
            "transaction.state.log.replication.factor": 1,
            "transaction.state.log.min.isr": 1,
            "default.replication.factor": 1,
            "min.insync.replicas": 1
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(kafka).toHaveProperty("apiVersion", "kafka.strimzi.io/v1beta2");
  });

  it("should set kind", () => {
    expect(kafka).toHaveProperty("kind", "Kafka");
  });

  it("validate", () => {
    expect(() => kafka.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(kafka.toJSON()).toEqual({
      apiVersion: "kafka.strimzi.io/v1beta2",
      kind: "Kafka",
      metadata: {
        name: "my-cluster",
        annotations: {
          "strimzi.io/node-pools": "enabled",
          "strimzi.io/kraft": "enabled"
        }
      },
      spec: {
        kafka: {
          version: "4.0.0",
          metadataVersion: "4.0-IV3",
          listeners: [
            { name: "plain", port: 9092, type: "internal", tls: false },
            { name: "tls", port: 9093, type: "internal", tls: true }
          ],
          config: {
            "offsets.topic.replication.factor": 1,
            "transaction.state.log.replication.factor": 1,
            "transaction.state.log.min.isr": 1,
            "default.replication.factor": 1,
            "min.insync.replicas": 1
          }
        }
      }
    });
  });
});
