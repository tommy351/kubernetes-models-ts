import { describe, it, expect, beforeEach } from "vitest";
import {
  SubnamespaceAnchor,
  HierarchyConfiguration,
  HierarchicalResourceQuota
} from "../gen/hnc.x-k8s.io/v1alpha2";

describe("SubnamespaceAnchor", () => {
  let subns: SubnamespaceAnchor;

  beforeEach(() => {
    subns = new SubnamespaceAnchor({
      metadata: {
        name: "child-ns",
        namespace: "parent-ns"
      },
      spec: {}
    });
  });

  it("should set apiVersion", () => {
    expect(subns).toHaveProperty("apiVersion", "hnc.x-k8s.io/v1alpha2");
  });

  it("should set kind", () => {
    expect(subns).toHaveProperty("kind", "SubnamespaceAnchor");
  });

  it("validate", () => {
    expect(() => subns.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(subns.toJSON()).toEqual({
      apiVersion: "hnc.x-k8s.io/v1alpha2",
      kind: "SubnamespaceAnchor",
      metadata: {
        name: "child-ns",
        namespace: "parent-ns"
      },
      spec: {}
    });
  });
});

describe("HierarchyConfiguration", () => {
  let hc: HierarchyConfiguration;

  beforeEach(() => {
    hc = new HierarchyConfiguration({
      metadata: {
        name: "example"
      },
      spec: {
        labels: [
          {
            key: "foo",
            value: "bar"
          }
        ],
        parent: "parent-ns"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(hc).toHaveProperty("apiVersion", "hnc.x-k8s.io/v1alpha2");
  });

  it("should set kind", () => {
    expect(hc).toHaveProperty("kind", "HierarchyConfiguration");
  });

  it("validate", () => {
    expect(() => hc.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(hc.toJSON()).toEqual({
      apiVersion: "hnc.x-k8s.io/v1alpha2",
      kind: "HierarchyConfiguration",
      metadata: {
        name: "example"
      },
      spec: {
        labels: [
          {
            key: "foo",
            value: "bar"
          }
        ],
        parent: "parent-ns"
      }
    });
  });
});

describe("HierarchicalResourceQuota", () => {
  let hrq: HierarchicalResourceQuota;

  beforeEach(() => {
    hrq = new HierarchicalResourceQuota({
      metadata: {
        name: "example"
      },
      spec: {
        hard: {
          "count/pods": "100"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(hrq).toHaveProperty("apiVersion", "hnc.x-k8s.io/v1alpha2");
  });

  it("should set kind", () => {
    expect(hrq).toHaveProperty("kind", "HierarchicalResourceQuota");
  });

  it("validate", () => {
    expect(() => hrq.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(hrq.toJSON()).toEqual({
      apiVersion: "hnc.x-k8s.io/v1alpha2",
      kind: "HierarchicalResourceQuota",
      metadata: {
        name: "example"
      },
      spec: {
        hard: {
          "count/pods": "100"
        }
      }
    });
  });
});
