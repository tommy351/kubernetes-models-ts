import { Pod } from "../dist/v1/Pod.mjs";

describe("Pod", () => {
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

  it("toJSON", () => {
    expect(pod.toJSON()).toEqual({
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

  it("validate", () => {
    expect(() => pod.validate()).not.toThrow();
  });
});
