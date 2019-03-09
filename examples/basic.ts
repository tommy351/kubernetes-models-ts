import { Deployment } from "../gen/ts/apps/v1/Deployment";
import { Service } from "../gen/ts/v1/Service";

export const deployment = new Deployment({
  metadata: {
    name: "demo"
  },
  spec: {
    replicas: 3,
    selector: {},
    template: {
      spec: {
        containers: []
      }
    }
  }
});

deployment.validate();

export const service = new Service({
  metadata: {
    name: "demo"
  },
  spec: {
    ports: []
  }
});

service.validate();
