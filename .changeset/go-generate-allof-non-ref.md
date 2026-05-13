---
"@kubernetes-models/go-generate": patch
---

Skip non-`$ref` entries in `allOf` instead of asserting. Inline `x-kubernetes-preserve-unknown-fields: true` entries (emitted by controller-tools for fields marked `+kubebuilder:validation:Schemaless` + `+kubebuilder:pruning:PreserveUnknownFields`) no longer crash the generator.
