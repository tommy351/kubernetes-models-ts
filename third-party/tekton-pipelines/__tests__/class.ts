import { describe, it, expect } from "vitest";
import { Pipeline } from "../gen/tekton.dev/v1/Pipeline.js";
import { PipelineRun } from "../gen/tekton.dev/v1/PipelineRun.js";
import { Task } from "../gen/tekton.dev/v1/Task.js";
import { TaskRun } from "../gen/tekton.dev/v1/TaskRun.js";
import { StepAction } from "../gen/tekton.dev/v1beta1/StepAction.js";
import { CustomRun } from "../gen/tekton.dev/v1beta1/CustomRun.js";
import { VerificationPolicy } from "../gen/tekton.dev/v1alpha1/VerificationPolicy.js";
import { ResolutionRequest } from "../gen/resolution.tekton.dev/v1beta1/ResolutionRequest.js";

describe("Pipeline", () => {
  const pipeline = new Pipeline({
    metadata: {
      name: "example-pipeline",
      namespace: "default",
    },
    spec: {
      tasks: [
        {
          name: "hello",
          taskRef: {
            name: "hello-task",
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(pipeline).toHaveProperty("apiVersion", "tekton.dev/v1");
  });

  it("should set kind", () => {
    expect(pipeline).toHaveProperty("kind", "Pipeline");
  });

  it("validate", () => {
    expect(() => pipeline.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(pipeline.toJSON()).toEqual({
      apiVersion: "tekton.dev/v1",
      kind: "Pipeline",
      metadata: {
        name: "example-pipeline",
        namespace: "default",
      },
      spec: {
        tasks: [
          {
            name: "hello",
            taskRef: {
              name: "hello-task",
            },
          },
        ],
      },
    });
  });
});

describe("PipelineRun", () => {
  const pipelineRun = new PipelineRun({
    metadata: {
      name: "example-pipeline-run",
      namespace: "default",
    },
    spec: {
      pipelineRef: {
        name: "example-pipeline",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(pipelineRun).toHaveProperty("apiVersion", "tekton.dev/v1");
  });

  it("should set kind", () => {
    expect(pipelineRun).toHaveProperty("kind", "PipelineRun");
  });

  it("validate", () => {
    expect(() => pipelineRun.validate()).not.toThrow();
  });
});

describe("Task", () => {
  const task = new Task({
    metadata: {
      name: "hello-task",
      namespace: "default",
    },
    spec: {
      steps: [
        {
          name: "echo",
          image: "alpine:3",
          script: "echo hello",
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(task).toHaveProperty("apiVersion", "tekton.dev/v1");
  });

  it("should set kind", () => {
    expect(task).toHaveProperty("kind", "Task");
  });

  it("validate", () => {
    expect(() => task.validate()).not.toThrow();
  });
});

describe("TaskRun", () => {
  const taskRun = new TaskRun({
    metadata: {
      name: "example-task-run",
      namespace: "default",
    },
    spec: {
      taskRef: {
        name: "hello-task",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(taskRun).toHaveProperty("apiVersion", "tekton.dev/v1");
  });

  it("should set kind", () => {
    expect(taskRun).toHaveProperty("kind", "TaskRun");
  });

  it("validate", () => {
    expect(() => taskRun.validate()).not.toThrow();
  });
});

describe("StepAction", () => {
  const stepAction = new StepAction({
    metadata: {
      name: "echo",
      namespace: "default",
    },
    spec: {
      image: "alpine:3",
      script: "echo hello",
    },
  });

  it("should set apiVersion", () => {
    expect(stepAction).toHaveProperty("apiVersion", "tekton.dev/v1beta1");
  });

  it("should set kind", () => {
    expect(stepAction).toHaveProperty("kind", "StepAction");
  });

  it("validate", () => {
    expect(() => stepAction.validate()).not.toThrow();
  });
});

describe("CustomRun", () => {
  const customRun = new CustomRun({
    metadata: {
      name: "example-custom-run",
      namespace: "default",
    },
    spec: {
      customRef: {
        apiVersion: "example.dev/v1alpha1",
        kind: "Example",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(customRun).toHaveProperty("apiVersion", "tekton.dev/v1beta1");
  });

  it("should set kind", () => {
    expect(customRun).toHaveProperty("kind", "CustomRun");
  });

  it("validate", () => {
    expect(() => customRun.validate()).not.toThrow();
  });
});

describe("VerificationPolicy", () => {
  const policy = new VerificationPolicy({
    metadata: {
      name: "example-policy",
      namespace: "tekton-pipelines",
    },
    spec: {
      resources: [
        {
          pattern: "https://github.com/tektoncd/catalog.*",
        },
      ],
      authorities: [
        {
          name: "default-authority",
          key: {
            data: "-----BEGIN PUBLIC KEY-----\n-----END PUBLIC KEY-----",
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "tekton.dev/v1alpha1");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "VerificationPolicy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });
});

describe("ResolutionRequest", () => {
  const request = new ResolutionRequest({
    metadata: {
      name: "example-resolution-request",
      namespace: "default",
    },
    spec: {
      params: [
        {
          name: "url",
          value: "https://example.com/task.yaml",
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(request).toHaveProperty(
      "apiVersion",
      "resolution.tekton.dev/v1beta1",
    );
  });

  it("should set kind", () => {
    expect(request).toHaveProperty("kind", "ResolutionRequest");
  });

  it("validate", () => {
    expect(() => request.validate()).not.toThrow();
  });
});
