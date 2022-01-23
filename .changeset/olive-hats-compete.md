---
"@kubernetes-models/base": minor
---

Add `createTypeMetaGuard` function and `TypeMetaGuard` type. This function is used in models with `apiVersion` and `kind` properties (e.g. `Pod`, `Service`).

Please noted that this function only checks `apiVersion` and `kind`, other properties may still be invalid.

Below is an example of how to use the `createTypeMetaGuard` function.

```ts
const isPod = createTypeMetaGuard<IPod>(Pod);

if (isPod(value)) {
  // value is a Pod.
}
```
