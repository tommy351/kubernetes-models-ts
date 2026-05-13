---
"@kubernetes-models/go-generate": patch
---

Apply `pathRenames` to `_schemas/` paths too. Without this, types that survived a case-collision rename on the gen-tree side still collide at their schema-bundle path (`_schemas/<QualifiedClassName>.js`) because `getQualifiedClassName` produced an identical case-folded stem.
