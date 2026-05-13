import { describe, it, expect } from "vitest";
import { VaultAuth } from "../gen/secrets.hashicorp.com/v1beta1/VaultAuth.js";
import { VaultConnection } from "../gen/secrets.hashicorp.com/v1beta1/VaultConnection.js";
import { VaultStaticSecret } from "../gen/secrets.hashicorp.com/v1beta1/VaultStaticSecret.js";
import { VaultDynamicSecret } from "../gen/secrets.hashicorp.com/v1beta1/VaultDynamicSecret.js";
import { HCPAuth } from "../gen/secrets.hashicorp.com/v1beta1/HCPAuth.js";
import { HCPVaultSecretsApp } from "../gen/secrets.hashicorp.com/v1beta1/HCPVaultSecretsApp.js";

describe("VaultAuth", () => {
  const auth = new VaultAuth({
    metadata: {
      name: "default",
      namespace: "vso-system",
    },
    spec: {
      vaultConnectionRef: "default",
      method: "kubernetes",
      mount: "kubernetes",
      kubernetes: {
        role: "vso-role",
        serviceAccount: "default",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(auth).toHaveProperty("apiVersion", "secrets.hashicorp.com/v1beta1");
  });

  it("should set kind", () => {
    expect(auth).toHaveProperty("kind", "VaultAuth");
  });

  it("validate", () => {
    expect(() => auth.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(auth.toJSON()).toEqual({
      apiVersion: "secrets.hashicorp.com/v1beta1",
      kind: "VaultAuth",
      metadata: {
        name: "default",
        namespace: "vso-system",
      },
      spec: {
        vaultConnectionRef: "default",
        method: "kubernetes",
        mount: "kubernetes",
        kubernetes: {
          role: "vso-role",
          serviceAccount: "default",
        },
      },
    });
  });
});

describe("VaultConnection", () => {
  const conn = new VaultConnection({
    metadata: {
      name: "default",
      namespace: "vso-system",
    },
    spec: {
      address: "http://vault.vault.svc.cluster.local:8200",
      skipTLSVerify: false,
    },
  });

  it("should set apiVersion", () => {
    expect(conn).toHaveProperty("apiVersion", "secrets.hashicorp.com/v1beta1");
  });

  it("should set kind", () => {
    expect(conn).toHaveProperty("kind", "VaultConnection");
  });

  it("validate", () => {
    expect(() => conn.validate()).not.toThrow();
  });
});

describe("VaultStaticSecret", () => {
  const secret = new VaultStaticSecret({
    metadata: {
      name: "example",
      namespace: "default",
    },
    spec: {
      vaultAuthRef: "default",
      mount: "kv",
      path: "app/config",
      type: "kv-v2",
      refreshAfter: "30s",
      destination: {
        name: "example-k8s-secret",
        create: true,
      },
    },
  });

  it("should set apiVersion", () => {
    expect(secret).toHaveProperty(
      "apiVersion",
      "secrets.hashicorp.com/v1beta1",
    );
  });

  it("should set kind", () => {
    expect(secret).toHaveProperty("kind", "VaultStaticSecret");
  });

  it("validate", () => {
    expect(() => secret.validate()).not.toThrow();
  });
});

describe("VaultDynamicSecret", () => {
  const secret = new VaultDynamicSecret({
    metadata: {
      name: "example",
      namespace: "default",
    },
    spec: {
      vaultAuthRef: "default",
      mount: "database",
      path: "creds/app-role",
      destination: {
        name: "example-db-creds",
        create: true,
      },
    },
  });

  it("should set apiVersion", () => {
    expect(secret).toHaveProperty(
      "apiVersion",
      "secrets.hashicorp.com/v1beta1",
    );
  });

  it("should set kind", () => {
    expect(secret).toHaveProperty("kind", "VaultDynamicSecret");
  });

  it("validate", () => {
    expect(() => secret.validate()).not.toThrow();
  });
});

describe("HCPAuth", () => {
  const auth = new HCPAuth({
    metadata: {
      name: "default",
      namespace: "vso-system",
    },
    spec: {
      organizationID: "org-id",
      projectID: "project-id",
      servicePrincipal: {
        secretRef: "hcp-sp",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(auth).toHaveProperty("apiVersion", "secrets.hashicorp.com/v1beta1");
  });

  it("should set kind", () => {
    expect(auth).toHaveProperty("kind", "HCPAuth");
  });

  it("validate", () => {
    expect(() => auth.validate()).not.toThrow();
  });
});

describe("HCPVaultSecretsApp", () => {
  const app = new HCPVaultSecretsApp({
    metadata: {
      name: "example",
      namespace: "default",
    },
    spec: {
      appName: "my-app",
      destination: {
        name: "example-hvs-secret",
        create: true,
      },
    },
  });

  it("should set apiVersion", () => {
    expect(app).toHaveProperty("apiVersion", "secrets.hashicorp.com/v1beta1");
  });

  it("should set kind", () => {
    expect(app).toHaveProperty("kind", "HCPVaultSecretsApp");
  });

  it("validate", () => {
    expect(() => app.validate()).not.toThrow();
  });
});
