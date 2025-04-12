import { describe, it, expect, beforeEach } from "vitest";
import { Repository } from "../gen/pipelinesascode.tekton.dev/v1alpha1/Repository";

describe("Repository", () => {
  let repository: Repository;

  beforeEach(() => {
    repository = new Repository({
      metadata: {
        name: "test-repository"
      },
      spec: {
        url: "https://github.com/linda/project"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(repository).toHaveProperty(
      "apiVersion",
      "pipelinesascode.tekton.dev/v1alpha1"
    );
  });

  it("should set kind", () => {
    expect(repository).toHaveProperty("kind", "Repository");
  });

  it("validate", () => {
    expect(() => repository.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(repository.toJSON()).toEqual({
      apiVersion: "pipelinesascode.tekton.dev/v1alpha1",
      kind: "Repository",
      metadata: {
        name: "test-repository"
      },
      spec: {
        url: "https://github.com/linda/project"
      }
    });
  });

  it("should support type", () => {
    if (repository.spec) {
      repository.spec.type = "github";
    }
    expect(() => repository.validate()).not.toThrow();
  });

  it("should support concurrency_limit", () => {
    if (repository.spec) {
      repository.spec.concurrency_limit = 3;
    }
    expect(() => repository.validate()).not.toThrow();
  });

  it("should support different parameters", () => {
    if (repository.spec) {
      repository.spec.params = [
        { name: "company", value: "My Beautiful Company" },
        {
          name: "company",
          secret_ref: { name: "my-secret", key: "companyname" }
        },
        {
          name: "company",
          value: "My Beautiful Company",
          filter: 'pac.event_type == "pull_request"'
        }
      ];
    }
    expect(() => repository.validate()).not.toThrow();
  });

  it("should support settings", () => {
    if (repository.spec) {
      repository.spec.settings = {
        github_app_token_scope_repos: ["owner/project", "owner1/project1"]
      };
    }
    expect(() => repository.validate()).not.toThrow();
  });

  it("should support git_providers", () => {
    if (repository.spec) {
      repository.spec.git_provider = {
        user: "bot",
        secret: {
          name: "my-secret",
          key: "repo-secret"
        },
        webhook_secret: {
          name: "my-secret",
          key: "webhook-secret"
        }
      };
    }
    expect(() => repository.validate()).not.toThrow();
  });
});
