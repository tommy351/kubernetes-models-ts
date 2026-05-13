# @kubernetes-models/velero

[Velero](https://velero.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/velero
```

## Usage

```js
import { Backup } from "@kubernetes-models/velero/velero.io/v1/Backup";

// Create a new Backup
const backup = new Backup({
  metadata: {
    name: "example-backup",
    namespace: "velero"
  },
  spec: {
    includedNamespaces: ["default"]
  }
});

// Validate against JSON schema
backup.validate();
```

## License

MIT
