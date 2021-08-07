import { Application } from "../gen/argoproj.io/v1alpha1/Application";

describe("Application", () => {
  let app: Application;

  beforeEach(() => {
    app = new Application({
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
