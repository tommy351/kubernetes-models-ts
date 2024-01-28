# @kubernetes-models/kyverno

[Kyverno](https://kyverno.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/kyverno
```

## Usage

```js
import { ClusterPolicy } from "@kubernetes-models/kyverno/kyverno.io/v1/ClusterPolicy";

// Create a new ClusterPolicy
const policy = new ClusterPolicy({
  metadata: {
    name: "require-labels"
  },
  spec: {
    validationFailureAction: "enforce",
    background: false,
    rules: [
      {
        name: "check-team",
        match: {
          any: [
            {
              resources: {
                namespaces: ["default"],
                kinds: ["Pod"]
              }
            }
          ]
        },
        validate: {
          message: "label team must be set",
          pattern: {
            metadata: {
              labels: {
                team: "?*"
              }
            }
          }
        }
      }
    ]
  }
});

// Validate against JSON schema
policy.validate();
```

## License

MIT
