# Change Log

## 4.4.2

### Patch Changes

- [#220](https://github.com/tommy351/kubernetes-models-ts/pull/220) [`de414dd`](https://github.com/tommy351/kubernetes-models-ts/commit/de414ddbb16d37da1e88c2aacb5ce4f57cec2d02) Thanks [@RealityAnomaly](https://github.com/RealityAnomaly)! - Set model-defined props outside constructor to ensure `useDefineForClassFields` compatibility.

- Updated dependencies [[`de414dd`](https://github.com/tommy351/kubernetes-models-ts/commit/de414ddbb16d37da1e88c2aacb5ce4f57cec2d02)]:
  - @kubernetes-models/base@5.0.1
  - @kubernetes-models/apimachinery@2.0.2

## 4.4.1

### Patch Changes

- [#216](https://github.com/tommy351/kubernetes-models-ts/pull/216) [`db67b32`](https://github.com/tommy351/kubernetes-models-ts/commit/db67b3253d21d4247a50109ef9f18c2345d7ce7f) Thanks [@RealityAnomaly](https://github.com/RealityAnomaly)! - Append `/index` to generated paths to ensure correct import handling.

- Updated dependencies [[`db67b32`](https://github.com/tommy351/kubernetes-models-ts/commit/db67b3253d21d4247a50109ef9f18c2345d7ce7f)]:
  - @kubernetes-models/apimachinery@2.0.1

## 4.4.0

### Minor Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf) Thanks [@tommy351](https://github.com/tommy351)! - Pre-compile OpenAPI schema into a validate function. This should improve the performance of first-time validation, but the package size will slightly increase.

### Patch Changes

- Updated dependencies [[`d9aae82`](https://github.com/tommy351/kubernetes-models-ts/commit/d9aae82c62a461fe68ea0521b8e99b7c20777251), [`8440a52`](https://github.com/tommy351/kubernetes-models-ts/commit/8440a52b6a04af52ab0f28ccfa7794953b469b91), [`10ca286`](https://github.com/tommy351/kubernetes-models-ts/commit/10ca28636e33fb3f3611feaef00ff536e7b0d874), [`3a6a6c1`](https://github.com/tommy351/kubernetes-models-ts/commit/3a6a6c1141d4fcfd627bb1e2b2f62522ccd5f483), [`dba981d`](https://github.com/tommy351/kubernetes-models-ts/commit/dba981d0fab843e0c772bff7b1833acde9a59995), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`8440a52`](https://github.com/tommy351/kubernetes-models-ts/commit/8440a52b6a04af52ab0f28ccfa7794953b469b91), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf)]:
  - @kubernetes-models/validate@4.0.0
  - @kubernetes-models/apimachinery@2.0.0
  - @kubernetes-models/base@5.0.0

## 4.3.2

### Patch Changes

- Updated dependencies [[`915b6dd`](https://github.com/tommy351/kubernetes-models-ts/commit/915b6dd8fb5e9d046dc7f7b654f72eea5e97391e)]:
  - @kubernetes-models/validate@3.1.2
  - @kubernetes-models/base@4.0.4
  - @kubernetes-models/apimachinery@1.2.2

## 4.3.1

### Patch Changes

- Updated dependencies [[`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126)]:
  - @kubernetes-models/validate@3.1.1
  - @kubernetes-models/base@4.0.3
  - @kubernetes-models/apimachinery@1.2.1

## 4.3.0

### Minor Changes

- [`73daa2b`](https://github.com/tommy351/kubernetes-models-ts/commit/73daa2b36d44e88405e2337463fbb8999cddf359) Thanks [@tommy351](https://github.com/tommy351)! - Update schema version to v1.27.1.

### Patch Changes

- Updated dependencies [[`73daa2b`](https://github.com/tommy351/kubernetes-models-ts/commit/73daa2b36d44e88405e2337463fbb8999cddf359), [`09051d0`](https://github.com/tommy351/kubernetes-models-ts/commit/09051d0753e800ca3e7fd7c3f32c82cee1b6c154)]:
  - @kubernetes-models/apimachinery@1.2.0
  - @kubernetes-models/validate@3.1.0
  - @kubernetes-models/base@4.0.2

## 4.2.1

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

- Updated dependencies [[`9816d36`](https://github.com/tommy351/kubernetes-models-ts/commit/9816d3633d9722170fe761de4383d25f0c0a5ab3), [`767314d`](https://github.com/tommy351/kubernetes-models-ts/commit/767314d40b2d274f66cbbcfe68c5e3ed99138c94)]:
  - @kubernetes-models/apimachinery@1.1.1
  - @kubernetes-models/base@4.0.1
  - @kubernetes-models/validate@3.0.1

## 4.2.0

### Minor Changes

- [`d46053b`](https://github.com/tommy351/kubernetes-models-ts/commit/d46053b15d0315e91fdfdb1f7fe0b60b681a499a) Thanks [@tommy351](https://github.com/tommy351)! - Decrease the size of export map in `package.json` by using wildcard pattern (`*`).

  ```js
  // Before
  {
    "exports": {
      "./v1/Pod": {
        "import": "./v1/Pod.mjs",
        "require": "./v1/Pod.js"
      },
      "./v1/Service": {
        "import": "./v1/Service.mjs",
        "require": "./v1/Service.js"
      }
    }
  }

  // After
  {
    "exports": {
      "./v1/*": {
        "import": "./v1/*.mjs",
        "require": "./v1/*.js"
      }
    }
  }
  ```

- [`f82b1cc`](https://github.com/tommy351/kubernetes-models-ts/commit/f82b1cc64b27884a862166977617f00911a03e49) Thanks [@tommy351](https://github.com/tommy351)! - Support TypeScript `nodenext` module resolution by adding `types` to export map.

  ```js
  // Before
  {
    "exports": {
      "./v1/Pod": {
        "import": "./v1/Pod.mjs",
        "require": "./v1/Pod.js"
      }
    }
  }

  // After
  {
    "exports": {
      "./v1/Pod": {
        "import": {
          "types": "./v1/Pod.d.ts",
          "default": "./v1/Pod.mjs"
        }
        "require": {
          "types": "./v1/Pod.d.ts",
          "default": "./v1/Pod.js"
        }
      }
    }
  }
  ```

### Patch Changes

- Updated dependencies []:
  - @kubernetes-models/apimachinery@1.1.0

## 4.1.0

### Minor Changes

- [#81](https://github.com/tommy351/kubernetes-models-ts/pull/81) [`ef175ce`](https://github.com/tommy351/kubernetes-models-ts/commit/ef175ce282461aea2a2d7977c31791bb12c9cff6) Thanks [@tommy351](https://github.com/tommy351)! - Enum types was removed in the last version because they are removed from OpenAPI spec in `kubernetes` models after v1.24.0 ([PR #109178](https://github.com/kubernetes/kubernetes/pull/109178)). In order to bring back enum types, I manually generated OpenAPI spec files and stored them in [tommy351/kubernetes-openapi-spec](https://github.com/tommy351/kubernetes-openapi-spec) repository.

### Patch Changes

- Updated dependencies [[`ef175ce`](https://github.com/tommy351/kubernetes-models-ts/commit/ef175ce282461aea2a2d7977c31791bb12c9cff6)]:
  - @kubernetes-models/apimachinery@1.1.0

## 4.0.0

### Major Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12.

### Minor Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`d91ff07`](https://github.com/tommy351/kubernetes-models-ts/commit/d91ff07349ebfd8e9ca5bca1e9a08a8c64fa9216) Thanks [@tommy351](https://github.com/tommy351)! - Update schema to Kubernetes v1.25.2.

### Patch Changes

- Updated dependencies [[`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58), [`d91ff07`](https://github.com/tommy351/kubernetes-models-ts/commit/d91ff07349ebfd8e9ca5bca1e9a08a8c64fa9216), [`a0d4e70`](https://github.com/tommy351/kubernetes-models-ts/commit/a0d4e70acb1ec8f9ea4a369e30531a1eeb7fed02), [`8a99963`](https://github.com/tommy351/kubernetes-models-ts/commit/8a99963e60a1479d97d63bb81a7830f2e36a9e05)]:
  - @kubernetes-models/base@4.0.0
  - @kubernetes-models/validate@3.0.0
  - @kubernetes-models/apimachinery@1.0.0

## 3.1.0

### Minor Changes

- [#72](https://github.com/tommy351/kubernetes-models-ts/pull/72) [`6e51206`](https://github.com/tommy351/kubernetes-models-ts/commit/6e512067557a938db902a88c18595fc7c76e9b37) Thanks [@tommy351](https://github.com/tommy351)! - Update schema to Kubernetes v1.23.5.

### Patch Changes

- Updated dependencies [[`6e51206`](https://github.com/tommy351/kubernetes-models-ts/commit/6e512067557a938db902a88c18595fc7c76e9b37)]:
  - @kubernetes-models/apimachinery@0.2.0

## 3.0.1

### Patch Changes

- Updated dependencies []:
  - @kubernetes-models/apimachinery@0.1.0

## 3.0.0

### Major Changes

- [#66](https://github.com/tommy351/kubernetes-models-ts/pull/66) [`51cbc2b`](https://github.com/tommy351/kubernetes-models-ts/commit/51cbc2ba30ac417ee788f6a536a544191aadf69a) Thanks [@tommy351](https://github.com/tommy351)! - API machinery files are moved to the new package `@kubernetes-models/apimachinery`. You have to rewrite import paths as the following examples.

  ```ts
  // Before
  import { IObjectMeta } from "kubernetes-models/apimachinery/pkg/apis/meta/v1/ObjectMeta";

  // After
  import { IObjectMeta } from "@kubernetes-models/apimachinery/pkg/apis/meta/v1/ObjectMeta";
  ```

  This change makes CRD packages can import only API machinery files rather than the whole `kubernetes-models` package.

* [#66](https://github.com/tommy351/kubernetes-models-ts/pull/66) [`51cbc2b`](https://github.com/tommy351/kubernetes-models-ts/commit/51cbc2ba30ac417ee788f6a536a544191aadf69a) Thanks [@tommy351](https://github.com/tommy351)! - File paths are used to be `_definitions/<name>`, which are supposed to be hidden files, but sometimes IDE get confused and use them in import suggestions. In this version, files are moved to better locations, which should imporve the user experience of import suggestions. Below are examples of file paths.

  - `kubernetes-models/_definitions/IoK8sApiCoreV1Pod` -> `kubernetes-models/v1/Pod`
  - `kubernetes-models/_definitions/IoK8sApiAppsV1Deployment` -> `kubernetes-models/apps/v1/Deployment`

  Some file aliases are also removed to avoid hidden files being displayed in import suggestions. Here are some examples of removed file aliases.

  - `kubernetes-models/api/core/v1/Pod`
  - `kubernetes-models/api/apps/v1/Deployment`
  - `kubernetes-models/apiextensions-apiserver/pkg/apis/apiextensions/v1/CustomResourceDefinition`

  You might have to update import paths in your code if you are using any of the patterns above.

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

- Updated dependencies [[`2b18c6b`](https://github.com/tommy351/kubernetes-models-ts/commit/2b18c6bcbfe1a414beabda00a6f1332449b2e748), [`04197d2`](https://github.com/tommy351/kubernetes-models-ts/commit/04197d23d5bc951b24a7e225f8d3070511861811), [`8b610d0`](https://github.com/tommy351/kubernetes-models-ts/commit/8b610d0130aebf48f9fb08bc9f6790f77281b4a9), [`e904810`](https://github.com/tommy351/kubernetes-models-ts/commit/e9048102c03569c19fc648ebff42b48e950dbc5c)]:
  - @kubernetes-models/base@3.0.0
  - @kubernetes-models/apimachinery@0.1.0

## 2.0.2

### Patch Changes

- [`0ddc606`](https://github.com/tommy351/kubernetes-models-ts/commit/0ddc606c531e1dbc06b2ddf102b9eeabd8bacea7) Thanks [@tommy351](https://github.com/tommy351)! - `apiVersion` and `kind` are no longer required in `volumeClaimTemplates` property of `StatefulSet` resource. (Fix [#44](https://github.com/tommy351/kubernetes-models-ts/issues/44))

## 2.0.1

### Patch Changes

- [`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.cjs` to `.js`. (Revert [a9a3c18](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b))

- Updated dependencies [[`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440)]:
  - @kubernetes-models/base@2.0.1
  - @kubernetes-models/validate@2.0.1

## 2.0.0

### Major Changes

- [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10.

### Minor Changes

- [`0af92ab`](https://github.com/tommy351/kubernetes-models-ts/commit/0af92ab6320db857280c766f2a11bcefff1e0043) Thanks [@tommy351](https://github.com/tommy351)! - Update to Kubernetes v1.22.0.

  In order to maintain downward compatibility, older versions with removed APIs
  are merged into the latest version of Kubernetes OpenAPI specification.

### Patch Changes

- [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.js` to `.cjs`.

- Updated dependencies [[`7c1c04d`](https://github.com/tommy351/kubernetes-models-ts/commit/7c1c04dc0472a05d29bfd02a54855beb2bcb17db), [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b), [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9)]:
  - @kubernetes-models/validate@2.0.0
  - @kubernetes-models/base@2.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.7.1](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.7.0...kubernetes-models@1.7.1) (2021-05-30)

### Bug Fixes

- **generate:** Support nullable \$ref prop ([cb4979d](https://github.com/tommy351/kubernetes-models-ts/commit/cb4979dd9984c4cf6a91ae80a08f4696eef02828)), closes [#41](https://github.com/tommy351/kubernetes-models-ts/issues/41)

# [1.7.0](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.6.1...kubernetes-models@1.7.0) (2021-05-30)

### Features

- **validate:** Support quantity format ([66f502b](https://github.com/tommy351/kubernetes-models-ts/commit/66f502bbc902e81df3c22293937d45d82343d2aa))

## [1.6.1](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.6.0...kubernetes-models@1.6.1) (2021-05-20)

**Note:** Version bump only for package kubernetes-models

# [1.6.0](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.5.4...kubernetes-models@1.6.0) (2021-05-20)

### Features

- **generate:** Allow null in JSON schema ([ad6e4b7](https://github.com/tommy351/kubernetes-models-ts/commit/ad6e4b773c6967e1995146c35c5d3932050db794))
- **validate:** Upgrade to ajv v8 ([44c6ce5](https://github.com/tommy351/kubernetes-models-ts/commit/44c6ce5f50b4847b6228ec059cd8b802bb671281))

## [1.5.4](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.5.3...kubernetes-models@1.5.4) (2021-04-14)

**Note:** Version bump only for package kubernetes-models

## [1.5.3](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.5.2...kubernetes-models@1.5.3) (2021-04-14)

**Note:** Version bump only for package kubernetes-models

## [1.5.2](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.5.1...kubernetes-models@1.5.2) (2021-03-03)

### Bug Fixes

- Fix Node.js 10 support ([3cffdf0](https://github.com/tommy351/kubernetes-models-ts/commit/3cffdf0d0a0efc24fcc959d20c8bca657385488f))

## [1.5.1](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.5.0...kubernetes-models@1.5.1) (2021-03-03)

**Note:** Version bump only for package kubernetes-models

# [1.5.0](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.4.2...kubernetes-models@1.5.0) (2021-03-03)

### Features

- Rename extension of ESM files as ".mjs" ([025ac24](https://github.com/tommy351/kubernetes-models-ts/commit/025ac24948a07f2d48cc3fe4d3b6329749bc5c3a))

## [1.4.2](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.4.1...kubernetes-models@1.4.2) (2021-02-28)

**Note:** Version bump only for package kubernetes-models

## [1.4.1](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.4.0...kubernetes-models@1.4.1) (2021-02-28)

**Note:** Version bump only for package kubernetes-models

# [1.4.0](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.3.1...kubernetes-models@1.4.0) (2021-02-27)

### Features

- **export-map:** Add more options to generate command ([8558dae](https://github.com/tommy351/kubernetes-models-ts/commit/8558daedd09894c2098fa16dfd103858aeb40d5a))

## [1.3.1](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.3.0...kubernetes-models@1.3.1) (2021-02-27)

**Note:** Version bump only for package kubernetes-models

# [1.3.0](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.2.0...kubernetes-models@1.3.0) (2021-02-27)

### Features

- **crd-generate:** Generate aliases ([e16e6fe](https://github.com/tommy351/kubernetes-models-ts/commit/e16e6fe8736e95cfc48dcfe4ab2f244ac33bb380))
- **export-map:** Generate export map ([067b4e3](https://github.com/tommy351/kubernetes-models-ts/commit/067b4e303c0f662e113fc2ee65e8edf36a86c958))

# [1.2.0](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.1.0...kubernetes-models@1.2.0) (2021-02-22)

### Features

- **cert-manager:** Update to cert-manager v1.2.0 ([a200971](https://github.com/tommy351/kubernetes-models-ts/commit/a200971e3f51d3faa072c98456734aec797cee81))

# [1.1.0](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.0.3...kubernetes-models@1.1.0) (2021-02-07)

**Note:** Version bump only for package kubernetes-models

## [1.0.3](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.0.2...kubernetes-models@1.0.3) (2021-01-08)

**Note:** Version bump only for package kubernetes-models

## [1.0.2](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.0.1...kubernetes-models@1.0.2) (2020-12-15)

### Bug Fixes

- **openapi-generate:** Fix schema for JSON type ([9936430](https://github.com/tommy351/kubernetes-models-ts/commit/9936430ffcbe9630a7deee55628d2de236641607))

## [1.0.1](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.0.1...kubernetes-models@1.0.1) (2020-11-17)

## [1.0.1](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@1.0.0...kubernetes-models@1.0.1) (2020-10-16)

# [1.0.0](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@0.8.1...kubernetes-models@1.0.0) (2020-10-13)

### chore

- **deps:** Upgrade deps ([618d20b](https://github.com/tommy351/kubernetes-models-ts/commit/618d20b202ed91ee43814aa69e08a84f21d8ae1b))

### Features

- **kubernetes-models:** Upgrade to 1.19.2 ([2aaae5b](https://github.com/tommy351/kubernetes-models-ts/commit/2aaae5b0b7fdddaedf9f33aa88dc0c5813380432))

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

## [0.8.1](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@0.8.0...kubernetes-models@0.8.1) (2020-07-21)

# [0.8.0](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@0.7.3...kubernetes-models@0.8.0) (2020-05-03)

### Features

- **kubernetes-models:** Update to v1.18.3 ([1b28104](https://github.com/tommy351/kubernetes-models-ts/commit/1b2810435b04bce55a8cf96e59a690bd33a4cb11))

## [0.7.3](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@0.7.2...kubernetes-models@0.7.3) (2019-10-14)

## [0.7.2](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@0.7.1...kubernetes-models@0.7.2) (2019-09-01)

### Features

- Generate CRD ([bbd4930](https://github.com/tommy351/kubernetes-models-ts/commit/bbd4930d54650175261a62a5317dc9e6909dc147))

## [0.7.1](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@0.7.0...kubernetes-models@0.7.1) (2019-09-01)

# [0.7.0](https://github.com/tommy351/kubernetes-models-ts/compare/kubernetes-models@0.6.2-alpha.0...kubernetes-models@0.7.0) (2019-09-01)

## 0.6.2-alpha.0 (2019-09-01)
