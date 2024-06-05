# @kubernetes-models/fission

[Fission](https://fission.io) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/fission
```

## Usage

```js
import { Package } from "@kubernetes-models/fission/fission.io/v1/Package";

// Create a new Package
const pkg = new Package({
  metadata: {
    name: "example"
  },
  spec: {
    environment: {
      name: "nodejs",
      namespace: "fission-function"
    },
    deployment: {
      type: "literal",
      literal: "console.log('Hello, World!')"
    }
  }
});

// Validate against JSON schema
pkg.validate();
```

## License

MIT
