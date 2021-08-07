---
"@kubernetes-models/openapi-generate": major
---

Change the name of definitions and schemas folder in order to avoid files in these folders being displayed first in the import suggestion of IDEs.

You have to update import paths if you are importing files from these folders directly.

- `_definitions` -> `x-defs`
- `_schemas` -> `x-schemas`
