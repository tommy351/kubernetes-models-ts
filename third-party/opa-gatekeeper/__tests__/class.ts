import { describe, it, expect } from "vitest";
import { ConstraintTemplate } from "../gen/templates.gatekeeper.sh/v1/ConstraintTemplate.js";
import { AssignMetadata } from "../gen/mutations.gatekeeper.sh/v1/AssignMetadata.js";
import { Assign } from "../gen/mutations.gatekeeper.sh/v1/Assign.js";
import { Config } from "../gen/config.gatekeeper.sh/v1alpha1/Config.js";
import { Provider } from "../gen/externaldata.gatekeeper.sh/v1beta1/Provider.js";
import { ExpansionTemplate } from "../gen/expansion.gatekeeper.sh/v1beta1/ExpansionTemplate.js";
import { SyncSet } from "../gen/syncset.gatekeeper.sh/v1alpha1/SyncSet.js";

describe("ConstraintTemplate", () => {
  const template = new ConstraintTemplate({
    metadata: {
      name: "k8srequiredlabels",
    },
    spec: {
      crd: {
        spec: {
          names: {
            kind: "K8sRequiredLabels",
          },
          validation: {
            openAPIV3Schema: {},
          },
        },
      },
      targets: [
        {
          target: "admission.k8s.gatekeeper.sh",
          rego: 'package k8srequiredlabels\nviolation[{"msg": msg}] { msg := "test" }',
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(template).toHaveProperty("apiVersion", "templates.gatekeeper.sh/v1");
  });

  it("should set kind", () => {
    expect(template).toHaveProperty("kind", "ConstraintTemplate");
  });

  it("validate", () => {
    expect(() => template.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(template.toJSON()).toEqual({
      apiVersion: "templates.gatekeeper.sh/v1",
      kind: "ConstraintTemplate",
      metadata: {
        name: "k8srequiredlabels",
      },
      spec: {
        crd: {
          spec: {
            names: {
              kind: "K8sRequiredLabels",
            },
            validation: {
              openAPIV3Schema: {},
            },
          },
        },
        targets: [
          {
            target: "admission.k8s.gatekeeper.sh",
            rego: 'package k8srequiredlabels\nviolation[{"msg": msg}] { msg := "test" }',
          },
        ],
      },
    });
  });
});

describe("AssignMetadata", () => {
  const am = new AssignMetadata({
    metadata: {
      name: "demo-annotation-owner",
    },
    spec: {
      match: {
        scope: "Namespaced",
        kinds: [
          {
            apiGroups: ["*"],
            kinds: ["Pod"],
          },
        ],
      },
      location: "metadata.annotations.owner",
      parameters: {
        assign: {
          value: "admin",
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(am).toHaveProperty("apiVersion", "mutations.gatekeeper.sh/v1");
  });

  it("should set kind", () => {
    expect(am).toHaveProperty("kind", "AssignMetadata");
  });

  it("validate", () => {
    expect(() => am.validate()).not.toThrow();
  });
});

describe("Assign", () => {
  const assign = new Assign({
    metadata: {
      name: "always-pull-image",
    },
    spec: {
      applyTo: [
        {
          groups: [""],
          kinds: ["Pod"],
          versions: ["v1"],
        },
      ],
      match: {
        scope: "Namespaced",
        kinds: [
          {
            apiGroups: [""],
            kinds: ["Pod"],
          },
        ],
      },
      location: "spec.containers[name:*].imagePullPolicy",
      parameters: {
        assign: {
          value: "Always",
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(assign).toHaveProperty("apiVersion", "mutations.gatekeeper.sh/v1");
  });

  it("should set kind", () => {
    expect(assign).toHaveProperty("kind", "Assign");
  });

  it("validate", () => {
    expect(() => assign.validate()).not.toThrow();
  });
});

describe("Config", () => {
  const config = new Config({
    metadata: {
      name: "config",
      namespace: "gatekeeper-system",
    },
    spec: {
      sync: {
        syncOnly: [
          {
            group: "",
            version: "v1",
            kind: "Namespace",
          },
        ],
      },
    },
  });

  it("should set apiVersion", () => {
    expect(config).toHaveProperty(
      "apiVersion",
      "config.gatekeeper.sh/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(config).toHaveProperty("kind", "Config");
  });

  it("validate", () => {
    expect(() => config.validate()).not.toThrow();
  });
});

describe("Provider", () => {
  const provider = new Provider({
    metadata: {
      name: "dummy-provider",
    },
    spec: {
      url: "https://example.com/validate",
      timeout: 1,
      caBundle: "Cg==",
    },
  });

  it("should set apiVersion", () => {
    expect(provider).toHaveProperty(
      "apiVersion",
      "externaldata.gatekeeper.sh/v1beta1",
    );
  });

  it("should set kind", () => {
    expect(provider).toHaveProperty("kind", "Provider");
  });

  it("validate", () => {
    expect(() => provider.validate()).not.toThrow();
  });
});

describe("ExpansionTemplate", () => {
  const et = new ExpansionTemplate({
    metadata: {
      name: "expand-deployments",
    },
    spec: {
      applyTo: [
        {
          groups: ["apps"],
          kinds: ["Deployment"],
          versions: ["v1"],
        },
      ],
      templateSource: "spec.template",
      generatedGVK: {
        group: "",
        kind: "Pod",
        version: "v1",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(et).toHaveProperty("apiVersion", "expansion.gatekeeper.sh/v1beta1");
  });

  it("should set kind", () => {
    expect(et).toHaveProperty("kind", "ExpansionTemplate");
  });

  it("validate", () => {
    expect(() => et.validate()).not.toThrow();
  });
});

describe("SyncSet", () => {
  const syncSet = new SyncSet({
    metadata: {
      name: "default-syncset",
    },
    spec: {
      gvks: [
        {
          group: "",
          version: "v1",
          kind: "Namespace",
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(syncSet).toHaveProperty(
      "apiVersion",
      "syncset.gatekeeper.sh/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(syncSet).toHaveProperty("kind", "SyncSet");
  });

  it("validate", () => {
    expect(() => syncSet.validate()).not.toThrow();
  });
});
