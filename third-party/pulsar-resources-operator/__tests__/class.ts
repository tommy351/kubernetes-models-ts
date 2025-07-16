import { describe, it, expect, beforeEach } from "vitest";
import { PulsarTenant } from "../gen/resource.streamnative.io/v1alpha1/PulsarTenant";

describe("PulsarTenant", () => {
  let tenant: PulsarTenant;

  beforeEach(() => {
    tenant = new PulsarTenant({
      metadata: {
        name: "example"
      },
      spec: {
        name: "example-tenant",
        connectionRef: {
          name: "example-connection"
        },
        adminRoles: ["admin", "ops"],
        lifecyclePolicy: "CleanUpAfterDeletion"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(tenant).toHaveProperty(
      "apiVersion",
      "resource.streamnative.io/v1alpha1"
    );
  });

  it("should set kind", () => {
    expect(tenant).toHaveProperty("kind", "PulsarTenant");
  });

  it("validate", () => {
    expect(() => tenant.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(tenant.toJSON()).toEqual({
      apiVersion: "resource.streamnative.io/v1alpha1",
      kind: "PulsarTenant",
      metadata: {
        name: "example"
      },
      spec: {
        name: "example-tenant",
        connectionRef: {
          name: "example-connection"
        },
        adminRoles: ["admin", "ops"],
        lifecyclePolicy: "CleanUpAfterDeletion"
      }
    });
  });
});
