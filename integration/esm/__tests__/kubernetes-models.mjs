import test from "ava";
import { Pod } from "../../../packages/kubernetes-models/dist/v1/Pod.js";

const pod = new Pod({
  metadata: {
    name: "foo"
  },
  spec: {
    containers: [
      {
        name: "nginx",
        image: "nginx:stable"
      }
    ]
  }
});

test("Pod.toJSON", (t) => {
  t.deepEqual(pod.toJSON(), {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: "foo"
    },
    spec: {
      containers: [
        {
          name: "nginx",
          image: "nginx:stable"
        }
      ]
    }
  });
});

test("Pod.validate", (t) => {
  t.notThrows(() => pod.validate());
});
