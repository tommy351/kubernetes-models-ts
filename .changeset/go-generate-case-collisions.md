---
"@kubernetes-models/go-generate": patch
---

Break case-insensitive filesystem collisions. When sibling types in the same package emit to paths that fold to the same lowercase form (e.g. `TidbInitializer` and `TiDBInitializer` upstream), the root-kind variant keeps its natural file name and other variants get a stable `_<index>` suffix. Without this, `tsc --emitDeclarationOnly` fails with TS1149 on macOS/Windows filesystems.
