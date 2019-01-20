#!/bin/bash

set -Eeuo pipefail

rm -rf dist gen/ts
make dist
(cd dist && npm publish)
