import { Deployment } from "kubernetes-models/apps/v1";
import { Service } from "kubernetes-models/v1";

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
