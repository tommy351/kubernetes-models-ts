#!/bin/bash
# First-time publish a single package and configure npm trusted publisher.
#
# Usage: scripts/first-publish.sh <package-name>
# Example: OTP=123456 scripts/first-publish.sh @kubernetes-models/foo

set -euo pipefail

PKG="${1:-}"
OTP="${OTP:-}"
REPO="tommy351/kubernetes-models-ts"
WORKFLOW="release.yml"

if [[ -z "$PKG" ]]; then
  echo "Usage: $0 <package-name>" >&2
  exit 1
fi

PUBLISH_ARGS=(--filter "$PKG" publish --no-git-checks --no-provenance)
TRUST_ARGS=(trust github "$PKG" --repository "$REPO" --file "$WORKFLOW" -y)
if [[ -n "$OTP" ]]; then
  PUBLISH_ARGS+=(--otp "$OTP")
  TRUST_ARGS+=(--otp "$OTP")
fi

echo "==> Publishing $PKG"
pnpm "${PUBLISH_ARGS[@]}"

echo "==> Configuring npm trust for $PKG"
npm "${TRUST_ARGS[@]}"
