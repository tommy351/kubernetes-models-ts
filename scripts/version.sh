#!/bin/bash

set -euo pipefail

pnpx changeset version
pnpm install --lockfile-only
git add -A
git commit -m 'chore: update versions'
