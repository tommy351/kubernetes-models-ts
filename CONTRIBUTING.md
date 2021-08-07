# Contributing

## Getting Started

Download dependencies.

```sh
pnpm install
```

## Developing

Build TypeScript files.

```sh
pnpm run build
```

Delete built files.

```sh
pnpm run clean
```

## Testing

Run unit tests. Testing files are located at `__tests__` folder in each package.

```sh
pnpm test
```

## Linting

Lint TypeScript and JavaScript files.

```sh
pnpm run lint
```

## Adding a New CRD Package

Create a new CRD package.

```sh
pnpm run new-crd-package -- \
  --name 'pkg-name' \
  --description 'Package description' \
  --author 'John Doe <john.doe@gmail.com>'
```

Update workspaces.

```sh
pnpm install
```

Add input paths to `crd-generate.input` in `package.json`.

```js
{
  "crd-generate": {
    "input": [
      // Download CRD from a URL
      "https://example.com/manifest.yaml",
      // Or use a local file.
      "./path/to/file.yaml"
    ],
    "output": "./gen"
  }
}
```

Build TypeScript files.

```sh
pnpm run build
```

Finally, add a `README.md` and tests. Please follow other CRD packages mentioned in [readme](README.md#3rd-party-models)

## Styleguides

### Git Commit Messages

Please follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/).

### Code Formatting

We use [Prettier](https://prettier.io/) to format all the code.
