---
"@kubernetes-models/crd-generate": minor
"@kubernetes-models/openapi-generate": minor
---

Decrease the size of alias files.

```ts
// Before
import * as v1 from "./v1";
export { v1 };
import * as v1beta1 from "./v1beta1";
export { v1beta1 };

// After
export * as v1 from "./v1";
export * as v1beta1 from "./v1beta1";
```
