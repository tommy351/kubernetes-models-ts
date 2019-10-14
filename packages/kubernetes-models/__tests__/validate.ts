import { Pod } from "../gen/v1/Pod";
import { Service } from "../gen/v1/Service";
import { JSONSchemaProps } from "../gen/apiextensions.k8s.io/v1beta1/JSONSchemaProps";

describe("validate", () => {
  describe("when validation passed", () => {
    it("should pass", () => {
      const pod = new Pod({
        spec: {
          containers: []
        }
      });

      pod.validate();
    });
  });

  describe("when validation failed", () => {
    it("should throw an error", () => {
      const pod = new Pod({
        spec: {} as any
      });

      expect(() => pod.validate()).toThrow(
        "data.spec should have required property 'containers'"
      );
    });
  });

  describe("Service", () => {
    function buildTest(targetPort: any) {
      return () => {
        const svc = new Service({
          spec: {
            ports: [{ port: 80, targetPort }]
          }
        });

        svc.validate();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(svc.spec!.ports![0].targetPort).toEqual(targetPort);
      };
    }

    it("should be able to use number in targetPort", buildTest(80));

    it("should be able to use string in targetPort", buildTest("http"));
  });

  describe("JSONSchemaProps", () => {
    function buildTest(value: any) {
      return () => {
        const props = new JSONSchemaProps({
          default: value
        });

        props.validate();
        expect(props.default).toEqual(value);
      };
    }

    it("should pass when type = string", buildTest("str"));
    it("should pass when type = boolean", buildTest(true));
    it("should pass when type = int", buildTest(123));
    it("should pass when type = float", buildTest(46.93));
    it("should pass when type = array", buildTest(["a", "b", "c"]));
    it("should pass when type = object", buildTest({ a: "b", c: "d" }));
  });
});
