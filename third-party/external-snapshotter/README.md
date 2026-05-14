# @kubernetes-models/external-snapshotter

[external-snapshotter](https://github.com/kubernetes-csi/external-snapshotter) models. Provides TypeScript classes for the Kubernetes CSI volume snapshot CRDs:

- `snapshot.storage.k8s.io/v1`: `VolumeSnapshot`, `VolumeSnapshotClass`, `VolumeSnapshotContent`
- `groupsnapshot.storage.k8s.io/v1beta1`, `groupsnapshot.storage.k8s.io/v1beta2`: `VolumeGroupSnapshot`, `VolumeGroupSnapshotClass`, `VolumeGroupSnapshotContent`

## Installation

Install with npm.

```sh
npm install @kubernetes-models/external-snapshotter
```

## Usage

```js
import { VolumeSnapshot } from "@kubernetes-models/external-snapshotter/snapshot.storage.k8s.io/v1/VolumeSnapshot";

// Create a new VolumeSnapshot
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

// Validate against JSON schema
snapshot.validate();
```

## License

MIT
