# @kubernetes-models/karpenter

[Karpenter](https://karpenter.sh/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/karpenter
```

## Usage

```ts
import { EC2NodeClass } from "@kubernetes-models/karpenter/karpenter.k8s.aws/v1beta1";

// Create a new EC2NodeClass
const nodeClass = new EC2NodeClass({
  metadata: { name: "test" },
  spec: {
    amiFamily: "AL2",
    subnetSelectorTerms: [{ tags: { "aws-cdk:subnet-name": "private" } }],
    securityGroupSelectorTerms: [{ name: "test" }]
  }
});

// Validate against JSON schema
nodeClass.validate();
```

## License

MIT
