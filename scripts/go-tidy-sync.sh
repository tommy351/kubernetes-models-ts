#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"

skip_diff_check=0
for arg in "$@"; do
  case "$arg" in
    --all|--force) skip_diff_check=1 ;;
  esac
done

if [[ $skip_diff_check -eq 0 ]]; then
  if ! git diff --cached --name-only | grep -qE '(^|/)(go\.(mod|sum|work)(\.sum)?|.*\.go)$'; then
    exit 0
  fi
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "scripts/go-tidy-sync.sh requires jq" >&2
  exit 1
fi

mapfile -t modules < <(go work edit -json | jq -r '.Use[].DiskPath')

for dir in "${modules[@]}"; do
  (cd "$dir" && go mod tidy)
done

go work sync

paths=(go.work go.work.sum)
for dir in "${modules[@]}"; do
  paths+=("$dir/go.mod" "$dir/go.sum")
done

git add -- "${paths[@]}"
