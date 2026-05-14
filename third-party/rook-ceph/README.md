# @kubernetes-models/rook-ceph

[Rook](https://rook.io/) Ceph models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/rook-ceph
```

## Usage

```js
import { CephCluster } from "@kubernetes-models/rook-ceph/ceph.rook.io/v1/CephCluster";

// Create a new CephCluster
const cluster = new CephCluster({
  metadata: {
    name: "rook-ceph",
    namespace: "rook-ceph"
  },
  spec: {
    cephVersion: {
      image: "quay.io/ceph/ceph:v18.2.4"
    },
    dataDirHostPath: "/var/lib/rook",
    mon: {
      count: 3
    },
    storage: {
      useAllNodes: true,
      useAllDevices: true
    }
  }
});

// Validate against JSON schema
cluster.validate();
```

## Scope

This package ships models for the Rook Ceph operator CRDs in the
[`rook/rook`](https://github.com/rook/rook) repository:

- `ceph.rook.io` (`CephCluster`, `CephBlockPool`, `CephBlockPoolRadosNamespace`,
  `CephBucketNotification`, `CephBucketTopic`, `CephClient`, `CephCOSIDriver`,
  `CephFilesystem`, `CephFilesystemMirror`, `CephFilesystemSubVolumeGroup`,
  `CephNFS`, `CephNVMeOFGateway`, `CephObjectRealm`, `CephObjectStore`,
  `CephObjectStoreUser`, `CephObjectZone`, `CephObjectZoneGroup`,
  `CephRBDMirror`)
- `objectbucket.io` (`ObjectBucket`, `ObjectBucketClaim`) — Rook installs these
  CRDs from the upstream
  [`kube-object-storage/lib-bucket-provisioner`](https://github.com/kube-object-storage/lib-bucket-provisioner)
  project as part of its bundled CRD manifest.

## License

MIT
