---
"@kubernetes-models/openapi-generate": patch
---

Fix the alias file generated for a schema's additional `x-kubernetes-group-version-kind` entries. The relative import path was computed against `defPath` (e.g. `v1/DeleteOptions.ts`) without stripping its `.ts` extension, then had `/index.js` appended, producing an unresolvable import like `../../v1/DeleteOptions.ts/index.js`. Any schema registered under more than one GVK hit this — in the real Kubernetes OpenAPI spec, `io.k8s.apimachinery.pkg.apis.meta.v1.DeleteOptions` and `...WatchEvent`, each registered under every API group. Now uses `trimExtname` + `.js`, matching the equivalent computation already used for ordinary cross-references in `generators/definition.ts`.
