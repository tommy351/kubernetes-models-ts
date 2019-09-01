import { Deployment } from "../gen/apps/v1/Deployment";
import { Pod } from "../gen/v1/Pod";

describe("Deployment", () => {
  let deployment: Deployment;

  beforeEach(() => {
    deployment = new Deployment({
      metadata: {
        name: "test"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(deployment).toHaveProperty("apiVersion", "apps/v1");
  });

  it("should set kind", () => {
    expect(deployment).toHaveProperty("kind", "Deployment");
  });

  it("should set metadata", () => {
    expect(deployment.metadata).toEqual({ name: "test" });
  });

  it("should not set sepc", () => {
    expect(deployment).not.toHaveProperty("spec");
  });

  it("toJSON", () => {
    expect(deployment.toJSON()).toEqual({
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {
        name: "test"
      }
    });
  });
});

describe("Pod", () => {
  let pod: Pod;

  beforeEach(() => {
    pod = new Pod();
  });

  it("should set apiVersion", () => {
    expect(pod).toHaveProperty("apiVersion", "v1");
  });

  it("should set kind", () => {
    expect(pod).toHaveProperty("kind", "Pod");
  });
});
