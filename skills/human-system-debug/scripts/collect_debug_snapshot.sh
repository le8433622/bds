#!/usr/bin/env bash
set -euo pipefail

out_dir="${1:-./debug-snapshots}"
mkdir -p "$out_dir"

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
out_file="$out_dir/snapshot-$stamp.txt"

{
  echo "# Debug Snapshot"
  echo "timestamp_utc: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "cwd: $(pwd)"
  echo

  echo "## Host"
  uname -a || true
  echo

  echo "## Toolchain"
  node --version 2>/dev/null || echo "node: n/a"
  npm --version 2>/dev/null || echo "npm: n/a"
  python3 --version 2>/dev/null || echo "python3: n/a"
  git --version 2>/dev/null || echo "git: n/a"
  echo

  echo "## Git"
  git branch --show-current 2>/dev/null || true
  git status --short 2>/dev/null || true
  echo
  git log --oneline -5 2>/dev/null || true
  echo

  echo "## Environment (safe subset)"
  env | rg -N "^(APP_ENV|NODE_ENV|CI|USE_MOCK_API|API_BASE_URL|API_TIMEOUT_MS|API_RETRY_COUNT|API_RETRY_DELAY_MS|STAGING_)" || true
  echo

  echo "## Top-level files"
  ls -la || true
} > "$out_file"

echo "snapshot_written: $out_file"
