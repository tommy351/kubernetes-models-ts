---
"@kubernetes-models/gateway-api": minor
---

Build with `--include-hidden` so that `_schemas/*` validators are exposed in the published `exports` map. This is required so downstream packages (e.g. `@kubernetes-models/envoy-gateway`, `@kubernetes-models/cert-manager`) can import `@kubernetes-models/gateway-api/_schemas/...` at runtime to validate kinds that reference Gateway API types.
