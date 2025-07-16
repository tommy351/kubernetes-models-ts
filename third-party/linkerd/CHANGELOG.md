# @kubernetes-models/linkerd

## 0.4.2

### Patch Changes

- Updated dependencies [[`1d68961`](https://github.com/tommy351/kubernetes-models-ts/commit/1d68961f1832866716e01992f70d90b161b58e81)]:
  - @kubernetes-models/apimachinery@2.1.0

## 0.4.1

### Patch Changes

- [#220](https://github.com/tommy351/kubernetes-models-ts/pull/220) [`de414dd`](https://github.com/tommy351/kubernetes-models-ts/commit/de414ddbb16d37da1e88c2aacb5ce4f57cec2d02) Thanks [@RealityAnomaly](https://github.com/RealityAnomaly)! - Set model-defined props outside constructor to ensure `useDefineForClassFields` compatibility.

- Updated dependencies [[`de414dd`](https://github.com/tommy351/kubernetes-models-ts/commit/de414ddbb16d37da1e88c2aacb5ce4f57cec2d02)]:
  - @kubernetes-models/base@5.0.1
  - @kubernetes-models/apimachinery@2.0.2

## 0.4.0

### Minor Changes

- [#218](https://github.com/tommy351/kubernetes-models-ts/pull/218) [`fb87b8c`](https://github.com/tommy351/kubernetes-models-ts/commit/fb87b8c3e22cd8b905aa4c302579a44ee26d8c94) Thanks [@yckao](https://github.com/yckao)! - linkerd community release is now use edge channel and upgrade to 2024.11.8

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

- [`9b1b31a`](https://github.com/tommy351/kubernetes-models-ts/commit/9b1b31a011a2d6484b1bc0663037cd92c9cdc927) Thanks [@tommy351](https://github.com/tommy351)! - Remove `HTTPRoute` CRD from gateway API. Please use `@kubernetes-models/gateway-api` package instead.

## 0.1.0

### Minor Changes

- [#169](https://github.com/tommy351/kubernetes-models-ts/pull/169) [`4b14ba4`](https://github.com/tommy351/kubernetes-models-ts/commit/4b14ba46a89e576ddcc3dcc94c143eec9f869a09) Thanks [@yckao](https://github.com/yckao)! - First release.
