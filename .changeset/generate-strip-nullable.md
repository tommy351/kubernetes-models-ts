---
"@kubernetes-models/generate": patch
---

Strip redundant `nullable` keyword when converting `$ref` properties to `nullableRef` in `allowNull`. Previously, a property like `{$ref, nullable: true}` (emitted for `+nullable` Go fields) left `nullable: true` alongside `nullableRef`, which ajv rejects ("nullable cannot be used without type").
