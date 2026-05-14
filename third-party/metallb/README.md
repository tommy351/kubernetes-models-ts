# @kubernetes-models/metallb

[MetalLB](https://metallb.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/metallb
```

## Usage

```js
import { IPAddressPool } from "@kubernetes-models/metallb/metallb.io/v1beta1/IPAddressPool";

// Create a new IPAddressPool
const pool = new IPAddressPool({
  metadata: {
    name: "default-pool",
    namespace: "metallb-system",
  },
  spec: {
    addresses: ["192.168.10.0/24"],
  },
});

// Validate against JSON schema
pool.validate();
```

## License

MIT
