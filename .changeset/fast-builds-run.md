---
"kubernetes-models": patch
"@kubernetes-models/crd-generate": patch
"@kubernetes-models/generate": patch
"@kubernetes-models/openapi-generate": patch
---

Speed up model generation by reading multiple generator inputs concurrently, compiling schema validators with worker threads, rewriting generated validator imports without Babel, skipping repeated schema validation during validator compilation, and writing generated files with bounded parallelism.
