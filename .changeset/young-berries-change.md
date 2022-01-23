---
"kubernetes-models": major
---

File paths are used to be `_definitions/<name>`, which are supposed to be hidden files, but sometimes IDE get confused and use them in import suggestions. In this version, files are moved to better locations, which should imporve the user experience of import suggestions. Below are examples of file paths.

- `kubernetes-models/_definitions/IoK8sApiCoreV1Pod` -> `kubernetes-models/v1/Pod`
- `kubernetes-models/_definitions/IoK8sApiAppsV1Deployment` -> `kubernetes-models/apps/v1/Deployment`

Some file aliases are also removed to avoid hidden files being displayed in import suggestions. Here are some examples of removed file aliases.

- `kubernetes-models/api/core/v1/Pod`
- `kubernetes-models/api/apps/v1/Deployment`
- `kubernetes-models/apiextensions-apiserver/pkg/apis/apiextensions/v1/CustomResourceDefinition`

You might have to update import paths in your code if you are using any of the patterns above.
