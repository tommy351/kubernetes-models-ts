---
"@kubernetes-models/flux-cd": major
---

Migrate from crd-generate to go-generate. The v1beta1 versions of source/kustomize/notification/image controllers are not part of the upstream Go API submodules at the targeted versions and have been dropped — current Flux versions consume v1 and v1beta2.
