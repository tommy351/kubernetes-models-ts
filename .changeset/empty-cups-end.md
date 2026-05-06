---
"@kubernetes-models/generate": minor
---

Remove destination folder before writing output files. Expose a new `compileSchemas(tasks)` API (and `CompileSchemaTask` type) that compiles a batch of schemas, dispatching to worker threads above an internal threshold.
