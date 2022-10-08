---
"@kubernetes-models/apimachinery": minor
"kubernetes-models": minor
---

Enum types was removed in the last version because they are removed from OpenAPI spec in `kubernetes` models after v1.24.0 ([PR #109178](https://github.com/kubernetes/kubernetes/pull/109178)). In order to bring back enum types, I manually generated OpenAPI spec files and stored them in [tommy351/kubernetes-openapi-spec](https://github.com/tommy351/kubernetes-openapi-spec) repository.
