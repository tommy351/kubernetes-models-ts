---
"@kubernetes-models/traefik": major
---

Migrate from crd-generate to go-generate and update to Traefik v3.7.1. The legacy `traefik.containo.us/v1alpha1` group has been removed (dropped upstream in v3); use `traefik.io/v1alpha1` instead. Adds `ServersTransportTCP`, which is new in v3. Field-level schemas under `traefik.io/v1alpha1` have changed to match v3's Go API.
