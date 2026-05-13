---
"@kubernetes-models/go-generate": patch
---

When a definition file's path is renamed by the case-collision pass, also rename the emitted class and interface symbols (`ImageRef` → `ImageRef_1` etc.). Otherwise sibling renamed files in the same package all export the same `ImageRef` symbol, and the package-level `export * from` re-exports collide with TS2308.
