import { describe, it, expect, beforeEach } from "vitest";
import { ClusterPolicy } from "../gen/kyverno.io/v1/ClusterPolicy";
import { PolicyException } from "../gen/kyverno.io/v2beta1/PolicyException";
import { CleanupPolicy } from "../gen/kyverno.io/v2beta1/CleanupPolicy";

describe("ClusterPolicy", () => {
  let policy: ClusterPolicy;

  beforeEach(() => {
    policy = new ClusterPolicy({
      metadata: {
        name: "require-labels"
      },
      spec: {
        validationFailureAction: "enforce",
        background: false,
        rules: [
          {
            name: "check-team",
            match: {
              any: [
                {
                  resources: {
                    namespaces: ["default"],
                    kinds: ["Pod"]
                  }
                }
              ]
            },
            validate: {
              message: "label team must be set",
              pattern: {
                metadata: {
                  labels: {
                    team: "?*"
                  }
                }
              }
            }
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "kyverno.io/v1");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "ClusterPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "kyverno.io/v1",
      kind: "ClusterPolicy",
      metadata: {
        name: "require-labels"
      },
      spec: {
        validationFailureAction: "enforce",
        background: false,
        rules: [
          {
            name: "check-team",
            match: {
              any: [
                {
                  resources: {
                    namespaces: ["default"],
                    kinds: ["Pod"]
                  }
                }
              ]
            },
            validate: {
              message: "label team must be set",
              pattern: {
                metadata: {
                  labels: {
                    team: "?*"
                  }
                }
              }
            }
          }
        ]
      }
    });
  });
});

describe("PolicyException", () => {
  let exception: PolicyException;

  beforeEach(() => {
    exception = new PolicyException({
      metadata: {
        name: "delta-exception",
        namespace: "delta"
      },
      spec: {
        exceptions: [
          {
            policyName: "disallow-host-namespaces",
            ruleNames: ["host-namespaces", "autogen-host-namespaces"]
          }
        ],
        match: {
          any: [
            {
              resources: {
                kinds: ["Deployment", "Pod"],
                names: ["importent-tool*"],
                namespaces: ["delta"]
              }
            }
          ]
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(exception).toHaveProperty("apiVersion", "kyverno.io/v2beta1");
  });

  it("should set kind", () => {
    expect(exception).toHaveProperty("kind", "PolicyException");
  });

  it("validate", () => {
    expect(() => exception.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(exception.toJSON()).toEqual({
      apiVersion: "kyverno.io/v2beta1",
      kind: "PolicyException",
      metadata: {
        name: "delta-exception",
        namespace: "delta"
      },
      spec: {
        exceptions: [
          {
            policyName: "disallow-host-namespaces",
            ruleNames: ["host-namespaces", "autogen-host-namespaces"]
          }
        ],
        match: {
          any: [
            {
              resources: {
                kinds: ["Deployment", "Pod"],
                names: ["importent-tool*"],
                namespaces: ["delta"]
              }
            }
          ]
        }
      }
    });
  });
});

describe("CleanupPolicy", () => {
  let policy: CleanupPolicy;

  beforeEach(() => {
    policy = new CleanupPolicy({
      metadata: {
        name: "cleandeploy"
      },
      spec: {
        match: {
          any: [
            {
              resources: {
                kinds: ["Deployment"],
                selector: {
                  matchLabels: {
                    canremove: "true"
                  }
                }
              }
            }
          ]
        },
        conditions: {
          any: [
            {
              key: "{{ target.spec.replicas }}",
              operator: "LessThan",
              value: 2
            }
          ]
        },
        schedule: "*/5 * * * *"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "kyverno.io/v2beta1");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "CleanupPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "kyverno.io/v2beta1",
      kind: "CleanupPolicy",
      metadata: {
        name: "cleandeploy"
      },
      spec: {
        match: {
          any: [
            {
              resources: {
                kinds: ["Deployment"],
                selector: {
                  matchLabels: {
                    canremove: "true"
                  }
                }
              }
            }
          ]
        },
        conditions: {
          any: [
            {
              key: "{{ target.spec.replicas }}",
              operator: "LessThan",
              value: 2
            }
          ]
        },
        schedule: "*/5 * * * *"
      }
    });
  });
});
