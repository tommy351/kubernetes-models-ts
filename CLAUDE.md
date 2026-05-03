# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

`kubernetes-models-ts` is a pnpm + Turbo monorepo that generates TypeScript models (with JSON-schema runtime validation) for Kubernetes core APIs and a large catalog of third-party CRDs. Most published packages are not hand-written: their `gen/` and `dist/` trees are produced by code generators in `utils/`.

## Workspace Layout

`pnpm-workspace.yaml` defines five workspace roots; each has a distinct role:

- `core/` — runtime libraries shipped to consumers.
  - `core/base` (`@kubernetes-models/base`): `Model` base class and resource registry (`src/model.ts`, `src/class.ts`).
  - `core/validate` (`@kubernetes-models/validate`): Ajv-based validator wired into every generated model.
- `first-party/` — Kubernetes API models.
  - `first-party/apimachinery`: shared `apimachinery` types.
  - `first-party/kubernetes-models`: top-level `kubernetes-models` package; built by `scripts/generate.ts` against the upstream OpenAPI schema using `@kubernetes-models/openapi-generate`.
- `third-party/` — one package per third-party CRD set (Argo, Cilium, Istio, …). Each package has a `crd-generate.input` array of CRD URLs/paths in its `package.json` and is built by `crd-generate`.
- `utils/` — generators and helpers used at build time.
  - `crd-generate`, `openapi-generate`: the two code generators that emit `gen/`.
  - `generate`: shared types/utilities the generators import.
  - `read-input`, `string-util`: small helpers.
- `internal/` — private (unpublished) tooling.
  - `publish-scripts`: the `publish-scripts build` / `publish-scripts prepack` CLI used by every publishable package (see "Build pipeline").
  - `diff-crd-inputs`: dev tool for diffing CRD input lists.

## Common Commands

```sh
pnpm install                 # bootstrap (Node >=22, pnpm >=11 required)
pnpm run build               # turbo build across workspace (concurrency 4)
pnpm run clean               # remove dist/, gen/, *.tsbuildinfo from every package
pnpm test                    # run vitest across the repo
pnpm vitest path/to/file     # run a single test file
pnpm vitest -t "name"        # run tests matching a name
pnpm run lint                # eslint + syncpack
pnpm exec syncpack fix-mismatches   # align cross-workspace dep versions
pnpm changeset               # add a changelog entry (Conventional Commits style)
```

Per-package builds run via `pnpm --filter <pkg> build`. A typical third-party package's `build` script is `crd-generate && publish-scripts build`; `kubernetes-models` runs `node scripts/generate.ts && publish-scripts build` instead.

### Adding a new third-party CRD package

```sh
pnpm run new-crd-package --name '<pkg>' --description '...' --author 'Name <email>'
pnpm install
# edit third-party/<pkg>/package.json: fill crd-generate.input with CRD URLs/paths
pnpm --filter @kubernetes-models/<pkg> build
# add README.md and __tests__/ (see existing packages)
```

`scripts/new-crd-package.ts` scaffolds `package.json`, `tsconfig.json`, and a changeset. It only creates packages under `third-party/`.

## Build Pipeline (publish-scripts)

`internal/publish-scripts/src/build.ts` is the per-package build for every publishable package. It assumes a generator has already produced `gen/` and:

1. Wipes `dist/`.
2. Runs `tsc --emitDeclarationOnly` against the package's `tsconfig.json` to emit `.d.ts` into `dist/`.
3. Transpiles each file in `gen/` with SWC (target ES2024, NodeNext modules) and minifies with SWC `minify` (no mangling); writes `.js` into `dist/`.
4. Generates an `exports` map from the contents of `gen/` (one entry per `index.ts`, plus wildcard entries) and writes `dist/package.json`. Files starting with `_` are excluded unless `--include-hidden` is set, in which case `_schemas/**/*.d.ts` is also copied verbatim.
5. Copies `README.md` into `dist/` if present.

`prepack` (`internal/publish-scripts/src/prepack.ts`) runs immediately before `npm pack`/`pnpm publish` and rewrites `dist/package.json`'s `version` and `*dependencies` from the package's root `package.json`. The `dist/` tree is what gets published — `publishConfig.directory` is set to `dist` in every package.

Implication: source under `gen/` is generator output and should not be edited by hand. Tests live in `__tests__/` next to `gen/` and import from the package's own `gen/` (or workspace siblings), not from `dist/`.

## Testing

- Vitest, configured at the repo root (`vitest.config.ts`). Test pattern is `**/__tests__/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`.
- `.vitest/setup.ts` extends `expect` with `jest-extended` matchers — they are available in every test.
- Tests typically construct a model, call `.validate()` (Ajv) and assert against the OpenAPI/CRD schema. Generators must be run before tests can pass on a fresh checkout: `pnpm run build` first.

## Releasing

- Changesets drive versioning. Each PR that changes a publishable package must add a `.changeset/*.md`. The `new-crd-package` script writes one automatically.
- `.github/workflows/release.yml` runs `changesets/action` on `master`. Publishing uses `scripts/publish.sh`, which does `pnpm run clean && pnpm run build && pnpm publish -r`.
- `pnpm-workspace.yaml` sets `minimumReleaseAge: 10080` (7 days) and `provenance: true`.

## Conventions Worth Knowing

- Conventional Commits (`feat:`, `fix:`, `chore:`, …); CRD bumps use `feat(<pkg>): Update CRDs to <version>` (see recent commits).
- `lodash`/`lodash-es` are blocked by ESLint; use `es-toolkit` instead.
- `@typescript-eslint/explicit-function-return-type` is `warn` with `allowExpressions: true` — top-level functions need explicit return types.
- `n/prefer-node-protocol` is on: import Node built-ins as `node:fs`, `node:path`, etc.
- All packages are ESM (`"type": "module"`); use `.js` extensions in relative imports.
- `syncpack` enforces consistent dep versions across the workspace; resolve mismatches rather than overriding per-package.
