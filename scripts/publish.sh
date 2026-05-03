#!/bin/bash

set -euo pipefail

pnpm run clean
pnpm run build

PACKAGES=$(
  pnpm -r --json ls --depth -1 \
    | node -e 'for (const p of JSON.parse(require("node:fs").readFileSync(0, "utf8"))) if (!p.private && p.name && p.version) console.log(`${p.name}\t${p.version}`)'
)

while IFS=$'\t' read -r name version; do
  if [[ -n "$(npm view "$name@$version" version 2>/dev/null)" ]]; then
    echo "skip $name@$version (already published)"
    continue
  fi
  echo "publishing $name@$version"
  pnpm --filter "$name" publish --no-git-checks
done <<< "$PACKAGES"
