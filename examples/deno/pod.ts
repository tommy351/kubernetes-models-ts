import { Pod } from "https://cdn.skypack.dev/kubernetes-models/v1/Pod?dts";

const pod = new Pod({
  metadata: {
    name: "demo"
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

console.log(pod);

pod.validate();
