import { describe, it, expect } from "vitest";
import { Application } from "../gen/argoproj.io/v1alpha1/Application.js";
import { ApplicationSet } from "../gen/argoproj.io/v1alpha1/ApplicationSet.js";
import { AppProject } from "../gen/argoproj.io/v1alpha1/AppProject.js";

describe("Application", () => {
  const app = new Application({
    metadata: {
      name: "guestbook"
    },
    spec: {
      project: "default",
      source: {
        repoURL: "https://github.com/argoproj/argocd-example-apps.git",
        targetRevision: "HEAD",
        path: "guestbook"
      },
      destination: {
        server: "https://kubernetes.default.svc",
        namespace: "guestbook"
      }
    }
  });

  it("should set apiVersion", () => {
    expect(app).toHaveProperty("apiVersion", "argoproj.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(app).toHaveProperty("kind", "Application");
  });

  it("validate", () => {
    expect(() => app.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(app.toJSON()).toEqual({
      apiVersion: "argoproj.io/v1alpha1",
      kind: "Application",
      metadata: {
        name: "guestbook"
      },
      spec: {
        project: "default",
        source: {
          repoURL: "https://github.com/argoproj/argocd-example-apps.git",
          targetRevision: "HEAD",
          path: "guestbook"
        },
        destination: {
          server: "https://kubernetes.default.svc",
          namespace: "guestbook"
        }
      }
    });
  });
});

describe("ApplicationSet", () => {
  const app = new ApplicationSet({
    metadata: {
      name: "guestbook"
    },
    spec: {
      generators: [
        {
          list: {
            elements: [
              {
                cluster: "engineering-dev",
                url: "https://1.2.3.4"
              }
            ]
          }
        }
      ],
      template: {
        metadata: {
          name: "{{cluster}}-guestbook"
        },
        spec: {
          project: "default",
          source: {
            repoURL: "https://github.com/argoproj/argo-cd.git"
          },
          destination: {
            server: "{{url}}"
          }
        }
      }
    }
  });

  it("should set apiVersion", () => {
    expect(app).toHaveProperty("apiVersion", "argoproj.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(app).toHaveProperty("kind", "ApplicationSet");
  });

  it("validate", () => {
    expect(() => app.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(app.toJSON()).toEqual({
      apiVersion: "argoproj.io/v1alpha1",
      kind: "ApplicationSet",
      metadata: {
        name: "guestbook"
      },
      spec: {
        generators: [
          {
            list: {
              elements: [
                {
                  cluster: "engineering-dev",
                  url: "https://1.2.3.4"
                }
              ]
            }
          }
        ],
        template: {
          metadata: {
            name: "{{cluster}}-guestbook"
          },
          spec: {
            project: "default",
            source: {
              repoURL: "https://github.com/argoproj/argo-cd.git"
            },
            destination: {
              server: "{{url}}"
            }
          }
        }
      }
    });
  });
});

describe("AppProject", () => {
  const app = new AppProject({
    metadata: {
      name: "guestbook"
    },
    spec: {
      description: "Example project"
    }
  });

  it("should set apiVersion", () => {
    expect(app).toHaveProperty("apiVersion", "argoproj.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(app).toHaveProperty("kind", "AppProject");
  });

  it("validate", () => {
    expect(() => app.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(app.toJSON()).toEqual({
      apiVersion: "argoproj.io/v1alpha1",
      kind: "AppProject",
      metadata: {
        name: "guestbook"
      },
      spec: {
        description: "Example project"
      }
    });
  });
});
