import { GitRepository } from "../gen/source.toolkit.fluxcd.io/v1beta1/GitRepository";

describe("Application", () => {
  let repo: GitRepository;

  beforeEach(() => {
    repo = new GitRepository({
      metadata: {
        name: "webapp"
      },
      spec: {
        interval: "60m",
        url: "https://github.com/tommy351/kubernetes-models-ts",
        ref: {
          branch: "master"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(repo).toHaveProperty(
      "apiVersion",
      "source.toolkit.fluxcd.io/v1beta1"
    );
  });

  it("should set kind", () => {
    expect(repo).toHaveProperty("kind", "GitRepository");
  });

  it("validate", () => {
    expect(() => repo.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(repo.toJSON()).toEqual({
      apiVersion: "source.toolkit.fluxcd.io/v1beta1",
      kind: "GitRepository",
      metadata: {
        name: "webapp"
      },
      spec: {
        interval: "60m",
        url: "https://github.com/tommy351/kubernetes-models-ts",
        ref: {
          branch: "master"
        }
      }
    });
  });
});
