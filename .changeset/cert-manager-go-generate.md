---
"@kubernetes-models/cert-manager": major
---

Switch to go-generate. Types now sourced from upstream Go packages — cert-manager v1.20.2, trust-manager v0.22.1, approver-policy v0.25.1, aws-privateca-issuer v1.8.1.

Breaking: legacy apiVersions are no longer emitted (`certmanager.k8s.io/v1alpha1`, `cert-manager.io/{v1alpha2,v1alpha3,v1beta1}`, `acme.cert-manager.io/{v1alpha2,v1alpha3,v1beta1}`). Only the current API versions remain.

Field types are now easier to reference: instead of `ICertificate['spec']`, use `ICertificateSpec`.
