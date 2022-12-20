import { Rollout } from "../gen/argoproj.io/v1alpha1/Rollout";

describe("Rollout", () => {
  let rollout: Rollout;

  beforeEach(() => {
    rollout = new Rollout({
      metadata: {
        name: "rollouts-demo"
      },
      spec: {
        replicas: 5,
        strategy: {
          canary: {
            steps: [
              { setWeight: 20 },
              { pause: {} },
              { setWeight: 40 },
              { pause: { duration: 10 } }
            ]
          }
        },
        revisionHistoryLimit: 2,
        selector: {
          matchLabels: {
            app: "rollouts-demo"
          }
        },
        template: {
          metadata: {
            labels: {
              app: "rollouts-demo"
            }
          },
          spec: {
            containers: [
              {
                name: "rollouts-demo",
                image: "argoproj/rollouts-demo:blue"
              }
            ]
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(rollout).toHaveProperty("apiVersion", "argoproj.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(rollout).toHaveProperty("kind", "Rollout");
  });

  it("validate", () => {
    expect(() => rollout.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(rollout.toJSON()).toEqual({
      apiVersion: "argoproj.io/v1alpha1",
      kind: "Rollout",
      metadata: {
        name: "rollouts-demo"
      },
      spec: {
        replicas: 5,
        strategy: {
          canary: {
            steps: [
              { setWeight: 20 },
              { pause: {} },
              { setWeight: 40 },
              { pause: { duration: 10 } }
            ]
          }
        },
        revisionHistoryLimit: 2,
        selector: {
          matchLabels: {
            app: "rollouts-demo"
          }
        },
        template: {
          metadata: {
            labels: {
              app: "rollouts-demo"
            }
          },
          spec: {
            containers: [
              {
                name: "rollouts-demo",
                image: "argoproj/rollouts-demo:blue"
              }
            ]
          }
        }
      }
    });
  });
});
