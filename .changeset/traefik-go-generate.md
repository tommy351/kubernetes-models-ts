---
"@kubernetes-models/traefik": major
---

Migrate from crd-generate to go-generate. This removes old CRD-generated APIs that are not present in the Traefik v2 Go API packages, including CRDs previously sourced from the Traefik Helm chart.
