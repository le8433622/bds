#!/usr/bin/env bash
set -euo pipefail

if [ -x "./node_modules/.bin/vitest" ]; then
  ./node_modules/.bin/vitest run "$@"
  exit 0
fi

echo "vitest binary not found in node_modules, falling back to npx with registry npmjs.org"
env \
  -u npm_config_http_proxy \
  -u npm_config_https_proxy \
  npx --yes --registry https://registry.npmjs.org vitest@3.2.4 run "$@"
