---
"kubernetes-models": major
---

API machinery files are moved to the new package `@kubernetes-models/apimachinery`. You have to rewrite import paths as the following examples.

```ts
// Before
import { IObjectMeta } from "kubernetes-models/v1/ObjectMeta";

// After
import { IObjectMeta } from "@kubernetes-models/apimachinery/pkg/apis/meta/v1/ObjectMeta";
```

This change makes CRD packages can import only API machinery files rather than the whole `kubernetes-models` package.
