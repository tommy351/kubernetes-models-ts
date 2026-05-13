# @kubernetes-models/opa-gatekeeper

[OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/opa-gatekeeper
```

## Usage

```js
import { ConstraintTemplate } from "@kubernetes-models/opa-gatekeeper/templates.gatekeeper.sh/v1/ConstraintTemplate";

// Create a new ConstraintTemplate
const template = new ConstraintTemplate({
  metadata: {
    name: "k8srequiredlabels"
  },
  spec: {
    crd: {
      spec: {
        names: {
          kind: "K8sRequiredLabels"
        }
      }
    },
    targets: [
      {
        target: "admission.k8s.gatekeeper.sh",
        rego: 'package k8srequiredlabels\nviolation[{"msg": msg}] { msg := "test" }'
      }
    ]
  }
});

// Validate against JSON schema
template.validate();
```

## Constraint CRDs

This package only ships models for Gatekeeper's meta-CRDs (`ConstraintTemplate`, `Config`, `Assign`, `AssignMetadata`, `AssignImage`, `ModifySet`, `ExpansionTemplate`, `Provider`, `SyncSet`, `GVKManifest`, and the various `*PodStatus` kinds).

User-defined Constraint kinds (e.g. `K8sRequiredLabels` in the `constraints.gatekeeper.sh` API group) are created dynamically at runtime by Gatekeeper from each `ConstraintTemplate` and therefore cannot be modeled statically.

## License

MIT
