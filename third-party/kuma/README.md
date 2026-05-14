# @kubernetes-models/kuma

[Kuma](https://kuma.io/) service mesh models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/kuma
```

## Usage

```js
import { MeshTrafficPermission } from "@kubernetes-models/kuma/kuma.io/v1alpha1/MeshTrafficPermission";

// Create a new MeshTrafficPermission
const mtp = new MeshTrafficPermission({
  metadata: {
    name: "allow-all",
    namespace: "kuma-system",
  },
  spec: {
    targetRef: {
      kind: "Mesh",
    },
    from: [
      {
        targetRef: {
          kind: "Mesh",
        },
        default: {
          action: "Allow",
        },
      },
    ],
  },
});

// Validate against JSON schema
mtp.validate();
```

## License

MIT
