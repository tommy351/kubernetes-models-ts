import { expect } from "chai";
import { Deployment } from "../gen/ts/api/apps/v1/Deployment";
import { Pod } from "../gen/ts/api/core/v1/Pod";

describe("class", () => {
  describe("Deployment", () => {
    let deployment: Deployment;

    beforeEach(() => {
      deployment = new Deployment({
        metadata: {
          name: "test"
        },
        spec: undefined
      });
    });

    it("should set apiVersion", () => {
      expect(deployment).to.haveOwnProperty("apiVersion", "apps/v1");
    });

    it("should set kind", () => {
      expect(deployment).to.haveOwnProperty("kind", "Deployment");
    });

    it("should set metadata", () => {
      expect(deployment.metadata).to.eql({ name: "test" });
    });

    it("should not set sepc", () => {
      expect(deployment).not.to.haveOwnProperty("spec");
    });

    it("toJSON", () => {
      expect(deployment.toJSON()).to.eql({
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
      expect(pod).to.haveOwnProperty("apiVersion", "v1");
    });

    it("should set kind", () => {
      expect(pod).to.haveOwnProperty("kind", "Pod");
    });
  });

  describe("given apiVersion", () => {
    let pod: Pod;

    beforeEach(() => {
      pod = new Pod({ apiVersion: "foo" });
    });

    it("should override apiVersion", () => {
      expect(pod).to.haveOwnProperty("apiVersion", "foo");
    });
  });

  describe("given apiVersion", () => {
    let pod: Pod;

    beforeEach(() => {
      pod = new Pod({ kind: "bar" });
    });

    it("should override apiVersion", () => {
      expect(pod).to.haveOwnProperty("kind", "bar");
    });
  });
});
