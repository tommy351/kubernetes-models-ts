# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

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
- `third-party/` — one package per third-party CRD set (Argo, Cilium, Istio, …). Most have a `crd-generate.input` array of CRD URLs/paths in `package.json` and are built by `crd-generate`; a few (`prometheus-operator`, `gateway-api`) use `go-generate` instead — see "Generating from Go sources" below.
- `utils/` — generators and helpers used at build time.
  - `crd-generate`, `openapi-generate`: the two code generators that emit `gen/`.
  - `generate`: shared types/utilities the generators import.
  - `read-input`, `string-util`: small helpers.
- `internal/` — private (unpublished) tooling.
  - `publish-scripts`: the `publish-scripts build` / `publish-scripts prepack` CLI used by generated model packages (see "Generated model build pipeline").
  - `diff-crd-inputs`: dev tool for diffing CRD input lists.
  - `go-generate`: alternative model generator (`go-generate` CLI) that extracts schemata from upstream Go API packages instead of CRD YAML. See "Generating from Go sources".

## Common Commands

```sh
pnpm install                 # bootstrap (Node >=22, pnpm >=11 required)
pnpm run build               # turbo build across workspace (concurrency 4)
pnpm run build --filter <pkg>    # build a single package (Turbo --filter)
pnpm run build --force           # force rebuild, bypass Turbo cache
pnpm run clean               # remove dist/, gen/, *.tsbuildinfo from every package
pnpm test                    # run vitest across the repo
pnpm vitest path/to/file     # run a single test file
pnpm vitest -t "name"        # run tests matching a name
pnpm run lint                # eslint + syncpack
pnpm exec syncpack fix-mismatches   # align cross-workspace dep versions
pnpm changeset               # add a changelog entry (Conventional Commits style)
```

Always build from the repo root via `pnpm run build` so Turbo orders dependencies correctly; pass `--filter <pkg>` to scope to one package and `--force` to bypass the Turbo cache. A typical third-party package's `build` script is `crd-generate && publish-scripts build`; packages on go-generate use `go-generate && publish-scripts build`; `kubernetes-models` runs `node scripts/generate.ts && publish-scripts build` instead.

### Adding a new third-party CRD package

```sh
pnpm run new-crd-package --name '<pkg>' --description '...' --author 'Name <email>'
pnpm install
# edit third-party/<pkg>/package.json: fill crd-generate.input with CRD URLs/paths
pnpm run build --filter @kubernetes-models/<pkg>
# add README.md and __tests__/ (see existing packages)
```

`scripts/new-crd-package.ts` scaffolds `package.json`, `tsconfig.json`, and a changeset. It only creates packages under `third-party/`.

### Updating a third-party CRD package

For each package, work one at a time and only commit if every step succeeds:

1. Find the latest upstream tag (e.g. `gh api repos/<owner>/<repo>/tags --jq '.[].name'` filtered for the relevant prefix).
2. Edit the version pin(s) in `third-party/<pkg>/package.json` `crd-generate.input`. Keep historical anchor URLs that intentionally pin earlier API versions (see e.g. `cert-manager`, `contour`).
3. `pnpm run build` from the repo root (so generated `gen/` is up to date) and `pnpm run lint`.
4. `pnpm test --run third-party/<pkg>` — if test fixtures fail because the upstream schema got stricter (new required fields, regex patterns, etc.), the bump is breaking; revert and skip.
5. Run `pnpm diff-crd-inputs --base master --package third-party/<pkg>`. The tool reports any CRD kinds/versions that exist on `master` but not in the working tree. If it reports removals, **add the new YAML URL and keep only the specific old YAML files that contain the removed kinds/versions** — drop any old URLs whose kinds are still covered by the new release. Re-run the build/test/diff after appending.
6. List the upstream CRD directory (`gh api repos/<owner>/<repo>/contents/<path>?ref=<tag> --jq '.[].name'`) and add any extra files whose top-level `kind` is `CustomResourceDefinition`. Skip kustomization/install/RBAC manifests and any kinds already covered by URLs from a sibling subproject in the same `package.json`.
7. Add a changeset:
   ```md
   ---
   "@kubernetes-models/<pkg>": minor
   ---

   Update CRDs to v<X.Y.Z>.
   ```
8. Commit as `feat(<pkg>): Update CRDs to v<X.Y.Z>`.

### Generating from Go sources (go-generate)

`@kubernetes-models/go-generate` is an alternative to `crd-generate` that reads schemata directly from a project's Go API packages via controller-tools, instead of post-CRD YAML. It produces the same `gen/` layout (`gen/<group>/<version>/<Kind>.ts` plus `gen/_schemas/`) so `publish-scripts build` consumes it identically. Prefer this when upstream ships Go types (e.g. operators using `+kubebuilder` markers) — non-CRD root types and shared structs surface as named TypeScript interfaces (`IFooSpec`) instead of being reachable only via `IFoo['spec']`.

