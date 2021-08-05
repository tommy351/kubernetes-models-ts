#!/bin/bash

set -euo pipefail

pnpx changeset version
git add -A
git commit -m 'chore: update versions'
