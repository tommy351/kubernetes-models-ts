import { describe, it, expect, beforeEach } from "vitest";
import { PostgresCluster } from "../gen/postgres-operator.crunchydata.com/v1beta1/PostgresCluster";
import { postgresql } from "../gen/acid.zalan.do/v1/postgresql";

describe("PostgresCluster", () => {
  let cluster: PostgresCluster;

  beforeEach(() => {
    cluster = new PostgresCluster({
      metadata: { name: "example" },
      spec: {
        image:
          "registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.5-1",
        postgresVersion: 14,
        instances: [
          {
            name: "instance1",
            dataVolumeClaimSpec: {
              accessModes: ["ReadWriteOnce"],
              resources: {
                requests: {
                  storage: "1Gi"
                }
              }
            }
          }
        ],
        backups: {
          pgbackrest: {
            image:
              "registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.40-1",
            repos: [
              {
                name: "repo1",
                volume: {
                  volumeClaimSpec: {
                    accessModes: ["ReadWriteOnce"],
                    resources: {
                      requests: {
                        storage: "1Gi"
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty(
      "apiVersion",
      "postgres-operator.crunchydata.com/v1beta1"
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
      metadata: { name: "example" },
      spec: {
        image:
          "registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.5-1",
        postgresVersion: 14,
        instances: [
          {
            name: "instance1",
            dataVolumeClaimSpec: {
              accessModes: ["ReadWriteOnce"],
              resources: {
                requests: {
                  storage: "1Gi"
                }
              }
            }
          }
        ],
        backups: {
          pgbackrest: {
            image:
              "registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.40-1",
            repos: [
              {
                name: "repo1",
                volume: {
                  volumeClaimSpec: {
                    accessModes: ["ReadWriteOnce"],
                    resources: {
                      requests: {
                        storage: "1Gi"
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      }
    });
  });
});

describe("postgresql", () => {
  let cluster: postgresql;

  beforeEach(() => {
    cluster = new postgresql({
      metadata: {
        name: "example"
      },
      spec: {
        teamId: "acid",
        volume: {
          size: "1Gi"
        },
        numberOfInstances: 2,
        users: {
          zalando: ["superuser", "createdb"]
        },
        databases: {
          foo: "zalando"
        },
        preparedDatabases: {
          bar: {}
        },
        postgresql: {
          version: "14"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "acid.zalan.do/v1");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "postgresql");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "acid.zalan.do/v1",
      kind: "postgresql",
      metadata: {
        name: "example"
      },
      spec: {
        teamId: "acid",
        volume: {
          size: "1Gi"
        },
        numberOfInstances: 2,
        users: {
          zalando: ["superuser", "createdb"]
        },
        databases: {
          foo: "zalando"
        },
        preparedDatabases: {
          bar: {}
        },
        postgresql: {
          version: "14"
        }
      }
    });
  });
});
