---
"@kubernetes-models/generate": minor
---

- Remove destination folder before writing output files. 
- Expose a new `compileSchemas(tasks)` API (and `CompileSchemaTask` type) that compiles a batch of schemas, dispatching to worker threads above an internal threshold.
- Speed up model generation by tuning Ajv for standalone validator generation, rewriting generated validator imports without Babel, skipping repeated schema validation during validator compilation, and writing generated files with bounded parallelism.
