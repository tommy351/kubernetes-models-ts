import test from "ava";
import { Deployment } from "../gen/ts/api/apps/v1/Deployment";
import { Pod } from "../gen/ts/api/core/v1/Pod";

test("should set apiVersion and kind to Deployment class", t => {
  const deployment = new Deployment();
  t.true(deployment.apiVersion === "apps/v1");
  t.true(deployment.kind === "Deployment");
});

test("should set apiVersion and kind to Pod class", t => {
  const pod = new Pod();
  t.true(pod.apiVersion === "v1");
  t.true(pod.kind === "Pod");
});
