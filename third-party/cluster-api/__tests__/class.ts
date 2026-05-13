import { describe, it, expect } from "vitest";
import { Cluster } from "../gen/cluster.x-k8s.io/v1beta2/Cluster.js";
import { Machine } from "../gen/cluster.x-k8s.io/v1beta2/Machine.js";
import { MachineDeployment } from "../gen/cluster.x-k8s.io/v1beta2/MachineDeployment.js";
import { KubeadmConfig } from "../gen/bootstrap.cluster.x-k8s.io/v1beta2/KubeadmConfig.js";
import { KubeadmControlPlane } from "../gen/controlplane.cluster.x-k8s.io/v1beta2/KubeadmControlPlane.js";
import { ClusterResourceSet } from "../gen/addons.cluster.x-k8s.io/v1beta2/ClusterResourceSet.js";
import { IPAddressClaim } from "../gen/ipam.cluster.x-k8s.io/v1beta2/IPAddressClaim.js";
import { ExtensionConfig } from "../gen/runtime.cluster.x-k8s.io/v1beta2/ExtensionConfig.js";

describe("Cluster", () => {
  const cluster = new Cluster({
    metadata: {
      name: "example-cluster",
      namespace: "default",
    },
    spec: {
      clusterNetwork: {
        pods: {
          cidrBlocks: ["192.168.0.0/16"],
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(cluster).toHaveProperty("apiVersion", "cluster.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(cluster).toHaveProperty("kind", "Cluster");
  });

  it("validate", () => {
    expect(() => cluster.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(cluster.toJSON()).toEqual({
      apiVersion: "cluster.x-k8s.io/v1beta2",
      kind: "Cluster",
      metadata: {
        name: "example-cluster",
        namespace: "default",
      },
      spec: {
        clusterNetwork: {
          pods: {
            cidrBlocks: ["192.168.0.0/16"],
          },
        },
      },
    });
  });
});

describe("Machine", () => {
  const machine = new Machine({
    metadata: {
      name: "example-machine",
      namespace: "default",
    },
    spec: {
      clusterName: "example-cluster",
      bootstrap: {
        dataSecretName: "example-bootstrap-data",
      },
      infrastructureRef: {
        apiGroup: "infrastructure.cluster.x-k8s.io",
        kind: "DockerMachine",
        name: "example-docker-machine",
      },
      version: "v1.31.0",
    },
  });

  it("should set apiVersion", () => {
    expect(machine).toHaveProperty("apiVersion", "cluster.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(machine).toHaveProperty("kind", "Machine");
  });

  it("validate", () => {
    expect(() => machine.validate()).not.toThrow();
  });
});

describe("MachineDeployment", () => {
  const md = new MachineDeployment({
    metadata: {
      name: "example-md",
      namespace: "default",
    },
    spec: {
      clusterName: "example-cluster",
      selector: {
        matchLabels: {
          cluster: "example-cluster",
        },
      },
      template: {
        spec: {
          clusterName: "example-cluster",
          bootstrap: {
            dataSecretName: "example-bootstrap-data",
          },
          infrastructureRef: {
            apiGroup: "infrastructure.cluster.x-k8s.io",
            kind: "DockerMachineTemplate",
            name: "example-docker-template",
          },
          version: "v1.31.0",
        },
      },
    },
  });

  it("should set apiVersion", () => {
    expect(md).toHaveProperty("apiVersion", "cluster.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(md).toHaveProperty("kind", "MachineDeployment");
  });

  it("validate", () => {
    expect(() => md.validate()).not.toThrow();
  });
});

describe("KubeadmConfig", () => {
  const kc = new KubeadmConfig({
    metadata: {
      name: "example-kubeadm-config",
      namespace: "default",
    },
    spec: {
      preKubeadmCommands: ["echo hello"],
    },
  });

  it("should set apiVersion", () => {
    expect(kc).toHaveProperty(
      "apiVersion",
      "bootstrap.cluster.x-k8s.io/v1beta2",
    );
  });

  it("should set kind", () => {
    expect(kc).toHaveProperty("kind", "KubeadmConfig");
  });

  it("validate", () => {
    expect(() => kc.validate()).not.toThrow();
  });
});

describe("KubeadmControlPlane", () => {
  const kcp = new KubeadmControlPlane({
    metadata: {
      name: "example-kcp",
      namespace: "default",
    },
    spec: {
      replicas: 3,
      version: "v1.31.0",
      machineTemplate: {
        spec: {
          infrastructureRef: {
            apiGroup: "infrastructure.cluster.x-k8s.io",
            kind: "DockerMachineTemplate",
            name: "example-docker-template",
          },
        },
      },
      kubeadmConfigSpec: {
        preKubeadmCommands: ["echo hello"],
      },
    },
  });

  it("should set apiVersion", () => {
    expect(kcp).toHaveProperty(
      "apiVersion",
      "controlplane.cluster.x-k8s.io/v1beta2",
    );
  });

  it("should set kind", () => {
    expect(kcp).toHaveProperty("kind", "KubeadmControlPlane");
  });

  it("validate", () => {
    expect(() => kcp.validate()).not.toThrow();
  });
});

describe("ClusterResourceSet", () => {
  const crs = new ClusterResourceSet({
    metadata: {
      name: "example-crs",
      namespace: "default",
    },
    spec: {
      clusterSelector: {
        matchLabels: {
          environment: "production",
        },
      },
      resources: [
        {
          name: "example-configmap",
          kind: "ConfigMap",
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(crs).toHaveProperty("apiVersion", "addons.cluster.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(crs).toHaveProperty("kind", "ClusterResourceSet");
  });

  it("validate", () => {
    expect(() => crs.validate()).not.toThrow();
  });
});

describe("IPAddressClaim", () => {
  const claim = new IPAddressClaim({
    metadata: {
      name: "example-claim",
      namespace: "default",
    },
    spec: {
      poolRef: {
        apiGroup: "ipam.cluster.x-k8s.io",
        kind: "InClusterIPPool",
        name: "example-pool",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(claim).toHaveProperty("apiVersion", "ipam.cluster.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(claim).toHaveProperty("kind", "IPAddressClaim");
  });

  it("validate", () => {
    expect(() => claim.validate()).not.toThrow();
  });
});

describe("ExtensionConfig", () => {
  const ec = new ExtensionConfig({
    metadata: {
      name: "example-extension",
    },
    spec: {
      clientConfig: {
        url: "https://example.com/extension",
      },
    },
  });

  it("should set apiVersion", () => {
    expect(ec).toHaveProperty("apiVersion", "runtime.cluster.x-k8s.io/v1beta2");
  });

  it("should set kind", () => {
    expect(ec).toHaveProperty("kind", "ExtensionConfig");
  });

  it("validate", () => {
    expect(() => ec.validate()).not.toThrow();
  });
});
