# @kubernetes-models/tetragon

[Tetragon](https://github.com/cilium/tetragon) CRD models. Provides TypeScript classes for Tetragon's eBPF-based security observability and runtime enforcement CRDs under the `cilium.io` API group:

- `cilium.io/v1alpha1`: `TracingPolicy`, `TracingPolicyNamespaced`, `PodInfo`

## Installation

Install with npm.

```sh
npm install @kubernetes-models/tetragon
```

## Usage

```js
import { TracingPolicy } from "@kubernetes-models/tetragon/cilium.io/v1alpha1/TracingPolicy";

// Create a new TracingPolicy
const policy = new TracingPolicy({
  metadata: {
    name: "sys-write",
  },
  spec: {
    kprobes: [
      {
        call: "sys_write",
        syscall: true,
      },
    ],
  },
});

// Validate against JSON schema
policy.validate();
```

## License

MIT
