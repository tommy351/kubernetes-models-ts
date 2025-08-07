import { describe, it, expect, beforeEach } from "vitest";
import { FlinkDeployment } from "../gen/flink.apache.org/v1beta1/FlinkDeployment";

describe("FlinkDeployment", () => {
  let deployment: FlinkDeployment;

  beforeEach(() => {
    deployment = new FlinkDeployment({
      metadata: {
        name: "example"
      },
      spec: {
        image: "flink:1.20",
        flinkVersion: "v1_20",
        flinkConfiguration: {
          "taskmanager.numberOfTaskSlots": "2"
        },
        serviceAccount: "flink",
        jobManager: {
          resource: {
            memory: "1024m",
            cpu: 1
          }
        },
        taskManager: {
          resource: {
            memory: "2048m",
            cpu: 1
          }
        },
        job: {
          jarURI:
            "local:///opt/flink/examples/streaming/StateMachineExample.jar",
          parallelism: 2,
          upgradeMode: "stateless",
          state: "running"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(deployment).toHaveProperty("apiVersion", "flink.apache.org/v1beta1");
  });

  it("should set kind", () => {
    expect(deployment).toHaveProperty("kind", "FlinkDeployment");
  });

  it("validate", () => {
    expect(() => deployment.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(deployment.toJSON()).toEqual({
      apiVersion: "flink.apache.org/v1beta1",
      kind: "FlinkDeployment",
      metadata: {
        name: "example"
      },
      spec: {
        image: "flink:1.20",
        flinkVersion: "v1_20",
        flinkConfiguration: {
          "taskmanager.numberOfTaskSlots": "2"
        },
        serviceAccount: "flink",
        jobManager: {
          resource: {
            memory: "1024m",
            cpu: 1
          }
        },
        taskManager: {
          resource: {
            memory: "2048m",
            cpu: 1
          }
        },
        job: {
          jarURI:
            "local:///opt/flink/examples/streaming/StateMachineExample.jar",
          parallelism: 2,
          upgradeMode: "stateless",
          state: "running"
        }
      }
    });
  });
});
