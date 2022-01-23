import { VerticalPodAutoscaler } from "../gen/autoscaling.k8s.io/v1/VerticalPodAutoscaler";

describe("VerticalPodAutoscaler", () => {
  let vpa: VerticalPodAutoscaler;

  beforeEach(() => {
    vpa = new VerticalPodAutoscaler({
      metadata: {
        name: "test"
      },
      spec: {
        targetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "my-app"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(vpa).toHaveProperty("apiVersion", "autoscaling.k8s.io/v1");
  });

  it("should set kind", () => {
    expect(vpa).toHaveProperty("kind", "VerticalPodAutoscaler");
  });

  it("should set metadata", () => {
    expect(vpa.metadata).toEqual({ name: "test" });
  });

  it("should set sepc", () => {
    expect(vpa).toHaveProperty("spec");
  });

  it("toJSON", () => {
    expect(vpa.toJSON()).toEqual({
      apiVersion: "autoscaling.k8s.io/v1",
      kind: "VerticalPodAutoscaler",
      metadata: {
        name: "test"
      },
      spec: {
        targetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "my-app"
        }
      }
    });
  });
});
