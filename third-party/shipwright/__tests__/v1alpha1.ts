import { describe, it, expect, beforeEach } from "vitest";
import { Build } from "../gen/shipwright.io/v1alpha1/Build";
import { BuildRun } from "../gen/shipwright.io/v1alpha1/BuildRun";
import { BuildStrategy } from "../gen/shipwright.io/v1alpha1/BuildStrategy";
import { ClusterBuildStrategy } from "../gen/shipwright.io/v1alpha1/ClusterBuildStrategy";

describe("Build", () => {
  let build: Build;

  beforeEach(() => {
    build = new Build({
      metadata: {
        namespace: "my-namespace",
        name: "buildah-golang-build"
      },
      spec: {
        strategy: {
          kind: "ClusterBuildStrategy",
          name: "buildah"
        },
        source: {
          url: "https://github.com/shipwright-io/sample-go",
          contextDir: "docker-build"
        },
        output: {
          image: "registry/namespace/image:latest"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(build).toHaveProperty("apiVersion", "shipwright.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(build).toHaveProperty("kind", "Build");
  });

  it("validate", () => {
    expect(() => build.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(build.toJSON()).toEqual({
      apiVersion: "shipwright.io/v1alpha1",
      kind: "Build",
      metadata: {
        namespace: "my-namespace",
        name: "buildah-golang-build"
      },
      spec: {
        strategy: {
          kind: "ClusterBuildStrategy",
          name: "buildah"
        },
        source: {
          url: "https://github.com/shipwright-io/sample-go",
          contextDir: "docker-build"
        },
        output: {
          image: "registry/namespace/image:latest"
        }
      }
    });
  });
});

describe("BuildRun", () => {
  let buildRun: BuildRun;

  beforeEach(() => {
    buildRun = new BuildRun({
      metadata: {
        namespace: "my-namespace",
        generateName: "test-buildrun-"
      },
      spec: {}
    });
  });

  it("should set apiVersion", () => {
    expect(buildRun).toHaveProperty("apiVersion", "shipwright.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(buildRun).toHaveProperty("kind", "BuildRun");
  });

  it("validate", () => {
    expect(() => buildRun.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(buildRun.toJSON()).toEqual({
      apiVersion: "shipwright.io/v1alpha1",
      kind: "BuildRun",
      metadata: {
        namespace: "my-namespace",
        generateName: "test-buildrun-"
      },
      spec: {}
    });
  });

  it("should accept a build-ref", () => {
    buildRun.spec.buildRef = {
      name: "buildah-golang-build"
    };
    expect(() => buildRun.validate()).not.toThrow();
  });

  it("should accept a build-spec", () => {
    buildRun.spec.buildSpec = {
      strategy: {
        kind: "ClusterBuildStrategy",
        name: "buildah"
      },
      source: {
        url: "https://github.com/shipwright-io/sample-go",
        contextDir: "docker-build"
      },
      output: {
        image: "registry/namespace/image:latest"
      }
    };
    expect(() => buildRun.validate()).not.toThrow();
  });
});

describe("BuildStrategy", () => {
  let buildStrategy: BuildStrategy;

  beforeEach(() => {
    buildStrategy = new BuildStrategy({
      metadata: {
        namespace: "my-namespace",
        name: "namespaced-build-strategy"
      },
      spec: {
        parameters: [
          { name: "build-arg", description: "ARGS" },
          {
            name: "secrets",
            description: "Some secrets",
            type: "array",
            defaults: []
          }
        ],
        buildSteps: [
          {
            name: "build-and-push",
            image: "moby/buildkit:nightly-rootless",
            imagePullPolicy: "Always",
            workingDir: ".",
            command: ["/bin/bash"],
            args: ["-c", "echo hello world"],
            securityContext: {
              privileged: false
            },
            resources: {
              requests: {
                cpu: "250m",
                memory: "100Mi"
              },
              limits: {
                cpu: "500m",
                memory: "1Gi"
              }
            }
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(buildStrategy).toHaveProperty(
      "apiVersion",
      "shipwright.io/v1alpha1"
    );
  });

  it("should set kind", () => {
    expect(buildStrategy).toHaveProperty("kind", "BuildStrategy");
  });

  it("validate", () => {
    expect(() => buildStrategy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(buildStrategy.toJSON()).toEqual({
      apiVersion: "shipwright.io/v1alpha1",
      kind: "BuildStrategy",
      metadata: {
        namespace: "my-namespace",
        name: "namespaced-build-strategy"
      },
      spec: {
        parameters: [
          { name: "build-arg", description: "ARGS" },
          {
            name: "secrets",
            description: "Some secrets",
            type: "array",
            defaults: []
          }
        ],
        buildSteps: [
          {
            name: "build-and-push",
            image: "moby/buildkit:nightly-rootless",
            imagePullPolicy: "Always",
            workingDir: ".",
            command: ["/bin/bash"],
            args: ["-c", "echo hello world"],
            securityContext: {
              privileged: false
            },
            resources: {
              requests: {
                cpu: "250m",
                memory: "100Mi"
              },
              limits: {
                cpu: "500m",
                memory: "1Gi"
              }
            }
          }
        ]
      }
    });
  });
});

describe("ClusterBuildStrategy", () => {
  let buildStrategy: ClusterBuildStrategy;

  beforeEach(() => {
    buildStrategy = new ClusterBuildStrategy({
      metadata: {
        name: "namespaced-build-strategy"
      },
      spec: {
        parameters: [
          { name: "build-arg", description: "ARGS" },
          {
            name: "secrets",
            description: "Some secrets",
            type: "array",
            defaults: []
          }
        ],
        buildSteps: [
          {
            name: "build-and-push",
            image: "moby/buildkit:nightly-rootless",
            imagePullPolicy: "Always",
            workingDir: ".",
            command: ["/bin/bash"],
            args: ["-c", "echo hello world"],
            securityContext: {
              privileged: false
            },
            resources: {
              requests: {
                cpu: "250m",
                memory: "100Mi"
              },
              limits: {
                cpu: "500m",
                memory: "1Gi"
              }
            }
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(buildStrategy).toHaveProperty(
      "apiVersion",
      "shipwright.io/v1alpha1"
    );
  });

  it("should set kind", () => {
    expect(buildStrategy).toHaveProperty("kind", "ClusterBuildStrategy");
  });

  it("validate", () => {
    expect(() => buildStrategy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(buildStrategy.toJSON()).toEqual({
      apiVersion: "shipwright.io/v1alpha1",
      kind: "ClusterBuildStrategy",
      metadata: {
        name: "namespaced-build-strategy"
      },
      spec: {
        parameters: [
          { name: "build-arg", description: "ARGS" },
          {
            name: "secrets",
            description: "Some secrets",
            type: "array",
            defaults: []
          }
        ],
        buildSteps: [
          {
            name: "build-and-push",
            image: "moby/buildkit:nightly-rootless",
            imagePullPolicy: "Always",
            workingDir: ".",
            command: ["/bin/bash"],
            args: ["-c", "echo hello world"],
            securityContext: {
              privileged: false
            },
            resources: {
              requests: {
                cpu: "250m",
                memory: "100Mi"
              },
              limits: {
                cpu: "500m",
                memory: "1Gi"
              }
            }
          }
        ]
      }
    });
  });
});
