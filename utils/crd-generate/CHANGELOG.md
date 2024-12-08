# Change Log

## 5.0.2

### Patch Changes

- [#220](https://github.com/tommy351/kubernetes-models-ts/pull/220) [`de414dd`](https://github.com/tommy351/kubernetes-models-ts/commit/de414ddbb16d37da1e88c2aacb5ce4f57cec2d02) Thanks [@RealityAnomaly](https://github.com/RealityAnomaly)! - Set model-defined props outside constructor to ensure `useDefineForClassFields` compatibility.

## 5.0.1

### Patch Changes

- [#216](https://github.com/tommy351/kubernetes-models-ts/pull/216) [`db67b32`](https://github.com/tommy351/kubernetes-models-ts/commit/db67b3253d21d4247a50109ef9f18c2345d7ce7f) Thanks [@RealityAnomaly](https://github.com/RealityAnomaly)! - Append `/index` to generated paths to ensure correct import handling.

## 5.0.0

### Major Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`dba981d`](https://github.com/tommy351/kubernetes-models-ts/commit/dba981d0fab843e0c772bff7b1833acde9a59995) Thanks [@tommy351](https://github.com/tommy351)! - Remove schema object from generated files.

### Minor Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`dba981d`](https://github.com/tommy351/kubernetes-models-ts/commit/dba981d0fab843e0c772bff7b1833acde9a59995) Thanks [@tommy351](https://github.com/tommy351)! - Pre-compile OpenAPI schema into a validate function. This should improve the performance of first-time validation, but the package size will slightly increase.

### Patch Changes

- Updated dependencies [[`5986ef0`](https://github.com/tommy351/kubernetes-models-ts/commit/5986ef0c2ecb2dd571ebcefa827e54c269d774e7), [`060d424`](https://github.com/tommy351/kubernetes-models-ts/commit/060d424bb33bc68634efc285420b76b394c50941)]:
  - @kubernetes-models/generate@2.4.0

## 4.1.3

### Patch Changes

- Updated dependencies [[`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126)]:
  - @kubernetes-models/generate@2.3.1

## 4.1.2

### Patch Changes

- Updated dependencies [[`d82f15d`](https://github.com/tommy351/kubernetes-models-ts/commit/d82f15db540d77f00e6ed16850aa9988cde14501)]:
  - @kubernetes-models/generate@2.3.0

## 4.1.1

### Patch Changes

- [`767314d`](https://github.com/tommy351/kubernetes-models-ts/commit/767314d40b2d274f66cbbcfe68c5e3ed99138c94) Thanks [@tommy351](https://github.com/tommy351)! - Simplify export map.

  ```js
  // Before
  {
    "exports": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  }

  // After
  {
    "exports": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  }
  ```

- Updated dependencies [[`767314d`](https://github.com/tommy351/kubernetes-models-ts/commit/767314d40b2d274f66cbbcfe68c5e3ed99138c94)]:
  - @kubernetes-models/generate@2.2.1
  - @kubernetes-models/read-input@3.1.1
  - @kubernetes-models/string-util@3.0.1

## 4.1.0

### Minor Changes

- [`8eb0a62`](https://github.com/tommy351/kubernetes-models-ts/commit/8eb0a625844cb3f09f4468a7d01d0204c4212fcc) Thanks [@tommy351](https://github.com/tommy351)! - Decrease the size of alias files.

  ```js
  // Before
  import * as v1 from "./v1";
  export { v1 };
  import * as v1beta1 from "./v1beta1";
  export { v1beta1 };

  // After
  export * as v1 from "./v1";
  export * as v1beta1 from "./v1beta1";
  ```

## 4.0.3

### Patch Changes

- Updated dependencies [[`4c9cb0f`](https://github.com/tommy351/kubernetes-models-ts/commit/4c9cb0fec5a96f972b3940a6bffab68ea8ea6dc5)]:
  - @kubernetes-models/generate@2.2.0

## 4.0.2

### Patch Changes

- Updated dependencies [[`c93da12`](https://github.com/tommy351/kubernetes-models-ts/commit/c93da12d15655cf8bbf9fbaf64d14f8ff94e118e)]:
  - @kubernetes-models/generate@2.1.0

## 4.0.1

### Patch Changes

- Updated dependencies [[`25a4971`](https://github.com/tommy351/kubernetes-models-ts/commit/25a49711ae2cceffd83d67e96b313d76ad15cb00)]:
  - @kubernetes-models/read-input@3.1.0

## 4.0.0

### Major Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12.

### Patch Changes

- Updated dependencies [[`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58)]:
  - @kubernetes-models/generate@2.0.0
  - @kubernetes-models/read-input@3.0.0
  - @kubernetes-models/string-util@3.0.0

## 3.0.1

### Patch Changes

- Updated dependencies [[`1cdc2f3`](https://github.com/tommy351/kubernetes-models-ts/commit/1cdc2f3375f9e2edf6e2a066e98db28a57d2b1f7)]:
  - @kubernetes-models/read-input@2.1.0

## 3.0.0

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

## 2.0.2

### Patch Changes

- Updated dependencies [[`6bf5475`](https://github.com/tommy351/kubernetes-models-ts/commit/6bf5475a41905eccb7bacb0eb59d709f2535df81)]:
  - @kubernetes-models/generate@1.1.0

## 2.0.1

### Patch Changes

- [`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.cjs` to `.js`. (Revert [a9a3c18](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b))

- Updated dependencies [[`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440)]:
  - @kubernetes-models/generate@1.0.1
  - @kubernetes-models/read-input@2.0.1
  - @kubernetes-models/string-util@2.0.1

## 2.0.0

### Major Changes

- [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10.

### Minor Changes

- [`2e4c958`](https://github.com/tommy351/kubernetes-models-ts/commit/2e4c958a02f1efd4f7ad3c11dc258a608702b515) Thanks [@tommy351](https://github.com/tommy351)! - Replace YAML parser with [`yaml`](https://github.com/eemeli/yaml) package. Add `yamlVersion` option.

* [`bf72b3a`](https://github.com/tommy351/kubernetes-models-ts/commit/bf72b3a6e2ac2a1539b59eeae9ca4cd5c1206a3e) Thanks [@tommy351](https://github.com/tommy351)! - Allow multiple input paths.

- [`73ea39a`](https://github.com/tommy351/kubernetes-models-ts/commit/73ea39aced9fe20d98e7f37008f5598af2512883) Thanks [@tommy351](https://github.com/tommy351)! - Load configs from `package.json`.

### Patch Changes

- [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.js` to `.cjs`.

- Updated dependencies [[`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b), [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9)]:
  - @kubernetes-models/generate@1.0.0
  - @kubernetes-models/read-input@2.0.0
  - @kubernetes-models/string-util@2.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.5.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.5.1...@kubernetes-models/crd-generate@1.5.2) (2021-05-30)

**Note:** Version bump only for package @kubernetes-models/crd-generate

## [1.5.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.5.0...@kubernetes-models/crd-generate@1.5.1) (2021-05-30)

**Note:** Version bump only for package @kubernetes-models/crd-generate

# [1.5.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.4.2...@kubernetes-models/crd-generate@1.5.0) (2021-05-20)

### Features

- **generate:** Allow null in JSON schema ([ad6e4b7](https://github.com/tommy351/kubernetes-models-ts/commit/ad6e4b773c6967e1995146c35c5d3932050db794))

## [1.4.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.4.1...@kubernetes-models/crd-generate@1.4.2) (2021-03-03)

### Bug Fixes

- Fix Node.js 10 support ([3cffdf0](https://github.com/tommy351/kubernetes-models-ts/commit/3cffdf0d0a0efc24fcc959d20c8bca657385488f))

## [1.4.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.4.0...@kubernetes-models/crd-generate@1.4.1) (2021-03-03)

**Note:** Version bump only for package @kubernetes-models/crd-generate

# [1.4.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.3.2...@kubernetes-models/crd-generate@1.4.0) (2021-03-03)

### Features

- Rename extension of ESM files as ".mjs" ([025ac24](https://github.com/tommy351/kubernetes-models-ts/commit/025ac24948a07f2d48cc3fe4d3b6329749bc5c3a))

## [1.3.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.3.1...@kubernetes-models/crd-generate@1.3.2) (2021-02-28)

**Note:** Version bump only for package @kubernetes-models/crd-generate

## [1.3.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.3.0...@kubernetes-models/crd-generate@1.3.1) (2021-02-28)

**Note:** Version bump only for package @kubernetes-models/crd-generate

# [1.3.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.2.0...@kubernetes-models/crd-generate@1.3.0) (2021-02-27)

### Features

- **cert-manager:** Update to cert-manager v1.2.0 ([a200971](https://github.com/tommy351/kubernetes-models-ts/commit/a200971e3f51d3faa072c98456734aec797cee81))
- **crd-generate:** Generate aliases ([e16e6fe](https://github.com/tommy351/kubernetes-models-ts/commit/e16e6fe8736e95cfc48dcfe4ab2f244ac33bb380))
- **export-map:** Generate export map ([067b4e3](https://github.com/tommy351/kubernetes-models-ts/commit/067b4e303c0f662e113fc2ee65e8edf36a86c958))
- **generate:** Add generate package ([8ee6df8](https://github.com/tommy351/kubernetes-models-ts/commit/8ee6df84544c4101f5f44cc7fb4d292f1d8d9b90))

# [1.2.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.1.0...@kubernetes-models/crd-generate@1.2.0) (2021-02-07)

**Note:** Version bump only for package @kubernetes-models/crd-generate

# [1.1.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.0.1...@kubernetes-models/crd-generate@1.1.0) (2021-01-08)

### Features

- **crd-generate:** Set apiVersion/kind before other props ([7d3fb32](https://github.com/tommy351/kubernetes-models-ts/commit/7d3fb3204c83041e566158eebf105d8a616b4b09))

## [1.0.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.0.0...@kubernetes-models/crd-generate@1.0.1) (2020-12-15)

**Note:** Version bump only for package @kubernetes-models/crd-generate

# [1.0.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/crd-generate@1.0.0...@kubernetes-models/crd-generate@1.0.0) (2020-11-17)

# 1.0.0 (2020-10-13)

### Bug Fixes

- **crd-generate:** Replace exclusiveMinimum/exclusiveMaximum keywords ([7069836](https://github.com/tommy351/kubernetes-models-ts/commit/706983683a5ac0450d25604c168ea9874bf90f6f))

### chore

- **deps:** Upgrade deps ([618d20b](https://github.com/tommy351/kubernetes-models-ts/commit/618d20b202ed91ee43814aa69e08a84f21d8ae1b))

### Features

- **crd-generate:** allow apiextensions.k8s.io/v1 api version too ([16f19a4](https://github.com/tommy351/kubernetes-models-ts/commit/16f19a43ddb616ec96c2b4899e965447d632268f)), closes [#21](https://github.com/tommy351/kubernetes-models-ts/issues/21)

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

## 0.1.3 (2020-05-27)

### Features

- **sealed-secrets:** add sealed-secrets model ([ec99bea](https://github.com/tommy351/kubernetes-models-ts/commit/ec99bead130d257e849ec259cfd781709e481ab3))

## 0.1.2 (2020-05-03)

## 0.1.1 (2019-10-14)

# 0.1.0 (2019-09-01)

### Features

- Generate CRD ([bbd4930](https://github.com/tommy351/kubernetes-models-ts/commit/bbd4930d54650175261a62a5317dc9e6909dc147))
- Set metadata in CRD ([6ee2946](https://github.com/tommy351/kubernetes-models-ts/commit/6ee29461188a7a76f3e68da79d6beed6c033d917))
