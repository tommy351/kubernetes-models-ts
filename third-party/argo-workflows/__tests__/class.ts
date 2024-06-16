import { describe, it, expect, beforeEach } from "vitest";
import { Workflow } from "../gen/argoproj.io/v1alpha1/Workflow";

describe("Workflow", () => {
  let workflow: Workflow;

  beforeEach(() => {
    workflow = new Workflow({
      metadata: {
        name: "workflows-demo"
      },
      spec: {
        entrypoint: "hello",
        templates: [
          {
            name: "hello",
            container: {
              image: "alpine:latest",
              command: ["echo", "Hello, Argo!"]
            }
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(workflow).toHaveProperty("apiVersion", "argoproj.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(workflow).toHaveProperty("kind", "Workflow");
  });

  it("validate", () => {
    expect(() => workflow.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(workflow.toJSON()).toEqual({
      apiVersion: "argoproj.io/v1alpha1",
      kind: "Workflow",
      metadata: {
        name: "workflows-demo"
      },
      spec: {
        entrypoint: "hello",
        templates: [
          {
            name: "hello",
            container: {
              image: "alpine:latest",
              command: ["echo", "Hello, Argo!"]
            }
          }
        ]
      }
    });
  });
});
