# Change Log

## 3.3.3

### Patch Changes

- Updated dependencies [[`1d68961`](https://github.com/tommy351/kubernetes-models-ts/commit/1d68961f1832866716e01992f70d90b161b58e81)]:
  - @kubernetes-models/apimachinery@2.1.0

## 3.3.2

### Patch Changes

- [#220](https://github.com/tommy351/kubernetes-models-ts/pull/220) [`de414dd`](https://github.com/tommy351/kubernetes-models-ts/commit/de414ddbb16d37da1e88c2aacb5ce4f57cec2d02) Thanks [@RealityAnomaly](https://github.com/RealityAnomaly)! - Set model-defined props outside constructor to ensure `useDefineForClassFields` compatibility.

- Updated dependencies [[`de414dd`](https://github.com/tommy351/kubernetes-models-ts/commit/de414ddbb16d37da1e88c2aacb5ce4f57cec2d02)]:
  - @kubernetes-models/base@5.0.1
  - @kubernetes-models/apimachinery@2.0.2

## 3.3.1

### Patch Changes

- [#216](https://github.com/tommy351/kubernetes-models-ts/pull/216) [`db67b32`](https://github.com/tommy351/kubernetes-models-ts/commit/db67b3253d21d4247a50109ef9f18c2345d7ce7f) Thanks [@RealityAnomaly](https://github.com/RealityAnomaly)! - Append `/index` to generated paths to ensure correct import handling.

- Updated dependencies [[`db67b32`](https://github.com/tommy351/kubernetes-models-ts/commit/db67b3253d21d4247a50109ef9f18c2345d7ce7f)]:
  - @kubernetes-models/apimachinery@2.0.1

## 3.3.0

### Minor Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`dba981d`](https://github.com/tommy351/kubernetes-models-ts/commit/dba981d0fab843e0c772bff7b1833acde9a59995) Thanks [@tommy351](https://github.com/tommy351)! - Pre-compile OpenAPI schema into a validate function. This should improve the performance of first-time validation, but the package size will slightly increase.

### Patch Changes

- Updated dependencies [[`d9aae82`](https://github.com/tommy351/kubernetes-models-ts/commit/d9aae82c62a461fe68ea0521b8e99b7c20777251), [`8440a52`](https://github.com/tommy351/kubernetes-models-ts/commit/8440a52b6a04af52ab0f28ccfa7794953b469b91), [`10ca286`](https://github.com/tommy351/kubernetes-models-ts/commit/10ca28636e33fb3f3611feaef00ff536e7b0d874), [`3a6a6c1`](https://github.com/tommy351/kubernetes-models-ts/commit/3a6a6c1141d4fcfd627bb1e2b2f62522ccd5f483), [`dba981d`](https://github.com/tommy351/kubernetes-models-ts/commit/dba981d0fab843e0c772bff7b1833acde9a59995), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`8440a52`](https://github.com/tommy351/kubernetes-models-ts/commit/8440a52b6a04af52ab0f28ccfa7794953b469b91), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf)]:
  - @kubernetes-models/validate@4.0.0
  - @kubernetes-models/apimachinery@2.0.0
  - @kubernetes-models/base@5.0.0

## 3.2.2

### Patch Changes

- Updated dependencies [[`915b6dd`](https://github.com/tommy351/kubernetes-models-ts/commit/915b6dd8fb5e9d046dc7f7b654f72eea5e97391e)]:
  - @kubernetes-models/validate@3.1.2
  - @kubernetes-models/base@4.0.4
  - @kubernetes-models/apimachinery@1.2.2

## 3.2.1

### Patch Changes

- Updated dependencies [[`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126)]:
  - @kubernetes-models/validate@3.1.1
  - @kubernetes-models/base@4.0.3
  - @kubernetes-models/apimachinery@1.2.1

## 3.2.0

### Minor Changes

- [`48d3d7b`](https://github.com/tommy351/kubernetes-models-ts/commit/48d3d7b62cdfb0bca3b966056fc5b238640ee74c) Thanks [@tommy351](https://github.com/tommy351)! - Update CRD version to v0.13.0.

### Patch Changes

- Updated dependencies [[`73daa2b`](https://github.com/tommy351/kubernetes-models-ts/commit/73daa2b36d44e88405e2337463fbb8999cddf359), [`09051d0`](https://github.com/tommy351/kubernetes-models-ts/commit/09051d0753e800ca3e7fd7c3f32c82cee1b6c154)]:
  - @kubernetes-models/apimachinery@1.2.0
  - @kubernetes-models/validate@3.1.0
  - @kubernetes-models/base@4.0.2

## 3.1.1

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

## 3.1.0

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

## 3.0.1

### Patch Changes

- Updated dependencies [[`ef175ce`](https://github.com/tommy351/kubernetes-models-ts/commit/ef175ce282461aea2a2d7977c31791bb12c9cff6)]:
  - @kubernetes-models/apimachinery@1.1.0

## 3.0.0

### Major Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12.

### Patch Changes

- Updated dependencies [[`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58), [`d91ff07`](https://github.com/tommy351/kubernetes-models-ts/commit/d91ff07349ebfd8e9ca5bca1e9a08a8c64fa9216), [`a0d4e70`](https://github.com/tommy351/kubernetes-models-ts/commit/a0d4e70acb1ec8f9ea4a369e30531a1eeb7fed02), [`8a99963`](https://github.com/tommy351/kubernetes-models-ts/commit/8a99963e60a1479d97d63bb81a7830f2e36a9e05)]:
  - @kubernetes-models/base@4.0.0
  - @kubernetes-models/validate@3.0.0
  - @kubernetes-models/apimachinery@1.0.0

## 2.1.0

### Minor Changes

- [#75](https://github.com/tommy351/kubernetes-models-ts/pull/75) [`929ff88`](https://github.com/tommy351/kubernetes-models-ts/commit/929ff88dd0187cdf83e78317ad733b3f81de194a) Thanks [@tommy351](https://github.com/tommy351)! - Update CRDs to vertical pod autoscaler v0.11.0.

## 2.0.2

### Patch Changes

- Updated dependencies [[`6e51206`](https://github.com/tommy351/kubernetes-models-ts/commit/6e512067557a938db902a88c18595fc7c76e9b37)]:
  - @kubernetes-models/apimachinery@0.2.0

## 2.0.1

### Patch Changes

- Updated dependencies []:
  - @kubernetes-models/apimachinery@0.1.0

## 2.0.0

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

## 1.0.2

### Patch Changes

- Updated dependencies [[`0ddc606`](https://github.com/tommy351/kubernetes-models-ts/commit/0ddc606c531e1dbc06b2ddf102b9eeabd8bacea7)]:
  - kubernetes-models@2.0.2

## 1.0.1

### Patch Changes

- [`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.cjs` to `.js`. (Revert [a9a3c18](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b))

- Updated dependencies [[`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440)]:
  - @kubernetes-models/base@2.0.1
  - kubernetes-models@2.0.1
  - @kubernetes-models/validate@2.0.1

## 1.0.0

### Major Changes

- [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10.

### Minor Changes

- [`a1b33c1`](https://github.com/tommy351/kubernetes-models-ts/commit/a1b33c19b16b7270574373208fc52a022e1fb209) Thanks [@tommy351](https://github.com/tommy351)! - Generate older versions of CRDs.

### Patch Changes

- [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.js` to `.cjs`.

- Updated dependencies [[`7c1c04d`](https://github.com/tommy351/kubernetes-models-ts/commit/7c1c04dc0472a05d29bfd02a54855beb2bcb17db), [`0af92ab`](https://github.com/tommy351/kubernetes-models-ts/commit/0af92ab6320db857280c766f2a11bcefff1e0043), [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b), [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9)]:
  - @kubernetes-models/validate@2.0.0
  - kubernetes-models@2.0.0
  - @kubernetes-models/base@2.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.3](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/autoscaler@0.2.2...@kubernetes-models/autoscaler@0.2.3) (2021-05-30)

**Note:** Version bump only for package @kubernetes-models/autoscaler

## [0.2.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/autoscaler@0.2.1...@kubernetes-models/autoscaler@0.2.2) (2021-05-30)

**Note:** Version bump only for package @kubernetes-models/autoscaler

## [0.2.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/autoscaler@0.2.0...@kubernetes-models/autoscaler@0.2.1) (2021-05-20)

**Note:** Version bump only for package @kubernetes-models/autoscaler

# [0.2.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/autoscaler@0.1.0...@kubernetes-models/autoscaler@0.2.0) (2021-05-20)

### Features

- **validate:** Upgrade to ajv v8 ([44c6ce5](https://github.com/tommy351/kubernetes-models-ts/commit/44c6ce5f50b4847b6228ec059cd8b802bb671281))

# 0.1.0 (2021-04-14)

### Features

- add VerticalPodAutoscaler model ([85c94ae](https://github.com/tommy351/kubernetes-models-ts/commit/85c94aee1fa7f1a600eb89aa24548538056e00da))
