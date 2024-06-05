import { describe, it, expect, beforeEach } from "vitest";
import {
  CanaryConfig,
  Environment,
  Function,
  HTTPTrigger,
  KubernetesWatchTrigger,
  MessageQueueTrigger,
  Package,
  TimeTrigger
} from "../gen/fission.io/v1";

describe("CanaryConfig", () => {
  let canaryConfig: CanaryConfig;

  beforeEach(() => {
    canaryConfig = new CanaryConfig({
      metadata: {
        name: "example"
      },
      status: {
        status: "active"
      },
      spec: {
        newfunction: "new",
        oldfunction: "old",
        trigger: "trigger"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(canaryConfig).toHaveProperty("apiVersion", "fission.io/v1");
  });

  it("should set kind", () => {
    expect(canaryConfig).toHaveProperty("kind", "CanaryConfig");
  });

  it("should set metadata", () => {
    expect(canaryConfig.metadata).toEqual({ name: "example" });
  });

  it("toJSON", () => {
    expect(canaryConfig.toJSON()).toEqual({
      kind: "CanaryConfig",
      apiVersion: "fission.io/v1",
      metadata: {
        name: "example"
      },
      status: {
        status: "active"
      },
      spec: {
        newfunction: "new",
        oldfunction: "old",
        trigger: "trigger"
      }
    });
  });
});

describe("Environment", () => {
  let environment: Environment;

  beforeEach(() => {
    environment = new Environment({
      metadata: {
        name: "example"
      },
      spec: {
        version: 0,
        runtime: {
          image: "fission/node-env"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(environment).toHaveProperty("apiVersion", "fission.io/v1");
  });

  it("should set kind", () => {
    expect(environment).toHaveProperty("kind", "Environment");
  });

  it("should set metadata", () => {
    expect(environment.metadata).toEqual({ name: "example" });
  });

  it("toJSON", () => {
    expect(environment.toJSON()).toEqual({
      apiVersion: "fission.io/v1",
      kind: "Environment",
      metadata: {
        name: "example"
      },
      spec: {
        runtime: {
          image: "fission/node-env"
        },
        version: 0
      }
    });
  });
});

describe("Function", () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  let fn: Function;

  beforeEach(() => {
    fn = new Function({
      metadata: {
        name: "example"
      },
      spec: {
        environment: {
          name: "nodejs",
          namespace: "fission-function"
        },
        package: {},
        InvokeStrategy: {
          ExecutionStrategy: {
            ExecutorType: "poolmgr"
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(fn).toHaveProperty("apiVersion", "fission.io/v1");
  });

  it("should set kind", () => {
    expect(fn).toHaveProperty("kind", "Function");
  });

  it("should set metadata", () => {
    expect(fn.metadata).toEqual({ name: "example" });
  });

  it("toJSON", () => {
    expect(fn.toJSON()).toEqual({
      apiVersion: "fission.io/v1",
      kind: "Function",
      metadata: {
        name: "example"
      },
      spec: {
        environment: {
          name: "nodejs",
          namespace: "fission-function"
        },
        package: {},
        InvokeStrategy: {
          ExecutionStrategy: {
            ExecutorType: "poolmgr"
          }
        }
      }
    });
  });
});

describe("HTTPTrigger", () => {
  let httpTrigger: HTTPTrigger;

  beforeEach(() => {
    httpTrigger = new HTTPTrigger({
      metadata: {
        name: "example"
      },
      spec: {
        functionref: {
          name: "example",
          type: "name"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(httpTrigger).toHaveProperty("apiVersion", "fission.io/v1");
  });

  it("should set kind", () => {
    expect(httpTrigger).toHaveProperty("kind", "HTTPTrigger");
  });

  it("should set metadata", () => {
    expect(httpTrigger.metadata).toEqual({ name: "example" });
  });

  it("toJSON", () => {
    expect(httpTrigger.toJSON()).toEqual({
      apiVersion: "fission.io/v1",
      kind: "HTTPTrigger",
      metadata: {
        name: "example"
      },
      spec: {
        functionref: {
          name: "example",
          type: "name"
        }
      }
    });
  });
});

describe("KubernetesWatchTrigger", () => {
  let kubernetesWatchTrigger: KubernetesWatchTrigger;

  beforeEach(() => {
    kubernetesWatchTrigger = new KubernetesWatchTrigger({
      metadata: {
        name: "example"
      },
      spec: {
        functionref: {
          name: "example",
          type: "name"
        },
        namespace: "fission-function",
        type: "application/json"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(kubernetesWatchTrigger).toHaveProperty(
      "apiVersion",
      "fission.io/v1"
    );
  });

  it("should set kind", () => {
    expect(kubernetesWatchTrigger).toHaveProperty(
      "kind",
      "KubernetesWatchTrigger"
    );
  });

  it("should set metadata", () => {
    expect(kubernetesWatchTrigger.metadata).toEqual({ name: "example" });
  });

  it("toJSON", () => {
    expect(kubernetesWatchTrigger.toJSON()).toEqual({
      apiVersion: "fission.io/v1",
      kind: "KubernetesWatchTrigger",
      metadata: {
        name: "example"
      },
      spec: {
        functionref: {
          name: "example",
          type: "name"
        },
        namespace: "fission-function",
        type: "application/json"
      }
    });
  });
});

describe("MessageQueueTrigger", () => {
  let messageQueueTrigger: MessageQueueTrigger;

  beforeEach(() => {
    messageQueueTrigger = new MessageQueueTrigger({
      metadata: {
        name: "example"
      },
      spec: {
        functionref: {
          name: "example",
          type: "name"
        },
        topic: "example"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(messageQueueTrigger).toHaveProperty("apiVersion", "fission.io/v1");
  });

  it("should set kind", () => {
    expect(messageQueueTrigger).toHaveProperty("kind", "MessageQueueTrigger");
  });

  it("should set metadata", () => {
    expect(messageQueueTrigger.metadata).toEqual({ name: "example" });
  });

  it("toJSON", () => {
    expect(messageQueueTrigger.toJSON()).toEqual({
      apiVersion: "fission.io/v1",
      kind: "MessageQueueTrigger",
      metadata: {
        name: "example"
      },
      spec: {
        functionref: {
          name: "example",
          type: "name"
        },
        topic: "example"
      }
    });
  });
});

describe("Package", () => {
  let pkg: Package;

  beforeEach(() => {
    pkg = new Package({
      metadata: {
        name: "example"
      },
      spec: {
        environment: {
          name: "nodejs",
          namespace: "fission-function"
        },
        deployment: {
          type: "literal",
          literal: "console.log('Hello, World!')"
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(pkg).toHaveProperty("apiVersion", "fission.io/v1");
  });

  it("should set kind", () => {
    expect(pkg).toHaveProperty("kind", "Package");
  });

  it("should set metadata", () => {
    expect(pkg.metadata).toEqual({ name: "example" });
  });

  it("toJSON", () => {
    expect(pkg.toJSON()).toEqual({
      apiVersion: "fission.io/v1",
      kind: "Package",
      metadata: {
        name: "example"
      },
      spec: {
        environment: {
          name: "nodejs",
          namespace: "fission-function"
        },
        deployment: {
          type: "literal",
          literal: "console.log('Hello, World!')"
        }
      }
    });
  });
});

describe("TimeTrigger", () => {
  let timeTrigger: TimeTrigger;

  beforeEach(() => {
    timeTrigger = new TimeTrigger({
      metadata: {
        name: "example"
      },
      spec: {
        functionref: {
          name: "example",
          type: "name"
        },
        cron: "0 0 * * *"
      }
    });
  });

  it("should set apiVersion", () => {
    expect(timeTrigger).toHaveProperty("apiVersion", "fission.io/v1");
  });

  it("should set kind", () => {
    expect(timeTrigger).toHaveProperty("kind", "TimeTrigger");
  });

  it("should set metadata", () => {
    expect(timeTrigger.metadata).toEqual({ name: "example" });
  });

  it("toJSON", () => {
    expect(timeTrigger.toJSON()).toEqual({
      apiVersion: "fission.io/v1",
      kind: "TimeTrigger",
      metadata: {
        name: "example"
      },
      spec: {
        functionref: {
          name: "example",
          type: "name"
        },
        cron: "0 0 * * *"
      }
    });
  });
});
