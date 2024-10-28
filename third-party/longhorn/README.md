# @kubernetes-models/longhorn

[Longhorn](https://longhorn.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/longhorn
```

## Usage

```js
import { Backup } from "@kubernetes-models/longhorn/longhorn.io/v1beta1/Backup";

// Create a new Backup
const backup = new Backup({
  metadata: {
    name: "backup"
  },
  spec: {
    backupMode: "incremental",
    snapshotName: "snapshot-name-example",
    labels: {
      app: "test"
    }
  }
});

// Validate against JSON schema
repo.validate();
```

## License

MIT
