# @kubernetes-models/victoria-metrics-operator

## 1.0.1

### Patch Changes

- Updated dependencies []:
  - kubernetes-models@3.0.1

## 1.0.0

### Major Changes

- [#66](https://github.com/tommy351/kubernetes-models-ts/pull/66) [`51cbc2b`](https://github.com/tommy351/kubernetes-models-ts/commit/51cbc2ba30ac417ee788f6a536a544191aadf69a) Thanks [@tommy351](https://github.com/tommy351)! - Use the new `@kubernetes-models/apimachinery` package.

### Minor Changes

- [#68](https://github.com/tommy351/kubernetes-models-ts/pull/68) [`8b610d0`](https://github.com/tommy351/kubernetes-models-ts/commit/8b610d0130aebf48f9fb08bc9f6790f77281b4a9) Thanks [@tommy351](https://github.com/tommy351)! - All models with `apiVersion` and `kind` properties now come with a new static method `is`, which returns `true` when the input value contains the same `apiVersion` and `kind` with the model.

  This function implements TypeScript type guard, which is very useful for narrowing down types.

  Please noted that this function only checks `apiVersion` and `kind`, other properties may still be invalid.

  Below is an example of the type guard function.

  ```ts
  import { Pod } from "kubernetes-models/v1/Pod";

  if (Pod.is(value)) {
    // value is a Pod.
  }
  ```

### Patch Changes

- Updated dependencies [[`2b18c6b`](https://github.com/tommy351/kubernetes-models-ts/commit/2b18c6bcbfe1a414beabda00a6f1332449b2e748), [`51cbc2b`](https://github.com/tommy351/kubernetes-models-ts/commit/51cbc2ba30ac417ee788f6a536a544191aadf69a), [`8b610d0`](https://github.com/tommy351/kubernetes-models-ts/commit/8b610d0130aebf48f9fb08bc9f6790f77281b4a9), [`e904810`](https://github.com/tommy351/kubernetes-models-ts/commit/e9048102c03569c19fc648ebff42b48e950dbc5c), [`8b610d0`](https://github.com/tommy351/kubernetes-models-ts/commit/8b610d0130aebf48f9fb08bc9f6790f77281b4a9), [`51cbc2b`](https://github.com/tommy351/kubernetes-models-ts/commit/51cbc2ba30ac417ee788f6a536a544191aadf69a)]:
  - @kubernetes-models/base@3.0.0
  - kubernetes-models@3.0.0

## 0.1.0

### Minor Changes

- [#64](https://github.com/tommy351/kubernetes-models-ts/pull/64) [`81fd67a`](https://github.com/tommy351/kubernetes-models-ts/commit/81fd67a6baa19de11f34c1fd812987267cbce63f) Thanks [@tommy351](https://github.com/tommy351)! - First release.
