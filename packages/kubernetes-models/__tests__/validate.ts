import { Pod } from "../gen/v1/Pod";
import { Service } from "../gen/v1/Service";
import { ConfigMap } from "../gen/v1/ConfigMap";
import { JSONSchemaProps as JSONSchemaPropsV1Beta1 } from "../gen/apiextensions.k8s.io/v1beta1/JSONSchemaProps";
import { JSONSchemaProps as JSONSchemaPropsV1 } from "../gen/apiextensions.k8s.io/v1/JSONSchemaProps";

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
        spec: {} as any
      });

      expect(() => pod.validate()).toThrow(
        "data/spec must have required property 'containers'"
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
  });

  describe("ConfigMap", () => {
    describe("when data is null", () => {
      it("should pass", () => {
        const configMap = new ConfigMap({
          data: null as any
        });

        expect(() => configMap.validate()).not.toThrow();
      });
    });
  });
});
