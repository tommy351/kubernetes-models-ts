import { describe, it, expect } from "vitest";
import { VolumeSnapshot } from "../gen/snapshot.storage.k8s.io/v1/VolumeSnapshot.js";
import { VolumeSnapshotClass } from "../gen/snapshot.storage.k8s.io/v1/VolumeSnapshotClass.js";
import { VolumeSnapshotContent } from "../gen/snapshot.storage.k8s.io/v1/VolumeSnapshotContent.js";
import { VolumeGroupSnapshot } from "../gen/groupsnapshot.storage.k8s.io/v1beta2/VolumeGroupSnapshot.js";
import { VolumeGroupSnapshotClass } from "../gen/groupsnapshot.storage.k8s.io/v1beta2/VolumeGroupSnapshotClass.js";
import { VolumeGroupSnapshot as VolumeGroupSnapshotV1beta1 } from "../gen/groupsnapshot.storage.k8s.io/v1beta1/VolumeGroupSnapshot.js";

describe("VolumeSnapshot", () => {
  const snapshot = new VolumeSnapshot({
    metadata: {
      name: "new-snapshot-test",
      namespace: "default",
    },
    spec: {
      volumeSnapshotClassName: "csi-hostpath-snapclass",
      source: {
        persistentVolumeClaimName: "pvc-test",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(snapshot).toHaveProperty("apiVersion", "snapshot.storage.k8s.io/v1");
  });

  it("should set kind", () => {
    expect(snapshot).toHaveProperty("kind", "VolumeSnapshot");
  });

  it("validate", () => {
    expect(() => snapshot.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(snapshot.toJSON()).toEqual({
      apiVersion: "snapshot.storage.k8s.io/v1",
      kind: "VolumeSnapshot",
      metadata: {
        name: "new-snapshot-test",
        namespace: "default",
      },
      spec: {
        volumeSnapshotClassName: "csi-hostpath-snapclass",
        source: {
          persistentVolumeClaimName: "pvc-test",
        },
      },
    });
  });
});

describe("VolumeSnapshotClass", () => {
  const snapClass = new VolumeSnapshotClass({
    metadata: {
      name: "csi-hostpath-snapclass",
    },
    driver: "hostpath.csi.k8s.io",
    deletionPolicy: "Delete",
    parameters: {
      "csi.storage.k8s.io/snapshotter-secret-name": "snapshot-secret",
      "csi.storage.k8s.io/snapshotter-secret-namespace": "default",
    },
  });

  it("should set apiVersion", () => {
    expect(snapClass).toHaveProperty(
      "apiVersion",
      "snapshot.storage.k8s.io/v1",
    );
  });

  it("should set kind", () => {
    expect(snapClass).toHaveProperty("kind", "VolumeSnapshotClass");
  });

  it("validate", () => {
    expect(() => snapClass.validate()).not.toThrow();
  });
});

describe("VolumeSnapshotContent", () => {
  const content = new VolumeSnapshotContent({
    metadata: {
      name: "new-snapshot-content-test",
    },
    spec: {
      deletionPolicy: "Delete",
      driver: "hostpath.csi.k8s.io",
      source: {
        snapshotHandle: "7bdd0de3-aaeb-11e8-9aae-0242ac110002",
      },
      volumeSnapshotRef: {
        name: "new-snapshot-test",
        namespace: "default",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(content).toHaveProperty("apiVersion", "snapshot.storage.k8s.io/v1");
  });

  it("should set kind", () => {
    expect(content).toHaveProperty("kind", "VolumeSnapshotContent");
  });

  it("validate", () => {
    expect(() => content.validate()).not.toThrow();
  });
});

describe("VolumeGroupSnapshot", () => {
  const groupSnapshot = new VolumeGroupSnapshot({
    metadata: {
      name: "new-group-snapshot-test",
      namespace: "default",
    },
    spec: {
      volumeGroupSnapshotClassName: "csi-hostpath-groupsnapclass",
      source: {
        selector: {
          matchLabels: {
            group: "group1",
          },
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(groupSnapshot).toHaveProperty(
      "apiVersion",
      "groupsnapshot.storage.k8s.io/v1beta2",
    );
  });

  it("should set kind", () => {
    expect(groupSnapshot).toHaveProperty("kind", "VolumeGroupSnapshot");
  });

  it("validate", () => {
    expect(() => groupSnapshot.validate()).not.toThrow();
  });
});

describe("VolumeGroupSnapshotClass", () => {
  const groupSnapClass = new VolumeGroupSnapshotClass({
    metadata: {
      name: "csi-hostpath-groupsnapclass",
    },
    driver: "hostpath.csi.k8s.io",
    deletionPolicy: "Delete",
  });

  it("should set apiVersion", () => {
    expect(groupSnapClass).toHaveProperty(
      "apiVersion",
      "groupsnapshot.storage.k8s.io/v1beta2",
    );
  });

  it("should set kind", () => {
    expect(groupSnapClass).toHaveProperty("kind", "VolumeGroupSnapshotClass");
  });

  it("validate", () => {
    expect(() => groupSnapClass.validate()).not.toThrow();
  });
});

describe("VolumeGroupSnapshot v1beta1", () => {
  const groupSnapshot = new VolumeGroupSnapshotV1beta1({
    metadata: {
      name: "legacy-group-snapshot-test",
      namespace: "default",
    },
    spec: {
      volumeGroupSnapshotClassName: "csi-hostpath-groupsnapclass",
      source: {
        selector: {
          matchLabels: {
            group: "group1",
          },
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(groupSnapshot).toHaveProperty(
      "apiVersion",
      "groupsnapshot.storage.k8s.io/v1beta1",
    );
  });

  it("should set kind", () => {
    expect(groupSnapshot).toHaveProperty("kind", "VolumeGroupSnapshot");
  });

  it("validate", () => {
    expect(() => groupSnapshot.validate()).not.toThrow();
  });
});
