# @kubernetes-models/external-secrets

## 0.3.0

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

## 0.2.0

### Minor Changes

- [#106](https://github.com/tommy351/kubernetes-models-ts/pull/106) [`167ea88`](https://github.com/tommy351/kubernetes-models-ts/commit/167ea88fe01cdbd5ef1d360610c22353667c1111) Thanks [@tommy351](https://github.com/tommy351)! - Update CRD version to v0.7.0.

### Patch Changes

- Updated dependencies []:
  - @kubernetes-models/apimachinery@1.1.0

## 0.1.0

### Minor Changes

- [#98](https://github.com/tommy351/kubernetes-models-ts/pull/98) [`357d82c`](https://github.com/tommy351/kubernetes-models-ts/commit/357d82c52d5ff181059ee8c6d2682113408fabf3) Thanks [@tommy351](https://github.com/tommy351)! - First release.
