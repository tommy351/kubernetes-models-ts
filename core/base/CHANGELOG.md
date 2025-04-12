# Change Log

## 5.0.1

### Patch Changes

- [#220](https://github.com/tommy351/kubernetes-models-ts/pull/220) [`de414dd`](https://github.com/tommy351/kubernetes-models-ts/commit/de414ddbb16d37da1e88c2aacb5ce4f57cec2d02) Thanks [@RealityAnomaly](https://github.com/RealityAnomaly)! - Set model-defined props outside constructor to ensure `useDefineForClassFields` compatibility.

## 5.0.0

### Major Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`8440a52`](https://github.com/tommy351/kubernetes-models-ts/commit/8440a52b6a04af52ab0f28ccfa7794953b469b91) Thanks [@tommy351](https://github.com/tommy351)! - Remove `setSchema` function.

### Minor Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf) Thanks [@tommy351](https://github.com/tommy351)! - Add `setValidateFunc` function.

### Patch Changes

- Updated dependencies [[`d9aae82`](https://github.com/tommy351/kubernetes-models-ts/commit/d9aae82c62a461fe68ea0521b8e99b7c20777251), [`8440a52`](https://github.com/tommy351/kubernetes-models-ts/commit/8440a52b6a04af52ab0f28ccfa7794953b469b91), [`3a6a6c1`](https://github.com/tommy351/kubernetes-models-ts/commit/3a6a6c1141d4fcfd627bb1e2b2f62522ccd5f483), [`dba981d`](https://github.com/tommy351/kubernetes-models-ts/commit/dba981d0fab843e0c772bff7b1833acde9a59995), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf)]:
  - @kubernetes-models/validate@4.0.0

## 4.0.4

### Patch Changes

- Updated dependencies [[`915b6dd`](https://github.com/tommy351/kubernetes-models-ts/commit/915b6dd8fb5e9d046dc7f7b654f72eea5e97391e)]:
  - @kubernetes-models/validate@3.1.2

## 4.0.3

### Patch Changes

- Updated dependencies [[`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126)]:
  - @kubernetes-models/validate@3.1.1

## 4.0.2

### Patch Changes

- Updated dependencies [[`09051d0`](https://github.com/tommy351/kubernetes-models-ts/commit/09051d0753e800ca3e7fd7c3f32c82cee1b6c154)]:
  - @kubernetes-models/validate@3.1.0

## 4.0.1

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
  - @kubernetes-models/validate@3.0.1

## 4.0.0

### Major Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12.

### Patch Changes

- Updated dependencies [[`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58), [`a0d4e70`](https://github.com/tommy351/kubernetes-models-ts/commit/a0d4e70acb1ec8f9ea4a369e30531a1eeb7fed02), [`8a99963`](https://github.com/tommy351/kubernetes-models-ts/commit/8a99963e60a1479d97d63bb81a7830f2e36a9e05)]:
  - @kubernetes-models/validate@3.0.0

## 3.0.0

### Major Changes

- [#66](https://github.com/tommy351/kubernetes-models-ts/pull/66) [`2b18c6b`](https://github.com/tommy351/kubernetes-models-ts/commit/2b18c6bcbfe1a414beabda00a6f1332449b2e748) Thanks [@tommy351](https://github.com/tommy351)! - Remove the static method `setSchema` from `Model` class and re-export it separately.

### Minor Changes

- [#68](https://github.com/tommy351/kubernetes-models-ts/pull/68) [`8b610d0`](https://github.com/tommy351/kubernetes-models-ts/commit/8b610d0130aebf48f9fb08bc9f6790f77281b4a9) Thanks [@tommy351](https://github.com/tommy351)! - Add `createTypeMetaGuard` function and `TypeMetaGuard` type. This function is used in models with `apiVersion` and `kind` properties (e.g. `Pod`, `Service`).

  Please noted that this function only checks `apiVersion` and `kind`, other properties may still be invalid.

  Below is an example of how to use the `createTypeMetaGuard` function.

  ```ts
  const isPod = createTypeMetaGuard<IPod>(Pod);

  if (isPod(value)) {
    // value is a Pod.
  }
  ```

* [#66](https://github.com/tommy351/kubernetes-models-ts/pull/66) [`e904810`](https://github.com/tommy351/kubernetes-models-ts/commit/e9048102c03569c19fc648ebff42b48e950dbc5c) Thanks [@tommy351](https://github.com/tommy351)! - Add [`TypeMeta`](https://pkg.go.dev/k8s.io/apimachinery@v0.23.2/pkg/apis/meta/v1#TypeMeta) type.

## 2.0.1

### Patch Changes

- [`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.cjs` to `.js`. (Revert [a9a3c18](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b))

- Updated dependencies [[`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440)]:
  - @kubernetes-models/validate@2.0.1

## 2.0.0

### Major Changes

- [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10.

### Patch Changes

- [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.js` to `.cjs`.

- Updated dependencies [[`7c1c04d`](https://github.com/tommy351/kubernetes-models-ts/commit/7c1c04dc0472a05d29bfd02a54855beb2bcb17db), [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b), [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9)]:
  - @kubernetes-models/validate@2.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.5.5](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.5.4...@kubernetes-models/base@1.5.5) (2021-05-30)

**Note:** Version bump only for package @kubernetes-models/base

## [1.5.4](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.5.3...@kubernetes-models/base@1.5.4) (2021-05-20)

**Note:** Version bump only for package @kubernetes-models/base

## [1.5.3](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.5.2...@kubernetes-models/base@1.5.3) (2021-05-20)

**Note:** Version bump only for package @kubernetes-models/base

## [1.5.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.5.1...@kubernetes-models/base@1.5.2) (2021-03-03)

### Bug Fixes

- Fix Node.js 10 support ([3cffdf0](https://github.com/tommy351/kubernetes-models-ts/commit/3cffdf0d0a0efc24fcc959d20c8bca657385488f))

## [1.5.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.5.0...@kubernetes-models/base@1.5.1) (2021-03-03)

**Note:** Version bump only for package @kubernetes-models/base

# [1.5.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.4.2...@kubernetes-models/base@1.5.0) (2021-03-03)

### Features

- Rename extension of ESM files as ".mjs" ([025ac24](https://github.com/tommy351/kubernetes-models-ts/commit/025ac24948a07f2d48cc3fe4d3b6329749bc5c3a))

## [1.4.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.4.1...@kubernetes-models/base@1.4.2) (2021-02-28)

**Note:** Version bump only for package @kubernetes-models/base

## [1.4.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.4.0...@kubernetes-models/base@1.4.1) (2021-02-28)

**Note:** Version bump only for package @kubernetes-models/base

# [1.4.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.3.0...@kubernetes-models/base@1.4.0) (2021-02-27)

### Features

- **crd-generate:** Generate aliases ([e16e6fe](https://github.com/tommy351/kubernetes-models-ts/commit/e16e6fe8736e95cfc48dcfe4ab2f244ac33bb380))
- **export-map:** Generate export map ([067b4e3](https://github.com/tommy351/kubernetes-models-ts/commit/067b4e303c0f662e113fc2ee65e8edf36a86c958))

# [1.3.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.2.0...@kubernetes-models/base@1.3.0) (2021-02-22)

### Features

- **cert-manager:** Update to cert-manager v1.2.0 ([a200971](https://github.com/tommy351/kubernetes-models-ts/commit/a200971e3f51d3faa072c98456734aec797cee81))

# [1.2.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.1.0...@kubernetes-models/base@1.2.0) (2021-02-07)

**Note:** Version bump only for package @kubernetes-models/base

# [1.1.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.0.1...@kubernetes-models/base@1.1.0) (2021-01-08)

### Features

- **openapi-generate:** Set apiVersion/kind before other props ([888af3a](https://github.com/tommy351/kubernetes-models-ts/commit/888af3a3d4622b97819bcb6174780c54da042f34))

## [1.0.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.0.0...@kubernetes-models/base@1.0.1) (2020-12-15)

**Note:** Version bump only for package @kubernetes-models/base

# [1.0.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/base@1.0.0...@kubernetes-models/base@1.0.0) (2020-11-17)

# 1.0.0 (2020-10-13)

### chore

- **deps:** Upgrade deps ([618d20b](https://github.com/tommy351/kubernetes-models-ts/commit/618d20b202ed91ee43814aa69e08a84f21d8ae1b))

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

## 0.1.4 (2020-07-21)

### Bug Fixes

- **base:** Move apiVersion and kind to the front ([54377c7](https://github.com/tommy351/kubernetes-models-ts/commit/54377c70c6cec9dfa10c2acb6e1cbca901589b80))

## 0.1.3 (2020-05-03)

## 0.1.2 (2019-09-01)

## 0.1.1 (2019-09-01)

# 0.1.0 (2019-09-01)

## 0.0.2-alpha.0 (2019-09-01)
