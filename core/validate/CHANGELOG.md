# Change Log

## 4.0.0

### Major Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`8440a52`](https://github.com/tommy351/kubernetes-models-ts/commit/8440a52b6a04af52ab0f28ccfa7794953b469b91) Thanks [@tommy351](https://github.com/tommy351)! - Remove `register` and `validate` functions.

### Minor Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`d9aae82`](https://github.com/tommy351/kubernetes-models-ts/commit/d9aae82c62a461fe68ea0521b8e99b7c20777251) Thanks [@tommy351](https://github.com/tommy351)! - Export Ajv runtime libraries.

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`dba981d`](https://github.com/tommy351/kubernetes-models-ts/commit/dba981d0fab843e0c772bff7b1833acde9a59995) Thanks [@tommy351](https://github.com/tommy351)! - Add `cidr` format.

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf) Thanks [@tommy351](https://github.com/tommy351)! - Export `formats` object and `addFormats` function.

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf) Thanks [@tommy351](https://github.com/tommy351)! - Add `runValidateFunc` function and `ValidateFunc` type.

### Patch Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`3a6a6c1`](https://github.com/tommy351/kubernetes-models-ts/commit/3a6a6c1141d4fcfd627bb1e2b2f62522ccd5f483) Thanks [@tommy351](https://github.com/tommy351)! - Revert `ajv-formats-draft2019` import fix.

## 3.1.2

### Patch Changes

- [`915b6dd`](https://github.com/tommy351/kubernetes-models-ts/commit/915b6dd8fb5e9d046dc7f7b654f72eea5e97391e) Thanks [@tommy351](https://github.com/tommy351)! - Fix `ajv-formats-draft2019` import on Node.js ESM.

## 3.1.1

### Patch Changes

- [#130](https://github.com/tommy351/kubernetes-models-ts/pull/130) [`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126) Thanks [@bdw617](https://github.com/bdw617)! - Update to Ajv 8.12.

## 3.1.0

### Minor Changes

- [#127](https://github.com/tommy351/kubernetes-models-ts/pull/127) [`09051d0`](https://github.com/tommy351/kubernetes-models-ts/commit/09051d0753e800ca3e7fd7c3f32c82cee1b6c154) Thanks [@tommy351](https://github.com/tommy351)! - Add support for more formats: `iri`, `iri-reference`, `idn-email`, `idn-hostname`, `duration`.

## 3.0.1

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

## 3.0.0

### Major Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12.

### Minor Changes

- [#79](https://github.com/tommy351/kubernetes-models-ts/pull/79) [`a0d4e70`](https://github.com/tommy351/kubernetes-models-ts/commit/a0d4e70acb1ec8f9ea4a369e30531a1eeb7fed02) Thanks [@tommy351](https://github.com/tommy351)! - When validation failed, collect all errors instead of only the first one.

- [#80](https://github.com/tommy351/kubernetes-models-ts/pull/80) [`8a99963`](https://github.com/tommy351/kubernetes-models-ts/commit/8a99963e60a1479d97d63bb81a7830f2e36a9e05) Thanks [@tommy351](https://github.com/tommy351)! - - Enable `verbose` option in Ajv.

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

    Only the first line in this error message is helpful. Other lines are very confusing and might make developers think they should set `spec` as `null`. Such error messages are removed in this version.

    ```
    data/spec must have required property 'containers'
    ```

## 2.0.1

### Patch Changes

- [`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.cjs` to `.js`. (Revert [a9a3c18](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b))

## 2.0.0

### Major Changes

- [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10.

### Minor Changes

- [`7c1c04d`](https://github.com/tommy351/kubernetes-models-ts/commit/7c1c04dc0472a05d29bfd02a54855beb2bcb17db) Thanks [@tommy351](https://github.com/tommy351)! - Support `string` format.

### Patch Changes

- [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.js` to `.cjs`.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.6.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.5.1...@kubernetes-models/validate@1.6.0) (2021-05-30)

### Features

- **validate:** Support quantity format ([66f502b](https://github.com/tommy351/kubernetes-models-ts/commit/66f502bbc902e81df3c22293937d45d82343d2aa))

## [1.5.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.5.0...@kubernetes-models/validate@1.5.1) (2021-05-20)

### Bug Fixes

- **validate:** Fix byte format validator ([825f407](https://github.com/tommy351/kubernetes-models-ts/commit/825f40724bb606a7b151edcb9c512002f8026ca3))

# [1.5.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.4.2...@kubernetes-models/validate@1.5.0) (2021-05-20)

### Features

- **validate:** Upgrade to ajv v8 ([44c6ce5](https://github.com/tommy351/kubernetes-models-ts/commit/44c6ce5f50b4847b6228ec059cd8b802bb671281))

## [1.4.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.4.1...@kubernetes-models/validate@1.4.2) (2021-03-03)

### Bug Fixes

- Fix Node.js 10 support ([3cffdf0](https://github.com/tommy351/kubernetes-models-ts/commit/3cffdf0d0a0efc24fcc959d20c8bca657385488f))

## [1.4.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.4.0...@kubernetes-models/validate@1.4.1) (2021-03-03)

**Note:** Version bump only for package @kubernetes-models/validate

# [1.4.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.3.2...@kubernetes-models/validate@1.4.0) (2021-03-03)

### Features

- Rename extension of ESM files as ".mjs" ([025ac24](https://github.com/tommy351/kubernetes-models-ts/commit/025ac24948a07f2d48cc3fe4d3b6329749bc5c3a))

## [1.3.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.3.1...@kubernetes-models/validate@1.3.2) (2021-02-28)

**Note:** Version bump only for package @kubernetes-models/validate

## [1.3.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.3.0...@kubernetes-models/validate@1.3.1) (2021-02-28)

### Bug Fixes

- **validate:** Fix ajv import in ES modules ([c91c84e](https://github.com/tommy351/kubernetes-models-ts/commit/c91c84eff724f9bff29c17e91065104424566c1e))

# [1.3.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.2.0...@kubernetes-models/validate@1.3.0) (2021-02-27)

### Features

- **crd-generate:** Generate aliases ([e16e6fe](https://github.com/tommy351/kubernetes-models-ts/commit/e16e6fe8736e95cfc48dcfe4ab2f244ac33bb380))
- **export-map:** Generate export map ([067b4e3](https://github.com/tommy351/kubernetes-models-ts/commit/067b4e303c0f662e113fc2ee65e8edf36a86c958))

# [1.2.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.1.0...@kubernetes-models/validate@1.2.0) (2021-02-22)

### Features

- **cert-manager:** Update to cert-manager v1.2.0 ([a200971](https://github.com/tommy351/kubernetes-models-ts/commit/a200971e3f51d3faa072c98456734aec797cee81))

# [1.1.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.0.1...@kubernetes-models/validate@1.1.0) (2021-02-07)

**Note:** Version bump only for package @kubernetes-models/validate

## [1.0.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.0.0...@kubernetes-models/validate@1.0.1) (2020-12-15)

**Note:** Version bump only for package @kubernetes-models/validate

# [1.0.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/validate@1.0.0...@kubernetes-models/validate@1.0.0) (2020-11-17)

# 1.0.0 (2020-10-13)

### chore

- **deps:** Upgrade deps ([618d20b](https://github.com/tommy351/kubernetes-models-ts/commit/618d20b202ed91ee43814aa69e08a84f21d8ae1b))

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

## 0.1.2 (2020-05-03)

## 0.1.1 (2019-09-01)

# 0.1.0 (2019-09-01)

## 0.0.2-alpha.0 (2019-09-01)
