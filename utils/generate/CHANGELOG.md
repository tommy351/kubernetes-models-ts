# Change Log

## 2.4.0

### Minor Changes

- [#199](https://github.com/tommy351/kubernetes-models-ts/pull/199) [`5986ef0`](https://github.com/tommy351/kubernetes-models-ts/commit/5986ef0c2ecb2dd571ebcefa827e54c269d774e7) Thanks [@tommy351](https://github.com/tommy351)! - Add `compileSchema` function.

- [#201](https://github.com/tommy351/kubernetes-models-ts/pull/201) [`060d424`](https://github.com/tommy351/kubernetes-models-ts/commit/060d424bb33bc68634efc285420b76b394c50941) Thanks [@tommy351](https://github.com/tommy351)! - Use re2 for regular expressions that aren't supported by JavaScript.

### Patch Changes

- Updated dependencies [[`d9aae82`](https://github.com/tommy351/kubernetes-models-ts/commit/d9aae82c62a461fe68ea0521b8e99b7c20777251), [`8440a52`](https://github.com/tommy351/kubernetes-models-ts/commit/8440a52b6a04af52ab0f28ccfa7794953b469b91), [`3a6a6c1`](https://github.com/tommy351/kubernetes-models-ts/commit/3a6a6c1141d4fcfd627bb1e2b2f62522ccd5f483), [`dba981d`](https://github.com/tommy351/kubernetes-models-ts/commit/dba981d0fab843e0c772bff7b1833acde9a59995), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf), [`d076453`](https://github.com/tommy351/kubernetes-models-ts/commit/d076453fa50650d7f99426048a6b583df0abaeaf)]:
  - @kubernetes-models/validate@4.0.0

## 2.3.1

### Patch Changes

- [#130](https://github.com/tommy351/kubernetes-models-ts/pull/130) [`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126) Thanks [@bdw617](https://github.com/bdw617)! - Update to Ajv 8.12.

## 2.3.0

### Minor Changes

- [#127](https://github.com/tommy351/kubernetes-models-ts/pull/127) [`d82f15d`](https://github.com/tommy351/kubernetes-models-ts/commit/d82f15db540d77f00e6ed16850aa9988cde14501) Thanks [@tommy351](https://github.com/tommy351)! - Apply `oneOf`, `allOf`, `anyOf` after `type` is applied to better support [factoring schemas](https://json-schema.org/understanding-json-schema/reference/combining.html#factoring-schemas), which is used in Cilium `CiliumClusterwideNetworkPolicy` CRD.

  ```json
  {
    "spec": {
      "oneOf": [
        {
          "properties": {
            "endpointSelector": {}
          },
          "required": ["endpointSelector"]
        },
        {
          "properties": {
            "nodeSelector": {}
          },
          "required": ["nodeSelector"]
        }
      ],
      "properties": {
        // ...
      }
    }
  }
  ```

## 2.2.1

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
  - @kubernetes-models/string-util@3.0.1

## 2.2.0

### Minor Changes

- [#109](https://github.com/tommy351/kubernetes-models-ts/pull/109) [`4c9cb0f`](https://github.com/tommy351/kubernetes-models-ts/commit/4c9cb0fec5a96f972b3940a6bffab68ea8ea6dc5) Thanks [@tommy351](https://github.com/tommy351)! - Add support for `anyOf`, `allOf` and `not` JSON schema properties. Fix the issue that `oneOf` JSON schema property doesn't inherit parent schema.

## 2.1.0

### Minor Changes

- [#96](https://github.com/tommy351/kubernetes-models-ts/pull/96) [`c93da12`](https://github.com/tommy351/kubernetes-models-ts/commit/c93da12d15655cf8bbf9fbaf64d14f8ff94e118e) Thanks [@tommy351](https://github.com/tommy351)! - Rewrite string patterns and omit invalid string patterns to make sure Ajv won't throw `Invalid regular expression` error.

## 2.0.0

### Major Changes

- [#77](https://github.com/tommy351/kubernetes-models-ts/pull/77) [`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12.

### Patch Changes

- Updated dependencies [[`ac8d1c5`](https://github.com/tommy351/kubernetes-models-ts/commit/ac8d1c5e5e6190556419aa97229d1d6468482b58)]:
  - @kubernetes-models/string-util@3.0.0

## 1.1.0

### Minor Changes

- [`6bf5475`](https://github.com/tommy351/kubernetes-models-ts/commit/6bf5475a41905eccb7bacb0eb59d709f2535df81) Thanks [@tommy351](https://github.com/tommy351)! - Indent output of generated interfaces.

## 1.0.1

### Patch Changes

- [`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.cjs` to `.js`. (Revert [a9a3c18](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b))

- Updated dependencies [[`7c9d122`](https://github.com/tommy351/kubernetes-models-ts/commit/7c9d122689a55b644eb87b1661eb63c412302440)]:
  - @kubernetes-models/string-util@2.0.1

## 1.0.0

### Major Changes

- [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10.

### Patch Changes

- [`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b) Thanks [@tommy351](https://github.com/tommy351)! - Rename extension of CommonJS files from `.js` to `.cjs`.

- Updated dependencies [[`a9a3c18`](https://github.com/tommy351/kubernetes-models-ts/commit/a9a3c189111b1f4c6975f1c53cde69e724c6f35b), [`f77a5c1`](https://github.com/tommy351/kubernetes-models-ts/commit/f77a5c154b093aaaccdb74ce309076f9dedf3cc9)]:
  - @kubernetes-models/string-util@2.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/generate@0.4.0...@kubernetes-models/generate@0.4.1) (2021-05-30)

### Bug Fixes

- **generate:** Support nullable \$ref prop ([cb4979d](https://github.com/tommy351/kubernetes-models-ts/commit/cb4979dd9984c4cf6a91ae80a08f4696eef02828)), closes [#41](https://github.com/tommy351/kubernetes-models-ts/issues/41)

# [0.4.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/generate@0.3.0...@kubernetes-models/generate@0.4.0) (2021-05-30)

### Features

- **validate:** Support quantity format ([66f502b](https://github.com/tommy351/kubernetes-models-ts/commit/66f502bbc902e81df3c22293937d45d82343d2aa))

# [0.3.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/generate@0.2.2...@kubernetes-models/generate@0.3.0) (2021-05-20)

### Features

- **generate:** Allow null in JSON schema ([ad6e4b7](https://github.com/tommy351/kubernetes-models-ts/commit/ad6e4b773c6967e1995146c35c5d3932050db794))
- **generate:** Validate JSON schema ([68c9886](https://github.com/tommy351/kubernetes-models-ts/commit/68c9886ec32d6a1f6e0d72eeb193c147cfdce083))
- **validate:** Upgrade to ajv v8 ([44c6ce5](https://github.com/tommy351/kubernetes-models-ts/commit/44c6ce5f50b4847b6228ec059cd8b802bb671281))

## [0.2.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/generate@0.2.1...@kubernetes-models/generate@0.2.2) (2021-03-03)

### Bug Fixes

- Fix Node.js 10 support ([3cffdf0](https://github.com/tommy351/kubernetes-models-ts/commit/3cffdf0d0a0efc24fcc959d20c8bca657385488f))

## [0.2.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/generate@0.2.0...@kubernetes-models/generate@0.2.1) (2021-03-03)

**Note:** Version bump only for package @kubernetes-models/generate

# [0.2.0](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/generate@0.1.2...@kubernetes-models/generate@0.2.0) (2021-03-03)

### Features

- Rename extension of ESM files as ".mjs" ([025ac24](https://github.com/tommy351/kubernetes-models-ts/commit/025ac24948a07f2d48cc3fe4d3b6329749bc5c3a))

## [0.1.2](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/generate@0.1.1...@kubernetes-models/generate@0.1.2) (2021-02-28)

**Note:** Version bump only for package @kubernetes-models/generate

## [0.1.1](https://github.com/tommy351/kubernetes-models-ts/compare/@kubernetes-models/generate@0.1.0...@kubernetes-models/generate@0.1.1) (2021-02-28)

**Note:** Version bump only for package @kubernetes-models/generate

# 0.1.0 (2021-02-27)

### Features

- **crd-generate:** Generate aliases ([e16e6fe](https://github.com/tommy351/kubernetes-models-ts/commit/e16e6fe8736e95cfc48dcfe4ab2f244ac33bb380))
- **export-map:** Generate export map ([067b4e3](https://github.com/tommy351/kubernetes-models-ts/commit/067b4e303c0f662e113fc2ee65e8edf36a86c958))
- **generate:** Add generate package ([8ee6df8](https://github.com/tommy351/kubernetes-models-ts/commit/8ee6df84544c4101f5f44cc7fb4d292f1d8d9b90))
