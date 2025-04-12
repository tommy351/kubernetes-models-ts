import { describe, it, expect, beforeEach } from "vitest";
import { Deployment as DeploymentV1 } from "../gen/apps/v1/Deployment";
import { Deployment as DeploymentV1Beta1 } from "../gen/extensions/v1beta1/Deployment";
import { Ingress as IngressV1 } from "../gen/networking.k8s.io/v1/Ingress";
import { Ingress as IngressV1Beta1 } from "../gen/extensions/v1beta1/Ingress";
import { Pod } from "../gen/v1/Pod";
import { PodSpec } from "../gen/v1/PodSpec";

describe("Deployment apps/v1", () => {
  let deployment: DeploymentV1;

  beforeEach(() => {
    deployment = new DeploymentV1({
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

describe("Deployment apps/v1beta1", () => {
  let deployment: DeploymentV1Beta1;

  beforeEach(() => {
    deployment = new DeploymentV1Beta1({
      metadata: {
        name: "test"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(deployment).toHaveProperty("apiVersion", "extensions/v1beta1");
  });

  it("should set kind", () => {
    expect(deployment).toHaveProperty("kind", "Deployment");
  });

  it("should set metadata", () => {
    expect(deployment.metadata).toEqual({ name: "test" });
  });

  it("toJSON", () => {
    expect(deployment.toJSON()).toEqual({
      apiVersion: "extensions/v1beta1",
      kind: "Deployment",
      metadata: {
        name: "test"
      }
    });
  });
});

describe("Ingress networking.k8s.io/v1", () => {
  let ingress: IngressV1;

  beforeEach(() => {
    ingress = new IngressV1({});
  });

  it("should set apiVersion", () => {
    expect(ingress).toHaveProperty("apiVersion", "networking.k8s.io/v1");
  });

  it("should set kind", () => {
    expect(ingress).toHaveProperty("kind", "Ingress");
  });
});

describe("Ingress extensions/v1beta1", () => {
  let ingress: IngressV1Beta1;

  beforeEach(() => {
    ingress = new IngressV1Beta1({});
  });

  it("should set apiVersion", () => {
    expect(ingress).toHaveProperty("apiVersion", "extensions/v1beta1");
  });

  it("should set kind", () => {
    expect(ingress).toHaveProperty("kind", "Ingress");
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

// Test if definitions without GVK are still exported
describe("PodSpec", () => {
  let spec: PodSpec;

  beforeEach(() => {
    spec = new PodSpec({
      containers: [
        {
          name: "busybox",
          image: "busybox"
        }
      ]
    });
  });

  it("should set containers", () => {
    expect(spec).toHaveProperty("containers", [
      {
        name: "busybox",
        image: "busybox"
      }
    ]);
  });
});
