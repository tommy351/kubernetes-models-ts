---
"kubernetes-models": major
---

File paths are used to be `_definitions/<name>`, which are supposed to be hidden files, but sometimes IDE may confuse and use it in import suggestions. In this version, files are moved based on their API version.

Some file aliases are also removed in order to avoid hidden files showed in import suggestions. Here are some examples of removed file aliases.

- `kubernetes-models/api/core/v1/Pod`
- `kubernetes-models/api/apps/v1/Deployment`
- `kubernetes-models/apiextensions-apiserver/pkg/apis/apiextensions/v1/CustomResourceDefinition`
