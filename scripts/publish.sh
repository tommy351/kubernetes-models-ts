#!/bin/bash

set -Eeuo pipefail

npm run clean
npm run build
lerna publish
