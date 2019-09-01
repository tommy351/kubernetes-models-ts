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

describe("toJSON", () => {
  it("should not set undefined props", () => {
    const json = new Pod({
      spec: undefined
    }).toJSON();

    expect(json).toEqual({
      apiVersion: "v1",
      kind: "Pod"
    });
  });

  it("should not set undefined props in an object", () => {
    const json = new Pod({
      spec: {
        nodeName: undefined
      } as any
    }).toJSON();

    expect(json).toEqual({
      apiVersion: "v1",
      kind: "Pod",
      spec: {}
    });
  });

  it("should not set undefined props in an array", () => {
    const json = new Pod({
      spec: {
        containers: [
          {
            name: "foo",
            image: undefined
          }
        ]
      }
    }).toJSON();

    expect(json).toEqual({
      apiVersion: "v1",
      kind: "Pod",
      spec: {
        containers: [{ name: "foo" }]
      }
    });
  });
});
