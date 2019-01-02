#!/bin/bash

set -e

make gen/ts
npm run build
lerna publish
