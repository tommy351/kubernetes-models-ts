import { describe, it, expect, beforeEach } from "vitest";
import { Stream } from "../gen/jetstream.nats.io/v1beta2/Stream";
import { Consumer } from "../gen/jetstream.nats.io/v1beta2/Consumer";

describe("Stream", () => {
  let stream: Stream;

  beforeEach(() => {
    stream = new Stream({
      metadata: { name: "mystream" },
      spec: {
        name: "mystream",
        subjects: ["orders.*"],
        storage: "memory",
        maxAge: "1h"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(stream).toHaveProperty("apiVersion", "jetstream.nats.io/v1beta2");
  });

  it("should set kind", () => {
    expect(stream).toHaveProperty("kind", "Stream");
  });

  it("validate", () => {
    expect(() => stream.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(stream.toJSON()).toEqual({
      apiVersion: "jetstream.nats.io/v1beta2",
      kind: "Stream",
      metadata: { name: "mystream" },
      spec: {
        name: "mystream",
        subjects: ["orders.*"],
        storage: "memory",
        maxAge: "1h"
      }
    });
  });
});

describe("Consumer", () => {
  let consumer: Consumer;

  describe("example1", () => {
    beforeEach(() => {
      consumer = new Consumer({
        metadata: { name: "my-push-consumer" },
        spec: {
          streamName: "mystream",
          durableName: "my-push-consumer",
          deliverSubject: "my-push-consumer.orders",
          deliverPolicy: "last",
          ackPolicy: "none",
          replayPolicy: "instant"
        }
      });
    });

    it("should set apiVersion", () => {
      expect(consumer).toHaveProperty(
        "apiVersion",
        "jetstream.nats.io/v1beta2"
      );
    });

    it("should set kind", () => {
      expect(consumer).toHaveProperty("kind", "Consumer");
    });

    it("validate", () => {
      expect(() => consumer.validate()).not.toThrow();
    });

    it("toJSON", () => {
      expect(consumer.toJSON()).toEqual({
        apiVersion: "jetstream.nats.io/v1beta2",
        kind: "Consumer",
        metadata: { name: "my-push-consumer" },
        spec: {
          streamName: "mystream",
          durableName: "my-push-consumer",
          deliverSubject: "my-push-consumer.orders",
          deliverPolicy: "last",
          ackPolicy: "none",
          replayPolicy: "instant"
        }
      });
    });
  });

  describe("example2", () => {
    beforeEach(() => {
      consumer = new Consumer({
        metadata: { name: "my-pull-consumer" },
        spec: {
          streamName: "mystream",
          durableName: "my-pull-consumer",
          deliverPolicy: "all",
          filterSubject: "orders.received",
          maxDeliver: 20,
          ackPolicy: "explicit"
        }
      });
    });

    it("should set apiVersion", () => {
      expect(consumer).toHaveProperty(
        "apiVersion",
        "jetstream.nats.io/v1beta2"
      );
    });

    it("should set kind", () => {
      expect(consumer).toHaveProperty("kind", "Consumer");
    });

    it("validate", () => {
      expect(() => consumer.validate()).not.toThrow();
    });

    it("toJSON", () => {
      expect(consumer.toJSON()).toEqual({
        apiVersion: "jetstream.nats.io/v1beta2",
        kind: "Consumer",
        metadata: { name: "my-pull-consumer" },
        spec: {
          streamName: "mystream",
          durableName: "my-pull-consumer",
          deliverPolicy: "all",
          filterSubject: "orders.received",
          maxDeliver: 20,
          ackPolicy: "explicit"
        }
      });
    });
  });
});
