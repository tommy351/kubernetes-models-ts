# Contributing

## Getting Started

Download dependencies.

```sh
npm install
```

Bootstrap subpackages.

```sh
npm run bootstrap
```

## Developing

Build TypeScript files.

```sh
npm run build
```

Delete built files.

```sh
npm run clean
```

## Testing

Run tests.

```sh
npm test
```

## Linting

Lint TypeScript and JavaScript files.

```sh
npm run lint
```

## Adding a New CRD Package

Create a new CRD package.

```sh
npm run new-crd-package -- \
  --name 'pkg-name' \
  --description 'Package description' \
  --author 'John Doe (john.doe@gmail.com)'
```

Install dependencies.

```sh
npm run bootstrap
```

Add build scripts in `package.json`.

```js
{
  "scripts": {
    // Download CRD from a URL
    "build:url": "crd-generate --input https://example.com/manifest.yaml --output ./gen",
    // Or use a local file.
    "build:file": "crd-generate --input ./path/to/file.yaml --output ./gen"
  }
}
```

Build TypeScript files.

```sh
npm run build
```

Finally, add a `README.md` and tests. Please follow other CRD packages mentioned in [readme](README.md#3rd-party-models)

## Styleguides

### Git Commit Messages

Please follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/).

### Code Formatting

We use [Prettier](https://prettier.io/) to format all the code.
