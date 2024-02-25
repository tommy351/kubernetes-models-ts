import { describe, it, expect, beforeEach } from "vitest";
import { Elasticsearch } from "../gen/elasticsearch.k8s.elastic.co/v1";

describe("Elasticsearch", () => {
  let elasticsearch: Elasticsearch;

  beforeEach(() => {
    elasticsearch = new Elasticsearch({
      metadata: { name: "hello" },
      spec: {
        version: "8.9.2",
        nodeSets: [
          {
            name: "hello-world"
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(elasticsearch).toHaveProperty(
      "apiVersion",
      "elasticsearch.k8s.elastic.co/v1"
    );
  });

  it("should set kind", () => {
    expect(elasticsearch).toHaveProperty("kind", "Elasticsearch");
  });

  it("validate", () => {
    expect(() => elasticsearch.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(elasticsearch.toJSON()).toEqual({
      apiVersion: "elasticsearch.k8s.elastic.co/v1",
      kind: "Elasticsearch",
      metadata: { name: "hello" },
      spec: {
        version: "8.9.2",
        nodeSets: [
          {
            name: "hello-world"
          }
        ]
      }
    });
  });
});
