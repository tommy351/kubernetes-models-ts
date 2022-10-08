---
"@kubernetes-models/validate": minor
---

- Enable `verbose` option in Ajv.
- Remove nullable $ref error messages.

  When a schema like below failed.

  ```json
  {
    "oneOf": [{ "$ref": "io.k8s.api.core.v1.PodSpec#" }, { "type": "null" }]
  }
  ```

  It throws a validation error like this.

  ```
  data/spec must have required property 'containers',
  data/spec must be null,
  data/spec must match exactly one schema in oneOf
  ```

  Only the first line in this error message is helpful. Other lines are very confused and might make developers think they should set `spec` as `null`. Such error messages are removed in this version.

  ```
  data/spec must have required property 'containers'
  ```
