import { VerticalPodAutoscaler } from "../gen/autoscaling.k8s.io/v1/VerticalPodAutoscaler";

describe("validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const config = new VerticalPodAutoscaler({
        spec: {
          targetRef: {
            apiVersion: "apps/v1",
            kind: "Deployment",
            name: "my-app"
          },
          updatePolicy: {
            updateMode: "Off"
          }
        }
      });

      expect(() => config.validate()).not.toThrow();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const config = new VerticalPodAutoscaler({
        spec: {
          targetRef: {} as any,
          updatePolicy: {} as any
        }
      });

      expect(() => config.validate()).toThrow(
        "data/spec/targetRef must have required property 'kind'"
      );
    });
  });
});
