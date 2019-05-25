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
        }
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

  describe("toJSON", () => {
    it("should not set undefined props", () => {
      const json = new Pod({
        spec: undefined
      }).toJSON();

      expect(json).to.eql({
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

      expect(json).to.eql({
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

      expect(json).to.eql({
        apiVersion: "v1",
        kind: "Pod",
        spec: {
          containers: [{ name: "foo" }]
        }
      });
    });
  });
});
