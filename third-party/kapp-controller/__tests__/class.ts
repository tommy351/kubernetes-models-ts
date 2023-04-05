import { describe, it, expect, beforeEach } from "vitest";
import { App } from "../gen/kappctrl.k14s.io/v1alpha1/App";

describe("App", () => {
  let app: App;

  beforeEach(() => {
    app = new App({
      metadata: { name: "hello" },
      spec: {
        serviceAccountName: "default-ns-sa",
        fetch: [
          {
            git: {
              url: "https://github.com/vmware-tanzu/carvel-simple-app-on-kubernetes",
              ref: "origin/develop",
              subPath: "config-step-2-template"
            }
          }
        ],
        template: [{ ytt: {} }],
        deploy: [{ kapp: {} }]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(app).toHaveProperty("apiVersion", "kappctrl.k14s.io/v1alpha1");
  });

  it("should set kind", () => {
    expect(app).toHaveProperty("kind", "App");
  });

  it("validate", () => {
    expect(() => app.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(app.toJSON()).toEqual({
      apiVersion: "kappctrl.k14s.io/v1alpha1",
      kind: "App",
      metadata: { name: "hello" },
      spec: {
        serviceAccountName: "default-ns-sa",
        fetch: [
          {
            git: {
              url: "https://github.com/vmware-tanzu/carvel-simple-app-on-kubernetes",
              ref: "origin/develop",
              subPath: "config-step-2-template"
            }
          }
        ],
        template: [{ ytt: {} }],
        deploy: [{ kapp: {} }]
      }
    });
  });
});
