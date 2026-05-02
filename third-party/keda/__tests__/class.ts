import { describe, it, expect } from "vitest";
import { ScaledJob } from "../gen/keda.sh/v1alpha1/ScaledJob.js";
import { ScaledObject } from "../gen/keda.sh/v1alpha1/ScaledObject.js";
import { TriggerAuthentication } from "../gen/keda.sh/v1alpha1/TriggerAuthentication.js";
import { ClusterTriggerAuthentication } from "../gen/keda.sh/v1alpha1/ClusterTriggerAuthentication.js";

describe("ScaledJob", () => {
  const job = new ScaledJob({
    metadata: {
      name: "example"
    },
    spec: {
      jobTargetRef: {
        template: {
          spec: {
            containers: [
              {
                name: "example",
                image: "example.com/example:latest"
              }
            ]
          }
        }
      },
      triggers: [
        {
          type: "cpu",
          metadata: {
            type: "Utilization",
            value: "70"
          }
        }
      ]
    }
  });

  it("should set apiVersion", () => {
    expect(job).toHaveProperty("apiVersion", "keda.sh/v1alpha1");
  });

  it("should set kind", () => {
    expect(job).toHaveProperty("kind", "ScaledJob");
  });

  it("validate", () => {
    expect(() => job.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(job.toJSON()).toEqual({
      apiVersion: "keda.sh/v1alpha1",
      kind: "ScaledJob",
      metadata: {
        name: "example"
      },
      spec: {
        jobTargetRef: {
          template: {
            spec: {
              containers: [
                {
                  name: "example",
                  image: "example.com/example:latest"
                }
              ]
            }
          }
        },
        triggers: [
          {
            type: "cpu",
            metadata: {
              type: "Utilization",
              value: "70"
            }
          }
        ]
      }
    });
  });
});

describe("ScaledObject", () => {
  const object = new ScaledObject({
    metadata: {
      name: "example"
    },
    spec: {
      scaleTargetRef: {
        name: "example"
      },
      triggers: [
        {
          type: "cpu",
          metadata: {
            type: "Utilization",
            value: "70"
          }
        }
      ]
    }
  });

  it("should set apiVersion", () => {
    expect(object).toHaveProperty("apiVersion", "keda.sh/v1alpha1");
  });

  it("should set kind", () => {
    expect(object).toHaveProperty("kind", "ScaledObject");
  });

  it("validate", () => {
    expect(() => object.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(object.toJSON()).toEqual({
      apiVersion: "keda.sh/v1alpha1",
      kind: "ScaledObject",
      metadata: {
        name: "example"
      },
      spec: {
        scaleTargetRef: {
          name: "example"
        },
        triggers: [
          {
            type: "cpu",
            metadata: {
              type: "Utilization",
              value: "70"
            }
          }
        ]
      }
    });
  });
});

describe("TriggerAuthentication", () => {
  const auth = new TriggerAuthentication({
    metadata: {
      name: "example"
    },
    spec: {
      secretTargetRef: [
        {
          parameter: "example",
          name: "example",
          key: "example"
        }
      ]
    }
  });

  it("should set apiVersion", () => {
    expect(auth).toHaveProperty("apiVersion", "keda.sh/v1alpha1");
  });

  it("should set kind", () => {
    expect(auth).toHaveProperty("kind", "TriggerAuthentication");
  });

  it("validate", () => {
    expect(() => auth.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(auth.toJSON()).toEqual({
      apiVersion: "keda.sh/v1alpha1",
      kind: "TriggerAuthentication",
      metadata: {
        name: "example"
      },
      spec: {
        secretTargetRef: [
          {
            parameter: "example",
            name: "example",
            key: "example"
          }
        ]
      }
    });
  });
});

describe("ClusterTriggerAuthentication", () => {
  const auth = new ClusterTriggerAuthentication({
    metadata: {
      name: "example"
    },
    spec: {
      podIdentity: {
        provider: "gcp"
      }
    }
  });

  it("should set apiVersion", () => {
    expect(auth).toHaveProperty("apiVersion", "keda.sh/v1alpha1");
  });

  it("should set kind", () => {
    expect(auth).toHaveProperty("kind", "ClusterTriggerAuthentication");
  });

  it("validate", () => {
    expect(() => auth.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(auth.toJSON()).toEqual({
      apiVersion: "keda.sh/v1alpha1",
      kind: "ClusterTriggerAuthentication",
      metadata: {
        name: "example"
      },
      spec: {
        podIdentity: {
          provider: "gcp"
        }
      }
    });
  });
});
