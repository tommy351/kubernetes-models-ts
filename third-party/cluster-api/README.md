# @kubernetes-models/cluster-api

[Cluster API](https://cluster-api.sigs.k8s.io/) (CAPI) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/cluster-api
```

## Usage

```js
import { Cluster } from "@kubernetes-models/cluster-api/cluster.x-k8s.io/v1beta2/Cluster";

// Create a new Cluster
const cluster = new Cluster({
  metadata: {
    name: "example-cluster",
    namespace: "default"
  },
  spec: {
    clusterNetwork: {
      pods: {
        cidrBlocks: ["192.168.0.0/16"]
      }
    }
  }
});

// Validate against JSON schema
cluster.validate();
```

## Scope

This package ships models for the core Cluster API CRDs only — those defined in
the [`kubernetes-sigs/cluster-api`](https://github.com/kubernetes-sigs/cluster-api)
repository:

- `cluster.x-k8s.io` (`Cluster`, `ClusterClass`, `Machine`, `MachineSet`,
  `MachineDeployment`, `MachineHealthCheck`, `MachinePool`, `MachineDrainRule`)
- `addons.cluster.x-k8s.io` (`ClusterResourceSet`, `ClusterResourceSetBinding`)
- `bootstrap.cluster.x-k8s.io` (`KubeadmConfig`, `KubeadmConfigTemplate`)
- `controlplane.cluster.x-k8s.io` (`KubeadmControlPlane`,
  `KubeadmControlPlaneTemplate`)
- `ipam.cluster.x-k8s.io` (`IPAddress`, `IPAddressClaim`)
- `runtime.cluster.x-k8s.io` (`ExtensionConfig`)

Infrastructure and bootstrap provider CRDs (e.g. cluster-api-provider-aws,
-azure, -gcp, -vsphere, -openstack, etc.) live in separate upstream repositories
and are **not** included here.

## License

MIT
