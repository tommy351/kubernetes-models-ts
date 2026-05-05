---
"kubernetes-models": patch
"@kubernetes-models/crd-generate": patch
"@kubernetes-models/generate": patch
"@kubernetes-models/openapi-generate": patch
---

Speed up model generation by reducing Babel traversal work, reading multiple generator inputs concurrently, and writing generated files with bounded parallelism.
