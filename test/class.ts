import { expect } from "chai";
import { Deployment } from "../gen/ts/api/apps/v1/Deployment";
import { Pod } from "../gen/ts/api/core/v1/Pod";

describe("class", () => {
  describe("Deployment", () => {
    let deployment: Deployment;

    beforeEach(() => {
      deployment = new Deployment();
    });

    it("should set apiVersion", () => {
      expect(deployment).to.haveOwnProperty("apiVersion", "apps/v1");
    });

    it("should set kind", () => {
      expect(deployment).to.haveOwnProperty("kind", "Deployment");
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
});
