import { describe, it, expect, beforeEach } from "vitest";
import { Binding } from "../gen/rabbitmq.com/v1beta1/Binding";
import { Exchange } from "../gen/rabbitmq.com/v1beta1/Exchange";
import { Federation } from "../gen/rabbitmq.com/v1beta1/Federation";
import { Permission } from "../gen/rabbitmq.com/v1beta1";
import { Policy } from "../gen/rabbitmq.com/v1beta1/Policy";
import { Shovel } from "../gen/rabbitmq.com/v1beta1/Shovel";
import { Queue } from "../gen/rabbitmq.com/v1beta1/Queue";
import { User } from "../gen/rabbitmq.com/v1beta1/User";
import { Vhost } from "../gen/rabbitmq.com/v1beta1/Vhost";

describe("Binding", () => {
  let binding: Binding;

  beforeEach(() => {
    binding = new Binding({
      metadata: {
        name: "binding-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        source: "exchange-sample",
        destination: "queue-sample",
        destinationType: "queue",
        routingKey: "key-sample"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(binding).toHaveProperty("apiVersion", "rabbitmq.com/v1beta1");
  });

  it("should set kind", () => {
    expect(binding).toHaveProperty("kind", "Binding");
  });

  it("validate", () => {
    expect(() => binding.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(binding.toJSON()).toEqual({
      apiVersion: "rabbitmq.com/v1beta1",
      kind: "Binding",
      metadata: {
        name: "binding-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        source: "exchange-sample",
        destination: "queue-sample",
        destinationType: "queue",
        routingKey: "key-sample"
      }
    });
  });
});

describe("Exchange", () => {
  let exchange: Exchange;

  beforeEach(() => {
    exchange = new Exchange({
      metadata: {
        name: "direct-exchange"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        name: "exchange-sample",
        type: "direct",
        durable: true,
        autoDelete: false
      }
    });
  });

  it("should set apiVersion", () => {
    expect(exchange).toHaveProperty("apiVersion", "rabbitmq.com/v1beta1");
  });

  it("should set kind", () => {
    expect(exchange).toHaveProperty("kind", "Exchange");
  });

  it("validate", () => {
    expect(() => exchange.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(exchange.toJSON()).toEqual({
      apiVersion: "rabbitmq.com/v1beta1",
      kind: "Exchange",
      metadata: {
        name: "direct-exchange"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        name: "exchange-sample",
        type: "direct",
        durable: true,
        autoDelete: false
      }
    });
  });
});

describe("Federation", () => {
  let federation: Federation;

  beforeEach(() => {
    federation = new Federation({
      metadata: {
        name: "federation-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        name: "federation-sample",
        uriSecret: {
          name: "secret-sample"
        },
        ackMode: "on-confirm"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(federation).toHaveProperty("apiVersion", "rabbitmq.com/v1beta1");
  });

  it("should set kind", () => {
    expect(federation).toHaveProperty("kind", "Federation");
  });

  it("validate", () => {
    expect(() => federation.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(federation.toJSON()).toEqual({
      apiVersion: "rabbitmq.com/v1beta1",
      kind: "Federation",
      metadata: {
        name: "federation-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        name: "federation-sample",
        uriSecret: {
          name: "secret-sample"
        },
        ackMode: "on-confirm"
      }
    });
  });
});

describe("Permission", () => {
  let permission: Permission;

  beforeEach(() => {
    permission = new Permission({
      metadata: {
        name: "permission-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        user: "user-sample",
        permissions: {
          configure: ".*",
          write: ".*",
          read: ".*"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(permission).toHaveProperty("apiVersion", "rabbitmq.com/v1beta1");
  });

  it("should set kind", () => {
    expect(permission).toHaveProperty("kind", "Permission");
  });

  it("validate", () => {
    expect(() => permission.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(permission.toJSON()).toEqual({
      apiVersion: "rabbitmq.com/v1beta1",
      kind: "Permission",
      metadata: {
        name: "permission-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        user: "user-sample",
        permissions: {
          configure: ".*",
          write: ".*",
          read: ".*"
        }
      }
    });
  });
});

describe("Policy", () => {
  let policy: Policy;

  beforeEach(() => {
    policy = new Policy({
      metadata: {
        name: "policy-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        name: "policy-sample",
        pattern: ".*",
        applyTo: "all",
        definition: {
          "ha-mode": "all"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(policy).toHaveProperty("apiVersion", "rabbitmq.com/v1beta1");
  });

  it("should set kind", () => {
    expect(policy).toHaveProperty("kind", "Policy");
  });

  it("validate", () => {
    expect(() => policy.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(policy.toJSON()).toEqual({
      apiVersion: "rabbitmq.com/v1beta1",
      kind: "Policy",
      metadata: {
        name: "policy-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        name: "policy-sample",
        pattern: ".*",
        applyTo: "all",
        definition: {
          "ha-mode": "all"
        }
      }
    });
  });
});

describe("Queue", () => {
  let queue: Queue;

  beforeEach(() => {
    queue = new Queue({
      metadata: {
        name: "quorum-queue"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        name: "queue-sample",
        type: "quorum",
        durable: true,
        autoDelete: false
      }
    });
  });

  it("should set apiVersion", () => {
    expect(queue).toHaveProperty("apiVersion", "rabbitmq.com/v1beta1");
  });

  it("should set kind", () => {
    expect(queue).toHaveProperty("kind", "Queue");
  });

  it("validate", () => {
    expect(() => queue.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(queue.toJSON()).toEqual({
      apiVersion: "rabbitmq.com/v1beta1",
      kind: "Queue",
      metadata: {
        name: "quorum-queue"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        name: "queue-sample",
        type: "quorum",
        durable: true,
        autoDelete: false
      }
    });
  });
});

describe("Shovel", () => {
  let shovel: Shovel;

  beforeEach(() => {
    shovel = new Shovel({
      metadata: {
        name: "shovel-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        name: "shovel-sample",
        uriSecret: {
          name: "secret-sample"
        },
        srcAddress: "amqp://src-address",
        srcQueue: "source-queue",
        srcExchange: "source-exchange",
        srcExchangeKey: "source-exchange-key",
        destAddress: "amqp://dest-address",
        destQueue: "dest-queue",
        destExchange: "dest-exchange",
        destExchangeKey: "dest-exchange-key"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(shovel).toHaveProperty("apiVersion", "rabbitmq.com/v1beta1");
  });

  it("should set kind", () => {
    expect(shovel).toHaveProperty("kind", "Shovel");
  });

  it("validate", () => {
    expect(() => shovel.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(shovel.toJSON()).toEqual({
      apiVersion: "rabbitmq.com/v1beta1",
      kind: "Shovel",
      metadata: {
        name: "shovel-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        vhost: "/",
        name: "shovel-sample",
        uriSecret: {
          name: "secret-sample"
        },
        srcAddress: "amqp://src-address",
        srcQueue: "source-queue",
        srcExchange: "source-exchange",
        srcExchangeKey: "source-exchange-key",
        destAddress: "amqp://dest-address",
        destQueue: "dest-queue",
        destExchange: "dest-exchange",
        destExchangeKey: "dest-exchange-key"
      }
    });
  });
});

describe("User", () => {
  let user: User;

  beforeEach(() => {
    user = new User({
      metadata: {
        name: "user-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        importCredentialsSecret: { name: "secret-sample" },
        tags: ["management"]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(user).toHaveProperty("apiVersion", "rabbitmq.com/v1beta1");
  });

  it("should set kind", () => {
    expect(user).toHaveProperty("kind", "User");
  });

  it("validate", () => {
    expect(() => user.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(user.toJSON()).toEqual({
      apiVersion: "rabbitmq.com/v1beta1",
      kind: "User",
      metadata: {
        name: "user-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        importCredentialsSecret: { name: "secret-sample" },
        tags: ["management"]
      }
    });
  });
});

describe("Vhost", () => {
  let vhost: Vhost;

  beforeEach(() => {
    vhost = new Vhost({
      metadata: {
        name: "vhost-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        name: "vhost-sample"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(vhost).toHaveProperty("apiVersion", "rabbitmq.com/v1beta1");
  });

  it("should set kind", () => {
    expect(vhost).toHaveProperty("kind", "Vhost");
  });

  it("validate", () => {
    expect(() => vhost.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(vhost.toJSON()).toEqual({
      apiVersion: "rabbitmq.com/v1beta1",
      kind: "Vhost",
      metadata: {
        name: "vhost-sample"
      },
      spec: {
        rabbitmqClusterReference: { name: "cluster-sample" },
        name: "vhost-sample"
      }
    });
  });
});
