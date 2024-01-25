# @kubernetes-models/gateway-api

## 0.5.0

### Minor Changes

- [#156](https://github.com/tommy351/kubernetes-models-ts/pull/156) [`42adf3a`](https://github.com/tommy351/kubernetes-models-ts/commit/42adf3a962f4dafd890601e9e0099a1d8101370b) Thanks [@lperdereau](https://github.com/lperdereau)! - Add experimental CDRs

## 0.4.0

### Minor Changes

- [#153](https://github.com/tommy351/kubernetes-models-ts/pull/153) [`6fddd92`](https://github.com/tommy351/kubernetes-models-ts/commit/6fddd92a86ff260ef757bc49798f978c38734a4e) Thanks [@leozhantw](https://github.com/leozhantw)! - bump to v1.0.0

## 0.3.1

### Patch Changes

- Updated dependencies [[`50d1914`](https://github.com/tommy351/kubernetes-models-ts/commit/50d19148027540e15edaa05360b76dc6e246b126)]:
  - @kubernetes-models/validate@3.1.1
  - @kubernetes-models/base@4.0.3
  - @kubernetes-models/apimachinery@1.2.1

## 0.3.0

### Minor Changes

- [`48d3d7b`](https://github.com/tommy351/kubernetes-models-ts/commit/48d3d7b62cdfb0bca3b966056fc5b238640ee74c) Thanks [@tommy351](https://github.com/tommy351)! - Update CRD version to v0.6.2.

### Patch Changes

- Updated dependencies [[`73daa2b`](https://github.com/tommy351/kubernetes-models-ts/commit/73daa2b36d44e88405e2337463fbb8999cddf359), [`09051d0`](https://github.com/tommy351/kubernetes-models-ts/commit/09051d0753e800ca3e7fd7c3f32c82cee1b6c154)]:
  - @kubernetes-models/apimachinery@1.2.0
  - @kubernetes-models/validate@3.1.0
  - @kubernetes-models/base@4.0.2

## 0.2.1

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

## 0.2.0

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

## 0.1.1

### Patch Changes

- [`f287a15`](https://github.com/tommy351/kubernetes-models-ts/commit/f287a159b596f9762706a7abca864543eee85680) Thanks [@tommy351](https://github.com/tommy351)! - Update `engines.node` to `>=14`.

## 0.1.0

### Minor Changes

- [#86](https://github.com/tommy351/kubernetes-models-ts/pull/86) [`d40cca6`](https://github.com/tommy351/kubernetes-models-ts/commit/d40cca6be19ee757cef01779e5c2dd52e636010c) Thanks [@tommy351](https://github.com/tommy351)! - First release.
