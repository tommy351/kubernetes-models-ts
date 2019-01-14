#!/bin/bash

set -Eeuo pipefail

rm -rf dist gen/ts
make gen/ts
npm run build
cp {LICENSE,package.json,README.md} dist/
(cd dist && npm publish)
