import { describe, it, expect } from "vitest";
import { Composition } from "../gen/apiextensions.crossplane.io/v1/Composition.js";
import { CompositeResourceDefinition } from "../gen/apiextensions.crossplane.io/v1/CompositeResourceDefinition.js";
import { Provider } from "../gen/pkg.crossplane.io/v1/Provider.js";
import { Configuration } from "../gen/pkg.crossplane.io/v1/Configuration.js";
import { Function } from "../gen/pkg.crossplane.io/v1/Function.js";

describe("Composition", () => {
  const composition = new Composition({
    metadata: {
      name: "example-composition",
    },
    spec: {
      compositeTypeRef: {
        apiVersion: "example.org/v1",
        kind: "XExample",
      },
      mode: "Pipeline",
      pipeline: [
        {
          step: "render",
          functionRef: { name: "function-patch-and-transform" },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(composition).toHaveProperty(
      "apiVersion",
      "apiextensions.crossplane.io/v1",
    );
  });

  it("should set kind", () => {
    expect(composition).toHaveProperty("kind", "Composition");
  });

  it("validate", () => {
    expect(() => composition.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(composition.toJSON()).toEqual({
      apiVersion: "apiextensions.crossplane.io/v1",
      kind: "Composition",
      metadata: {
        name: "example-composition",
      },
      spec: {
        compositeTypeRef: {
          apiVersion: "example.org/v1",
          kind: "XExample",
        },
        mode: "Pipeline",
        pipeline: [
          {
            step: "render",
            functionRef: { name: "function-patch-and-transform" },
          },
        ],
      },
    });
  });
});

describe("CompositeResourceDefinition", () => {
  const xrd = new CompositeResourceDefinition({
    metadata: {
      name: "xexamples.example.org",
    },
    spec: {
      group: "example.org",
      names: {
        kind: "XExample",
        plural: "xexamples",
      },
      versions: [
        {
          name: "v1",
          served: true,
          referenceable: true,
          schema: {
            openAPIV3Schema: {
              type: "object",
            },
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(xrd).toHaveProperty("apiVersion", "apiextensions.crossplane.io/v1");
  });

  it("should set kind", () => {
    expect(xrd).toHaveProperty("kind", "CompositeResourceDefinition");
  });

  it("validate", () => {
    expect(() => xrd.validate()).not.toThrow();
  });
});

describe("Provider", () => {
  const provider = new Provider({
    metadata: {
      name: "provider-example",
    },
    spec: {
      package: "xpkg.crossplane.io/crossplane-contrib/provider-example:v0.1.0",
    },
  });

  it("should set apiVersion", () => {
    expect(provider).toHaveProperty("apiVersion", "pkg.crossplane.io/v1");
  });

  it("should set kind", () => {
    expect(provider).toHaveProperty("kind", "Provider");
  });

  it("validate", () => {
    expect(() => provider.validate()).not.toThrow();
  });
});

describe("Configuration", () => {
  const configuration = new Configuration({
    metadata: {
      name: "configuration-example",
    },
    spec: {
      package:
        "xpkg.crossplane.io/crossplane-contrib/configuration-example:v0.1.0",
    },
  });

  it("should set apiVersion", () => {
    expect(configuration).toHaveProperty("apiVersion", "pkg.crossplane.io/v1");
  });

  it("should set kind", () => {
    expect(configuration).toHaveProperty("kind", "Configuration");
  });

  it("validate", () => {
    expect(() => configuration.validate()).not.toThrow();
  });
});

describe("Function", () => {
  const fn = new Function({
    metadata: {
      name: "function-patch-and-transform",
    },
    spec: {
      package:
        "xpkg.crossplane.io/crossplane-contrib/function-patch-and-transform:v0.1.0",
    },
  });

  it("should set apiVersion", () => {
    expect(fn).toHaveProperty("apiVersion", "pkg.crossplane.io/v1");
  });

  it("should set kind", () => {
    expect(fn).toHaveProperty("kind", "Function");
  });

  it("validate", () => {
    expect(() => fn.validate()).not.toThrow();
  });
});
