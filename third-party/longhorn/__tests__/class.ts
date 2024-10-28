import { describe, it, expect, beforeEach } from "vitest";
import { Backup } from "../gen/longhorn.io/v1beta1/Backup";

describe("Application", () => {
  let backup: Backup;

  beforeEach(() => {
    backup = new Backup({
      metadata: {
        name: "backup"
      },
      spec: {
        backupMode: "incremental",
        snapshotName: "snapshot-name-example",
        labels: {
          app: "test"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(backup).toHaveProperty("apiVersion", "longhorn.io/v1beta1");
  });

  it("should set kind", () => {
    expect(backup).toHaveProperty("kind", "Backup");
  });

  it("validate", () => {
    expect(() => backup.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(backup.toJSON()).toEqual({
      apiVersion: "longhorn.io/v1beta1",
      kind: "Backup",
      metadata: {
        name: "backup"
      },
      spec: {
        backupMode: "incremental",
        snapshotName: "snapshot-name-example",
        labels: {
          app: "test"
        }
      }
    });
  });
});
