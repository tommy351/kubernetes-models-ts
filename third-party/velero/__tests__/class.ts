import { describe, it, expect } from "vitest";
import { Backup } from "../gen/velero.io/v1/Backup.js";
import { Restore } from "../gen/velero.io/v1/Restore.js";
import { Schedule } from "../gen/velero.io/v1/Schedule.js";
import { BackupStorageLocation } from "../gen/velero.io/v1/BackupStorageLocation.js";
import { VolumeSnapshotLocation } from "../gen/velero.io/v1/VolumeSnapshotLocation.js";
import { DataUpload } from "../gen/velero.io/v2alpha1/DataUpload.js";

describe("Backup", () => {
  const backup = new Backup({
    metadata: {
      name: "example-backup",
      namespace: "velero",
    },
    spec: {
      includedNamespaces: ["default"],
      storageLocation: "default",
      ttl: "720h0m0s",
    },
  });

  it("should set apiVersion", () => {
    expect(backup).toHaveProperty("apiVersion", "velero.io/v1");
  });

  it("should set kind", () => {
    expect(backup).toHaveProperty("kind", "Backup");
  });

  it("validate", () => {
    expect(() => backup.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(backup.toJSON()).toEqual({
      apiVersion: "velero.io/v1",
      kind: "Backup",
      metadata: {
        name: "example-backup",
        namespace: "velero",
      },
      spec: {
        includedNamespaces: ["default"],
        storageLocation: "default",
        ttl: "720h0m0s",
      },
    });
  });
});

describe("Restore", () => {
  const restore = new Restore({
    metadata: {
      name: "example-restore",
      namespace: "velero",
    },
    spec: {
      backupName: "example-backup",
      includedNamespaces: ["default"],
    },
  });

  it("should set apiVersion", () => {
    expect(restore).toHaveProperty("apiVersion", "velero.io/v1");
  });

  it("should set kind", () => {
    expect(restore).toHaveProperty("kind", "Restore");
  });

  it("validate", () => {
    expect(() => restore.validate()).not.toThrow();
  });
});

describe("Schedule", () => {
  const schedule = new Schedule({
    metadata: {
      name: "example-schedule",
      namespace: "velero",
    },
    spec: {
      schedule: "0 7 * * *",
      template: {
        includedNamespaces: ["default"],
        ttl: "720h0m0s",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(schedule).toHaveProperty("apiVersion", "velero.io/v1");
  });

  it("should set kind", () => {
    expect(schedule).toHaveProperty("kind", "Schedule");
  });

  it("validate", () => {
    expect(() => schedule.validate()).not.toThrow();
  });
});

describe("BackupStorageLocation", () => {
  const bsl = new BackupStorageLocation({
    metadata: {
      name: "default",
      namespace: "velero",
    },
    spec: {
      provider: "aws",
      objectStorage: {
        bucket: "velero-backups",
      },
      config: {
        region: "us-east-1",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(bsl).toHaveProperty("apiVersion", "velero.io/v1");
  });

  it("should set kind", () => {
    expect(bsl).toHaveProperty("kind", "BackupStorageLocation");
  });

  it("validate", () => {
    expect(() => bsl.validate()).not.toThrow();
  });
});

describe("VolumeSnapshotLocation", () => {
  const vsl = new VolumeSnapshotLocation({
    metadata: {
      name: "default",
      namespace: "velero",
    },
    spec: {
      provider: "aws",
      config: {
        region: "us-east-1",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(vsl).toHaveProperty("apiVersion", "velero.io/v1");
  });

  it("should set kind", () => {
    expect(vsl).toHaveProperty("kind", "VolumeSnapshotLocation");
  });

  it("validate", () => {
    expect(() => vsl.validate()).not.toThrow();
  });
});

describe("DataUpload", () => {
  const dataUpload = new DataUpload({
    metadata: {
      name: "example-data-upload",
      namespace: "velero",
    },
    spec: {
      snapshotType: "CSI",
      backupStorageLocation: "default",
      sourceNamespace: "default",
      sourcePVC: "example-pvc",
      operationTimeout: "10m0s",
    },
  });

  it("should set apiVersion", () => {
    expect(dataUpload).toHaveProperty("apiVersion", "velero.io/v2alpha1");
  });

  it("should set kind", () => {
    expect(dataUpload).toHaveProperty("kind", "DataUpload");
  });

  it("validate", () => {
    expect(() => dataUpload.validate()).not.toThrow();
  });
});
