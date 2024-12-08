# @kubernetes-models/shipwright

## 0.3.2

### Patch Changes

- [#220](https://github.com/tommy351/kubernetes-models-ts/pull/220) [`de414dd`](https://github.com/tommy351/kubernetes-models-ts/commit/de414ddbb16d37da1e88c2aacb5ce4f57cec2d02) Thanks [@RealityAnomaly](https://github.com/RealityAnomaly)! - Set model-defined props outside constructor to ensure `useDefineForClassFields` compatibility.

- Updated dependencies [[`de414dd`](https://github.com/tommy351/kubernetes-models-ts/commit/de414ddbb16d37da1e88c2aacb5ce4f57cec2d02)]:
  - @kubernetes-models/base@5.0.1
  - @kubernetes-models/apimachinery@2.0.2

## 0.3.1

### Patch Changes

- [#216](https://github.com/tommy351/kubernetes-models-ts/pull/216) [`db67b32`](https://github.com/tommy351/kubernetes-models-ts/commit/db67b3253d21d4247a50109ef9f18c2345d7ce7f) Thanks [@RealityAnomaly](https://github.com/RealityAnomaly)! - Append `/index` to generated paths to ensure correct import handling.

- Updated dependencies [[`db67b32`](https://github.com/tommy351/kubernetes-models-ts/commit/db67b3253d21d4247a50109ef9f18c2345d7ce7f)]:
  - @kubernetes-models/apimachinery@2.0.1

## 0.3.0

### Minor Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`dba981d`](https://github.com/tommy351/kubernetes-models-ts/commit/dba981d0fab843e0c772bff7b1833acde9a59995) Thanks [@tommy351](https://github.com/tommy351)! - Pre-compile OpenAPI schema into a validate function. This should improve the performance of first-time validation, but the package size will slightly increase.

### Patch Changes

- Updated dependencies [[`d9aae82`](https://github.com/tommy351/kubernetes-models-ts/commit/d9aae82c62a461fe68ea0521b8e99b7c20777251), [`8440a52`](https://github.com/tommy351/kubernetes-models-ts/commit/8440a52b6a04af52ab0f28ccfa7794953b469b91), [`10ca286`](https://github.com/tommy351/kubernetes-models-ts/commit/10ca28636e33fb3f3611feaef00ff536e7b0d874), [`3a6a6c1`](https://github.com/tommy351/kubernetes-models-ts/commit/3a6a6c1141d4fcfd627bb1e2b2f62522ccd5f483), [`dba981d`](https://github.com/tommy351/kubernetes-models-ts/commit/dba981d0fab843e0c772bff7b1833acde9a59995), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`8440a52`](https://github.com/tommy351/kubernetes-models-ts/commit/8440a52b6a04af52ab0f28ccfa7794953b469b91), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf)]:
  - @kubernetes-models/validate@4.0.0
  - @kubernetes-models/apimachinery@2.0.0
  - @kubernetes-models/base@5.0.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`915b6dd`](https://github.com/tommy351/kubernetes-models-ts/commit/915b6dd8fb5e9d046dc7f7b654f72eea5e97391e)]:
  - @kubernetes-models/validate@3.1.2
  - @kubernetes-models/base@4.0.4
  - @kubernetes-models/apimachinery@1.2.2

## 0.2.0

### Minor Changes

- [#145](https://github.com/tommy351/kubernetes-models-ts/pull/145) [`af0eacc`](https://github.com/tommy351/kubernetes-models-ts/commit/af0eacc2b7abbaa8bd0754427f9097488d082847) Thanks [@jerolimov](https://github.com/jerolimov)! - Update to [Shipwright](https://shipwright.io/) release v0.12.0 that introduce a new v1beta1 API.

## 0.1.0

### Minor Changes

- [#140](https://github.com/tommy351/kubernetes-models-ts/pull/140) [`a230ea2`](https://github.com/tommy351/kubernetes-models-ts/commit/a230ea281b4cd373b747de9865efcac3583bab11) Thanks [@jerolimov](https://github.com/jerolimov)! - Initial [Shipwright](https://shipwright.io/) models based on the release v0.11.0.
