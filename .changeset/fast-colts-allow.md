---
"@kubernetes-models/publish-scripts": minor
"@kubernetes-models/apimachinery": patch
---

Replace non-index files with wildcard pattern (`*`) in export map.

```js
// Before
{
  "exports": {
    "./_schemas/IoK8sApimachineryPkgApiResourceQuantity": {},
    "./_schemas/IoK8sApimachineryPkgApisMetaV1APIGroup": {}
  }
}

// After
{
  "exports": {
    "./_schemas/*": {}
  }
}
```
