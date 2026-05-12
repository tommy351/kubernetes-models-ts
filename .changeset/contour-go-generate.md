---
"@kubernetes-models/contour": major
---

Migrate from crd-generate to go-generate. This removes old CRD-generated APIs that are not present in the current Contour Go API packages, including `contour.heptio.com/v1beta1/IngressRoute`.
