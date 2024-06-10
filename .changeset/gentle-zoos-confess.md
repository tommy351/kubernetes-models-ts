---
"@kubernetes-models/apimachinery": major
---

If you import files from the `_schemas` directory, please note that `addSchema` function is replaced with `validate` function, and their behavior is totally different. You can follow the example below to migrate your code.

```js
// Before
import { validate } from "@kubernetes-models/validate";
import { addSchema } from "@kubernetes-models/apimachinery/_schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta";

addSchema();
validate("io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta", { foo: "bar" });

// After
import { runValidateFunc } from "@kubernetes-models/validate";
import validate from "@kubernetes-models/apimachinery/_schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta";

runValidateFunc(validate, { foo: "bar" });
```
