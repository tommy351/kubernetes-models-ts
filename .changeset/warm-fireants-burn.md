---
"@kubernetes-models/generate": minor
---

Apply `oneOf`, `allOf`, `anyOf` after `type` is applied to better support [factoring schemas](https://json-schema.org/understanding-json-schema/reference/combining.html#factoring-schemas), which is used in Cilium `CiliumClusterwideNetworkPolicy` CRD.

```json
{
  "spec": {
    "oneOf": [
      {
        "properties": {
          "endpointSelector": {}
        },
        "required": ["endpointSelector"]
      },
      {
        "properties": {
          "nodeSelector": {}
        },
        "required": ["nodeSelector"]
      }
    ],
    "properties": {
      // ...
    }
  }
}
```
