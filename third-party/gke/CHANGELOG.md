# Change Log

## 4.3.0

### Minor Changes

- [#174](https://github.com/tommy351/kubernetes-models-ts/pull/174) [`027a326`](https://github.com/tommy351/kubernetes-models-ts/commit/027a3269a8ef41a59e13cbe72d6f8bcd93df3d04) Thanks [@tommy351](https://github.com/tommy351)! - Add CRDs from [GoogleCloudPlatform/gke-networking-recipes](https://github.com/GoogleCloudPlatform/gke-networking-recipes) repository.

- [#174](https://github.com/tommy351/kubernetes-models-ts/pull/174) [`027a326`](https://github.com/tommy351/kubernetes-models-ts/commit/027a3269a8ef41a59e13cbe72d6f8bcd93df3d04) Thanks [@tommy351](https://github.com/tommy351)! - Update [k8s-config-connector](https://github.com/GoogleCloudPlatform/k8s-config-connector) CRDs.

## 4.2.3

### Patch Changes

- Updated dependencies [[`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126)]:
  - @kubernetes-models/validate@3.1.1
  - @kubernetes-models/base@4.0.3
  - @kubernetes-models/apimachinery@1.2.1

## 4.2.2

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

- [#100](https://github.com/tommy351/kubernetes-models-ts/pull/100) [`5a09767`](https://github.com/tommy351/kubernetes-models-ts/commit/5a097671c952454c8a889b4488ca82d79ec481ba) Thanks [@tommy351](https://github.com/tommy351)! - Update CRDs.

## 4.0.1

### Patch Changes

- Updated dependencies [[`ef175ce`](https://github.com/tommy351/kubernetes-models-ts/commit/ef175ce282461aea2a2d7977c31791bb12c9cff6)]:
  - @kubernetes-models/apimachinery@1.1.0

## 4.0.0

### Major Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12.

### Patch Changes

- Updated dependencies [[`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58), [`d91ff07`](https://github.com/tommy351/kubernetes-models-ts/commit/d91ff07349ebfd8e9ca5bca1e9a08a8c64fa9216), [`a0d4e70`](https://github.com/tommy351/kubernetes-models-ts/commit/a0d4e70acb1ec8f9ea4a369e30531a1eeb7fed02), [`8a99963`](https://github.com/tommy351/kubernetes-models-ts/commit/8a99963e60a1479d97d63bb81a7830f2e36a9e05)]:
  - @kubernetes-models/base@4.0.0
  - @kubernetes-models/validate@3.0.0
  - @kubernetes-models/apimachinery@1.0.0

## 3.0.2

### Patch Changes

- Updated dependencies [[`6e51206`](https://github.com/tommy351/kubernetes-models-ts/commit/6e512067557a938db902a88c18595fc7c76e9b37)]:
  - @kubernetes-models/apimachinery@0.2.0

## 3.0.1

### Patch Changes

- Updated dependencies []:
  - @kubernetes-models/apimachinery@0.1.0

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

### Patch Changes

- Updated dependencies [[`2b18c6b`](https://github.com/tommy351/kubernetes-models-ts/commit/2b18c6bcbfe1a414beabda00a6f1332449b2e748), [`04197d2`](https://github.com/tommy351/kubernetes-models-ts/commit/04197d23d5bc951b24a7e225f8d3070511861811), [`8b610d0`](https://github.com/tommy351/kubernetes-models-ts/commit/8b610d0130aebf48f9fb08bc9f6790f77281b4a9), [`e904810`](https://github.com/tommy351/kubernetes-models-ts/commit/e9048102c03569c19fc648ebff42b48e950dbc5c)]:
  - @kubernetes-models/base@3.0.0
  - @kubernetes-models/apimachinery@0.1.0

## 2.1.1

### Patch Changes

- Updated dependencies [[`0ddc606`](https://github.com/tommy351/kubernetes-models-ts/commit/0ddc606c531e1dbc06b2ddf102b9eeabd8bacea7)]:
  - kubernetes-models@2.0.2

## 2.1.0

### Minor Changes

- [`7134133`](https://github.com/tommy351/kubernetes-models-ts/commit/7134133f54e74215c3e062b8e825371242996319) Thanks [@tommy351](https://github.com/tommy351)! - Update networking CRDs.

  - Update `BackendConfig`.
  - Add `FrontendConfig`.
  - Add `ManagedCertificate`.
  - Add `ServiceNetworkEndpointGroup`.

## 2.0.1

### Patch Changes

- [`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.cjs` to `.js`. (Revert [a9a3c18](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b))

- Updated dependencies [[`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440)]:
  - @kubernetes-models/base@2.0.1
  - kubernetes-models@2.0.1
  - @kubernetes-models/validate@2.0.1

## 2.0.0

### Major Changes

- [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10.

### Minor Changes

- [`059ae16`](https://github.com/tommy351/kubernetes-models-ts/commit/059ae16981be3d832ebc3e91d7e8cdc5122abcc8) Thanks [@tommy351](https://github.com/tommy351)! - Update to Config Connector v1.58.0.

### Patch Changes

- [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.js` to `.cjs`.

- Updated dependencies [[`7c1c04d`](https://github.com/tommy351/kubernetes-models-ts/commit/7c1c04dc0472a05d29bfd02a54855beb2bcb17db), [`0af92ab`](https://github.com/tommy351/kubernetes-models-ts/commit/0af92ab6320db857280c766f2a11bcefff1e0043), [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b), [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9)]:
  - @kubernetes-models/validate@2.0.0
  - kubernetes-models@2.0.0
  - @kubernetes-models/base@2.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.3](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.6.2...@kubernetes-models/gke@1.6.3) (2021-05-30)

**Note:** Version bump only for package @kubernetes-models/gke

## [1.6.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.6.1...@kubernetes-models/gke@1.6.2) (2021-05-30)

**Note:** Version bump only for package @kubernetes-models/gke

## [1.6.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.6.0...@kubernetes-models/gke@1.6.1) (2021-05-20)

**Note:** Version bump only for package @kubernetes-models/gke

# [1.6.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.5.4...@kubernetes-models/gke@1.6.0) (2021-05-20)

### Features

- **validate:** Upgrade to ajv v8 ([44c6ce5](https://github.com/tommy351/kubernetes-models-ts/commit/44c6ce5f50b4847b6228ec059cd8b802bb671281))

## [1.5.4](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.5.3...@kubernetes-models/gke@1.5.4) (2021-04-14)

**Note:** Version bump only for package @kubernetes-models/gke

## [1.5.3](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.5.2...@kubernetes-models/gke@1.5.3) (2021-04-14)

**Note:** Version bump only for package @kubernetes-models/gke

## [1.5.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.5.1...@kubernetes-models/gke@1.5.2) (2021-03-03)

### Bug Fixes

- Fix Node.js 10 support ([3cffdf0](https://github.com/tommy351/kubernetes-models-ts/commit/3cffdf0d0a0efc24fcc959d20c8bca657385488f))

## [1.5.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.5.0...@kubernetes-models/gke@1.5.1) (2021-03-03)

**Note:** Version bump only for package @kubernetes-models/gke

# [1.5.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.4.2...@kubernetes-models/gke@1.5.0) (2021-03-03)

### Features

- Rename extension of ESM files as ".mjs" ([025ac24](https://github.com/tommy351/kubernetes-models-ts/commit/025ac24948a07f2d48cc3fe4d3b6329749bc5c3a))

## [1.4.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.4.1...@kubernetes-models/gke@1.4.2) (2021-02-28)

**Note:** Version bump only for package @kubernetes-models/gke

## [1.4.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.4.0...@kubernetes-models/gke@1.4.1) (2021-02-28)

**Note:** Version bump only for package @kubernetes-models/gke

# [1.4.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.3.1...@kubernetes-models/gke@1.4.0) (2021-02-27)

### Features

- **export-map:** Add more options to generate command ([8558dae](https://github.com/tommy351/kubernetes-models-ts/commit/8558daedd09894c2098fa16dfd103858aeb40d5a))

## [1.3.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.3.0...@kubernetes-models/gke@1.3.1) (2021-02-27)

**Note:** Version bump only for package @kubernetes-models/gke

# [1.3.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.2.0...@kubernetes-models/gke@1.3.0) (2021-02-27)

### Features

- **crd-generate:** Generate aliases ([e16e6fe](https://github.com/tommy351/kubernetes-models-ts/commit/e16e6fe8736e95cfc48dcfe4ab2f244ac33bb380))
- **export-map:** Generate export map ([067b4e3](https://github.com/tommy351/kubernetes-models-ts/commit/067b4e303c0f662e113fc2ee65e8edf36a86c958))

# [1.2.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.1.0...@kubernetes-models/gke@1.2.0) (2021-02-22)

### Features

- **cert-manager:** Update to cert-manager v1.2.0 ([a200971](https://github.com/tommy351/kubernetes-models-ts/commit/a200971e3f51d3faa072c98456734aec797cee81))

# [1.1.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.0.3...@kubernetes-models/gke@1.1.0) (2021-02-07)

**Note:** Version bump only for package @kubernetes-models/gke

## [1.0.3](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.0.2...@kubernetes-models/gke@1.0.3) (2021-01-08)

**Note:** Version bump only for package @kubernetes-models/gke

## [1.0.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.0.1...@kubernetes-models/gke@1.0.2) (2020-12-15)

**Note:** Version bump only for package @kubernetes-models/gke

## [1.0.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/gke@1.0.1...@kubernetes-models/gke@1.0.1) (2020-11-17)

## 1.0.1 (2020-10-16)

# 1.0.0 (2020-10-13)

### chore

- **deps:** Upgrade deps ([618d20b](https://github.com/tommy351/kubernetes-models-ts/commit/618d20b202ed91ee43814aa69e08a84f21d8ae1b))

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

# 0.2.0 (2020-07-21)

### Features

- **gke:** Add config connector CRDs ([ba523c2](https://github.com/tommy351/kubernetes-models-ts/commit/ba523c298354d5c33dd7b2edec4cc31278b81455))

## 0.1.2 (2020-05-27)

## 0.1.1 (2020-05-03)

# 0.1.0 (2019-10-14)

### Features

- Add gke package README.md ([33a0c20](https://github.com/tommy351/kubernetes-models-ts/commit/33a0c208341cf5b89e45568a7367644ab4350d74))
- Add gke package which contains the BackendConfig CRD ([f535c4b](https://github.com/tommy351/kubernetes-models-ts/commit/f535c4b6c10b21905535ef3928b6d2dbf942dcb7))
