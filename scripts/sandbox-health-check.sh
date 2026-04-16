#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

echo "[sandbox-health] started_at=$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
echo "[sandbox-health] cwd=$(pwd)"

echo "[sandbox-health] git_branch=$(git branch --show-current 2>/dev/null || echo 'N/A')"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[sandbox-health] git_status_short:"
  git status --short || true
fi

echo "[sandbox-health] node=$(node -v 2>/dev/null || echo 'not-installed')"
echo "[sandbox-health] npm=$(npm -v 2>/dev/null || echo 'not-installed')"

echo "[sandbox-health] top_processes:"
ps -eo pid,comm,%cpu,%mem,args --sort=-%mem | head -n 12 || true

echo "[sandbox-health] listening_ports:"
if command -v ss >/dev/null 2>&1; then
  ss -ltnp || true
elif command -v netstat >/dev/null 2>&1; then
  netstat -ltnp || true
elif command -v lsof >/dev/null 2>&1; then
  lsof -iTCP -sTCP:LISTEN -n -P || true
else
  echo "No port-inspection tool found (ss/netstat/lsof)."
fi

echo "[sandbox-health] available core scripts:"
node - <<'NODE'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const wanted = ['verify','app:smoke','check:provenance','check:progress:gate','check:readiness:100:json'];
for (const name of wanted) {
  const ok = Object.prototype.hasOwnProperty.call(pkg.scripts ?? {}, name);
  console.log(`${name}: ${ok ? 'present' : 'missing'}`);
}
NODE

echo "[sandbox-health] finished_at=$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
