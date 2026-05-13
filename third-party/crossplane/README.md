# @kubernetes-models/crossplane

[Crossplane](https://www.crossplane.io/) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/crossplane
```

## Usage

```js
import { Composition } from "@kubernetes-models/crossplane/apiextensions.crossplane.io/v1/Composition";

// Create a new Composition
const composition = new Composition({
  metadata: {
    name: "example-composition"
  },
  spec: {
    compositeTypeRef: {
      apiVersion: "example.org/v1",
      kind: "XExample"
    }
  }
});

// Validate against JSON schema
composition.validate();
```

## License

MIT
