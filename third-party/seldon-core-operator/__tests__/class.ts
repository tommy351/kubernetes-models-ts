import { SeldonDeployment } from "../gen/machinelearning.seldon.io/v1/SeldonDeployment";

describe("SeldonDeployment", () => {
  let deployment: SeldonDeployment;

  beforeEach(() => {
    deployment = new SeldonDeployment({
      metadata: { name: "example" },
      spec: {
        predictors: [
          {
            name: "example",
            graph: {
              name: "classifier",
              children: [],
              endpoint: {
                type: "REST",
              },
              type: "MODEL",
            },
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(deployment).toHaveProperty(
      "apiVersion",
      "machinelearning.seldon.io/v1"
    );
  });

  it("should set kind", () => {
    expect(deployment).toHaveProperty("kind", "SeldonDeployment");
  });

  it("validate", () => {
    expect(() => deployment.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(deployment.toJSON()).toEqual({
      apiVersion: "machinelearning.seldon.io/v1",
      kind: "SeldonDeployment",
      metadata: { name: "example" },
      spec: {
        predictors: [
          {
            name: "example",
            graph: {
              name: "classifier",
              children: [],
              endpoint: {
                type: "REST",
              },
              type: "MODEL",
            },
          }
        ]
      }
    });
  });
});
