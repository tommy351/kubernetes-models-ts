---
"@kubernetes-models/base": major
---

Undefined values are no longer omitted on model initialization or `toJSON` invocation. Since `JSON.stringify` and `js-yaml` 4.0.0 ignores undefined values, there's no need for kubernetes-models to omit undefined values anymore.
