import { describe, it, expect } from "vitest";
import { PostgresCluster } from "../gen/postgres-operator.crunchydata.com/v1beta1/PostgresCluster.js";
import { PostgresCluster as PostgresClusterV1 } from "../gen/postgres-operator.crunchydata.com/v1/PostgresCluster.js";
import { PGUpgrade } from "../gen/postgres-operator.crunchydata.com/v1beta1/PGUpgrade.js";
import { PGAdmin } from "../gen/postgres-operator.crunchydata.com/v1beta1/PGAdmin.js";

describe("PostgresCluster (v1beta1)", () => {
  const cluster = new PostgresCluster({
    metadata: {
      name: "hippo",
      namespace: "default",
    },
    spec: {
      postgresVersion: 16,
      instances: [
        {
          dataVolumeClaimSpec: {
            accessModes: ["ReadWriteOnce"],
            resources: {
              requests: {
                storage: "1Gi",
              },
            },
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty(
      "apiVersion",
      "postgres-operator.crunchydata.com/v1beta1",
    );
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "PostgresCluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "postgres-operator.crunchydata.com/v1beta1",
      kind: "PostgresCluster",
      metadata: {
        name: "hippo",
        namespace: "default",
      },
      spec: {
        postgresVersion: 16,
        instances: [
          {
            dataVolumeClaimSpec: {
              accessModes: ["ReadWriteOnce"],
              resources: {
                requests: {
                  storage: "1Gi",
                },
              },
            },
          },
        ],
      },
    });
  });
});

describe("PostgresCluster (v1)", () => {
  const cluster = new PostgresClusterV1({
    metadata: {
      name: "hippo",
      namespace: "default",
    },
    spec: {
      postgresVersion: 17,
      instances: [
        {
          dataVolumeClaimSpec: {
            accessModes: ["ReadWriteOnce"],
            resources: {
              requests: {
                storage: "1Gi",
              },
            },
          },
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty(
      "apiVersion",
      "postgres-operator.crunchydata.com/v1",
    );
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "PostgresCluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });
});

describe("PGUpgrade", () => {
  const upgrade = new PGUpgrade({
    metadata: {
      name: "hippo-upgrade",
      namespace: "default",
    },
    spec: {
      fromPostgresVersion: 15,
      toPostgresVersion: 16,
      postgresClusterName: "hippo",
    },
  });

  it("should set apiVersion", () => {
    expect(upgrade).toHaveProperty(
      "apiVersion",
      "postgres-operator.crunchydata.com/v1beta1",
    );
  });

  it("should set kind", () => {
    expect(upgrade).toHaveProperty("kind", "PGUpgrade");
  });

  it("validate", () => {
    expect(() => upgrade.validate()).not.toThrow();
  });
});

describe("PGAdmin", () => {
  const admin = new PGAdmin({
    metadata: {
      name: "pgadmin",
      namespace: "default",
    },
    spec: {
      dataVolumeClaimSpec: {
        accessModes: ["ReadWriteOnce"],
        resources: {
          requests: {
            storage: "1Gi",
          },
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(admin).toHaveProperty(
      "apiVersion",
      "postgres-operator.crunchydata.com/v1beta1",
    );
  });

  it("should set kind", () => {
    expect(admin).toHaveProperty("kind", "PGAdmin");
  });

  it("validate", () => {
    expect(() => admin.validate()).not.toThrow();
  });
});
