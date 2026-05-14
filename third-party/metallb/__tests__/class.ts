import { describe, it, expect } from "vitest";
import { IPAddressPool } from "../gen/metallb.io/v1beta1/IPAddressPool.js";
import { L2Advertisement } from "../gen/metallb.io/v1beta1/L2Advertisement.js";
import { BGPAdvertisement } from "../gen/metallb.io/v1beta1/BGPAdvertisement.js";
import { BFDProfile } from "../gen/metallb.io/v1beta1/BFDProfile.js";
import { Community } from "../gen/metallb.io/v1beta1/Community.js";
import { BGPPeer as BGPPeerV1beta1 } from "../gen/metallb.io/v1beta1/BGPPeer.js";
import { BGPPeer } from "../gen/metallb.io/v1beta2/BGPPeer.js";

describe("IPAddressPool", () => {
  const pool = new IPAddressPool({
    metadata: {
      name: "default-pool",
      namespace: "metallb-system",
    },
    spec: {
      addresses: ["192.168.10.0/24", "192.168.11.1-192.168.11.5"],
      autoAssign: true,
      avoidBuggyIPs: false,
    },
  });

  it("should set apiVersion", () => {
    expect(pool).toHaveProperty("apiVersion", "metallb.io/v1beta1");
  });

  it("should set kind", () => {
    expect(pool).toHaveProperty("kind", "IPAddressPool");
  });

  it("validate", () => {
    expect(() => pool.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(pool.toJSON()).toEqual({
      apiVersion: "metallb.io/v1beta1",
      kind: "IPAddressPool",
      metadata: {
        name: "default-pool",
        namespace: "metallb-system",
      },
      spec: {
        addresses: ["192.168.10.0/24", "192.168.11.1-192.168.11.5"],
        autoAssign: true,
        avoidBuggyIPs: false,
      },
    });
  });
});

describe("L2Advertisement", () => {
  const adv = new L2Advertisement({
    metadata: {
      name: "example",
      namespace: "metallb-system",
    },
    spec: {
      ipAddressPools: ["default-pool"],
    },
  });

  it("should set apiVersion", () => {
    expect(adv).toHaveProperty("apiVersion", "metallb.io/v1beta1");
  });

  it("should set kind", () => {
    expect(adv).toHaveProperty("kind", "L2Advertisement");
  });

  it("validate", () => {
    expect(() => adv.validate()).not.toThrow();
  });
});

describe("BGPAdvertisement", () => {
  const adv = new BGPAdvertisement({
    metadata: {
      name: "example",
      namespace: "metallb-system",
    },
    spec: {
      ipAddressPools: ["default-pool"],
      aggregationLength: 32,
      localPref: 100,
      communities: ["65535:65282"],
    },
  });

  it("should set apiVersion", () => {
    expect(adv).toHaveProperty("apiVersion", "metallb.io/v1beta1");
  });

  it("should set kind", () => {
    expect(adv).toHaveProperty("kind", "BGPAdvertisement");
  });

  it("validate", () => {
    expect(() => adv.validate()).not.toThrow();
  });
});

describe("BFDProfile", () => {
  const profile = new BFDProfile({
    metadata: {
      name: "full",
      namespace: "metallb-system",
    },
    spec: {
      receiveInterval: 300,
      transmitInterval: 300,
      echoInterval: 50,
      echoMode: false,
      passiveMode: false,
      minimumTtl: 254,
    },
  });

  it("should set apiVersion", () => {
    expect(profile).toHaveProperty("apiVersion", "metallb.io/v1beta1");
  });

  it("should set kind", () => {
    expect(profile).toHaveProperty("kind", "BFDProfile");
  });

  it("validate", () => {
    expect(() => profile.validate()).not.toThrow();
  });
});

describe("Community", () => {
  const community = new Community({
    metadata: {
      name: "communities",
      namespace: "metallb-system",
    },
    spec: {
      communities: [
        {
          name: "NO_ADVERTISE",
          value: "65535:65282",
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(community).toHaveProperty("apiVersion", "metallb.io/v1beta1");
  });

  it("should set kind", () => {
    expect(community).toHaveProperty("kind", "Community");
  });

  it("validate", () => {
    expect(() => community.validate()).not.toThrow();
  });
});

describe("BGPPeer", () => {
  const peer = new BGPPeer({
    metadata: {
      name: "sample",
      namespace: "metallb-system",
    },
    spec: {
      myASN: 64500,
      peerASN: 64501,
      peerAddress: "172.30.0.3",
    },
  });

  it("should set apiVersion", () => {
    expect(peer).toHaveProperty("apiVersion", "metallb.io/v1beta2");
  });

  it("should set kind", () => {
    expect(peer).toHaveProperty("kind", "BGPPeer");
  });

  it("validate", () => {
    expect(() => peer.validate()).not.toThrow();
  });
});

describe("BGPPeer v1beta1", () => {
  const peer = new BGPPeerV1beta1({
    metadata: {
      name: "sample-legacy",
      namespace: "metallb-system",
    },
    spec: {
      myASN: 64500,
      peerASN: 64501,
      peerAddress: "172.30.0.3",
    },
  });

  it("should set apiVersion", () => {
    expect(peer).toHaveProperty("apiVersion", "metallb.io/v1beta1");
  });

  it("should set kind", () => {
    expect(peer).toHaveProperty("kind", "BGPPeer");
  });

  it("validate", () => {
    expect(() => peer.validate()).not.toThrow();
  });
});
