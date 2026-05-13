---
"@kubernetes-models/go-generate": patch
---

Fall back to a plain type alias for non-GVK structs whose flattened body has a top-level `validate` property. Such a field would shadow the inherited `Model.validate()` method and fail TypeScript's `--emitDeclarationOnly` pass (e.g. Kyverno's nested `Rule` type, where `validate` carries the validation sub-spec).
