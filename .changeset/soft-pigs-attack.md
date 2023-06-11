---
"@kubernetes-models/base": major
---

In the past, during model initialization, all properties within it were subject to deep copying, while any undefined properties were omitted. Now, to optimize performance in larger projects, we now utilize shallow copying, retaining undefined properties as-is.

Starting from `js-yaml` 4.0.0, undefined values are ignored, and the `toJSON` function now returns the class itself instead of performing a deep copy.
