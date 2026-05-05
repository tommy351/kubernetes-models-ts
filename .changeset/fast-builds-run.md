---
"kubernetes-models": patch
"@kubernetes-models/crd-generate": patch
"@kubernetes-models/generate": patch
"@kubernetes-models/openapi-generate": patch
---

Speed up model generation by reducing Babel traversal work and reading multiple generator inputs concurrently.
