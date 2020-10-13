#!/bin/bash

set -Eeuo pipefail

npm run clean
npm run build
npx lerna publish