Per-package wiring:

- `package.json` declares `"build": "go-generate && publish-scripts build"`, adds `@kubernetes-models/go-generate` as a devDependency and `kubernetes-models` as a regular dep (core K8s types are imported from there, `metav1.ObjectMeta` from `@kubernetes-models/apimachinery`), and lists Go package paths under `go-generate.input` (e.g. `sigs.k8s.io/gateway-api/apis/v1`).
- A `go.mod` in the package root pins the upstream module and declares each input under `tool (...)`; `go mod tidy` fills the rest. The package directory is then added to the workspace's root `go.work` so a single `go run` from the helper resolves both.
- Building requires Go on PATH (the `install-deps` GitHub Action sets this up). The helper at `internal/go-generate/go` is invoked with `go run`; its stdout JSON is piped into the TS generator at `internal/go-generate/src/generate.ts`.

To bump the upstream Go module, edit the `require` line in the package's `go.mod`, `go mod tidy`, `pnpm run build --filter <pkg> --force`, `pnpm test --run third-party/<pkg>`. Add the changeset and commit as `feat(<pkg>): Update <module> to v<X.Y.Z>`.

To migrate a `crd-generate` package to `go-generate`: swap the `build` script and `crd-generate` → `go-generate` config block in `package.json`; add `kubernetes-models` to deps and `@kubernetes-models/go-generate` to devDeps; create `go.mod` with the upstream module and `tool` directives; append the package path to `go.work`; rerun `pnpm install` and `go mod tidy`. The migration is a major bump (field-type names change from indexed access to `I<Kind><Field>` aliases).

## Generated Model Build Pipeline (publish-scripts)

`internal/publish-scripts/src/build.ts` is the per-package build for generated first-party and third-party model packages. It assumes a generator has already produced `gen/` and:

1. Wipes `dist/`.
2. Runs `tsc --emitDeclarationOnly` against the package's `tsconfig.json` to emit `.d.ts` into `dist/`.
3. Transpiles each file in `gen/` with SWC (target ES2024, NodeNext modules) and minifies with SWC `minify` (no mangling); writes `.js` into `dist/`.
4. Generates an `exports` map from the contents of `gen/` (one entry per `index.ts`, plus wildcard entries) and writes `dist/package.json`. Files starting with `_` are excluded unless `--include-hidden` is set, in which case `_schemas/**/*.d.ts` is also copied verbatim.
5. Copies `README.md` into `dist/` if present.

`prepack` (`internal/publish-scripts/src/prepack.ts`) runs immediately before `npm pack`/`pnpm publish` and rewrites `dist/package.json`'s `version` and `*dependencies` from the package's root `package.json`. For generated model packages, the `dist/` tree is what gets published — `publishConfig.directory` is set to `dist`. Core and utility packages publish from the package root and use `files` entries such as `/dist/` instead.

Implication: source under `gen/` is generator output and should not be edited by hand. Tests live in `__tests__/` next to `gen/` and import from the package's own `gen/` (or workspace siblings), not from `dist/`.

## Testing

- Vitest, configured at the repo root (`vitest.config.ts`). Test pattern is `**/__tests__/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}`.
- `.vitest/setup.ts` extends `expect` with `jest-extended` matchers — they are available in every test.
- Tests typically construct a model, call `.validate()` (Ajv) and assert against the OpenAPI/CRD schema. Generators must be run before tests can pass on a fresh checkout: `pnpm run build` first.

## Releasing

- Changesets drive versioning. Each PR that changes a publishable package must add a `.changeset/*.md`. The `new-crd-package` script writes one automatically.
- `.github/workflows/release.yml` runs `changesets/action` on `master`. Publishing uses `scripts/publish.sh`, which does `pnpm run clean && pnpm run build`, enumerates non-private workspace packages, skips versions already present on npm, and publishes the remaining packages one at a time with `pnpm --filter <name> publish --no-git-checks`.
- `pnpm-workspace.yaml` sets `minimumReleaseAge: 10080` (7 days) and `provenance: true`.

## Conventions Worth Knowing

- Use Conventional Commits (`feat:`, `fix:`, `chore:`, …); CRD bumps use `feat(<pkg>): Update CRDs to <version>` (see recent commits).
- Don't run Prettier manually — the pre-commit git hook runs `lint-staged`, which applies `eslint --fix` to staged JS/TS files.
- `lodash`/`lodash-es` are blocked by ESLint; use `es-toolkit` instead.
- `@typescript-eslint/explicit-function-return-type` is `warn` with `allowExpressions: true` — top-level functions need explicit return types.
- `n/prefer-node-protocol` is on: import Node built-ins as `node:fs`, `node:path`, etc.
- All packages are ESM (`"type": "module"`); use `.js` extensions in relative imports.
- `syncpack` enforces consistent dep versions across the workspace; resolve mismatches rather than overriding per-package.
