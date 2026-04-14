#!/usr/bin/env bash
set -euo pipefail

# Some CI sandboxes inject npm env keys that generate warnings in npm v11.
# Run npm under a clean env for proxy-related keys.
env \
  -u npm_config_http_proxy \
  -u npm_config_https_proxy \
  npm config set registry https://registry.npmjs.org/

echo "Installing dependencies from $(env -u npm_config_http_proxy -u npm_config_https_proxy npm config get registry)..."

NPM_CMD="install"
if [ -f "package-lock.json" ]; then
  NPM_CMD="ci"
fi

env \
  -u npm_config_http_proxy \
  -u npm_config_https_proxy \
  npm "$NPM_CMD" "$@"
