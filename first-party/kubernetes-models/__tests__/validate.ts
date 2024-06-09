import { describe, it, expect } from "vitest";
import { Pod } from "../gen/v1/Pod";
import { Service } from "../gen/v1/Service";
import { ConfigMap } from "../gen/v1/ConfigMap";
import { JSONSchemaProps as JSONSchemaPropsV1Beta1 } from "../gen/apiextensions.k8s.io/v1beta1/JSONSchemaProps";
import { JSONSchemaProps as JSONSchemaPropsV1 } from "../gen/apiextensions.k8s.io/v1/JSONSchemaProps";
import { PersistentVolumeClaim } from "../gen/v1/PersistentVolumeClaim";
import { StatefulSetSpec } from "../gen/apps/v1/StatefulSetSpec";

describe("validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const pod = new Pod({
        spec: {
          containers: []
        }
      });

      expect(() => pod.validate()).not.toThrow();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const pod = new Pod({
        // @ts-expect-error
        spec: {}
      });

      expect(() => pod.validate()).toThrow(
        "data/spec must have required property containers"
      );
    });
  });

  describe("Service", () => {
    describe.each([[80], ["http"]])("when targetPort = %p", (targetPort) => {
      it("should pass", () => {
        const svc = new Service({
          spec: {
            ports: [{ port: 80, targetPort }]
          }
        });

        svc.validate();
        expect(svc.spec?.ports?.[0].targetPort).toEqual(targetPort);
      });
    });
  });

  describe("JSONSchemaProps", () => {
    describe.each([
      ["string", "str"],
      ["boolean", true],
      ["int", 123],
      ["float", 46.93],
      ["array", ["a", "b", "c"]],
      ["object", { a: "b", c: "d" }]
    ])("when type = %s", (_, value) => {
      it("v1beta1 should pass", () => {
        const props = new JSONSchemaPropsV1Beta1({
          default: value
        });

        props.validate();
        expect(props.default).toEqual(value);
      });

      it("v1 should pass", () => {
        const props = new JSONSchemaPropsV1({
          default: value
        });

        props.validate();
        expect(props.default).toEqual(value);
      });
    });

    it("oneOf", () => {
      const props = new JSONSchemaPropsV1({
        oneOf: [{ type: "string" }, { type: "number" }]
      });

      expect(() => props.validate()).not.toThrow();
    });
  });

  describe("ConfigMap", () => {
    describe("when data is null", () => {
      it("should pass", () => {
        const configMap = new ConfigMap({
          // @ts-expect-error
          data: null
        });

        expect(() => configMap.validate()).not.toThrow();
      });
    });
  });

  describe("PersistentVolumeClaim", () => {
    function createPVC(quantity: string | number): PersistentVolumeClaim {
      return new PersistentVolumeClaim({
        spec: {
          resources: {
            requests: {
              storage: quantity
            }
          }
        }
      });
    }

    describe("when quantity is a string", () => {
      it("should pass", () => {
        const pvc = createPVC("8Gi");
        expect(() => pvc.validate()).not.toThrow();
      });
    });

    describe("when quantity is a number", () => {
      it("should pass", () => {
        const pvc = createPVC(8000);
        expect(() => pvc.validate()).not.toThrow();
      });
    });

    describe("when quantity is invalid", () => {
      it("should fail", () => {
        const pvc = createPVC("foo");
        expect(() => pvc.validate()).toThrow(
          `data/spec/resources/requests/storage must be number, data/spec/resources/requests/storage must match format "quantity", data/spec/resources/requests/storage must match exactly one schema in "oneOf"`
        );
      });
    });
  });

  describe("Pod", () => {
    describe("when metadata.creationTimestamp is null", () => {
      it("should pass", () => {
        const pod = new Pod({
          metadata: {
            // @ts-expect-error
            creationTimestamp: null
          }
        });

        expect(() => pod.validate()).not.toThrow();
      });
    });

    describe("when spec is null", () => {
      it("should pass", () => {
        const pod = new Pod({
          // @ts-expect-error
          spec: null
        });

        expect(() => pod.validate()).not.toThrow();
      });
    });

    describe("when spec.containers is null", () => {
      it("should fail", () => {
        const pod = new Pod({
          spec: {
            // @ts-expect-error
            containers: null
          }
        });

        expect(() => pod.validate()).toThrow(
          "data/spec/containers must be array"
        );
      });
    });
  });
});

describe("StatefulSetSpec", () => {
  describe("when apiVersion and kind is not defined in volumeClaimTemplates", () => {
    it("should pass", () => {
      const spec = new StatefulSetSpec({
        serviceName: "mysql",
        selector: {
          matchLabels: {
            app: "mysql"
          }
        },
        template: {},
        volumeClaimTemplates: [
          {
            metadata: { name: "data" },
            spec: {
              storageClassName: "ssd"
            }
          }
        ]
      });

      expect(() => spec.validate()).not.toThrow();
    });
  });
});
