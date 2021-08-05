#!/bin/bash

set -euo pipefail

pnpm run clean
pnpm run build
pnpm publish -r
