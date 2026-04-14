#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SKILL_DIR/../.." && pwd)"

loops=3
out_dir="$REPO_ROOT/debug-snapshots/continuous"

while (($#)); do
  case "$1" in
    --loops)
      loops="${2:-}"
      shift 2
      ;;
    --out-dir)
      out_dir="${2:-}"
      shift 2
      ;;
    *)
      echo "unknown_argument: $1" >&2
      echo "usage: bash scripts/debug_iteration_loop.sh [--loops N] [--out-dir PATH]" >&2
      exit 2
      ;;
  esac
done

if ! [[ "$loops" =~ ^[0-9]+$ ]] || [[ "$loops" -lt 1 ]]; then
  echo "invalid_loops: $loops" >&2
  exit 2
fi

mkdir -p "$out_dir"
run_stamp="$(date -u +%Y%m%dT%H%M%SZ)"
report_file="$out_dir/debug-loop-$run_stamp.md"

cd "$REPO_ROOT"

commands=(
  "npm start"
  "npm run app:smoke"
  "npm run verify"
  "npm run check:readiness:100"
  "npm run check:progress:gate"
)

sanitize_cmd() {
  echo "$1" | tr ' ' '_' | tr -cd '[:alnum:]_-'
}

{
  echo "# Debug Iteration Loop"
  echo
  echo "- timestamp_utc: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "- repo_root: $REPO_ROOT"
  echo "- loops: $loops"
  echo
} > "$report_file"

failure_count=0

for i in $(seq 1 "$loops"); do
  echo "loop_start: $i/$loops"
  {
    echo "## Loop $i"
    echo
  } >> "$report_file"

  snapshot_line="$(bash "$SCRIPT_DIR/collect_debug_snapshot.sh" "$out_dir" | tail -n 1)"
  snapshot_path="${snapshot_line#snapshot_written: }"
  {
    echo "- snapshot: $snapshot_path"
  } >> "$report_file"

  loop_failed=0

  for cmd in "${commands[@]}"; do
    cmd_slug="$(sanitize_cmd "$cmd")"
    log_file="$out_dir/loop-${i}-${cmd_slug}.log"
    start_ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

    if eval "$cmd" >"$log_file" 2>&1; then
      end_ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
      {
        echo "- [PASS] \`$cmd\`"
        echo "  - started_utc: $start_ts"
        echo "  - ended_utc: $end_ts"
        echo "  - log: $log_file"
      } >> "$report_file"
    else
      end_ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
      {
        echo "- [FAIL] \`$cmd\`"
        echo "  - started_utc: $start_ts"
        echo "  - ended_utc: $end_ts"
        echo "  - log: $log_file"
      } >> "$report_file"
      loop_failed=1
      failure_count=$((failure_count + 1))
      break
    fi
  done

  if [[ "$loop_failed" -eq 0 ]]; then
    echo "- loop_result: PASS" >> "$report_file"
  else
    echo "- loop_result: FAIL" >> "$report_file"
    echo
    echo "loop_fail: $i/$loops"
    break
  fi

  echo >> "$report_file"
done

{
  echo
  echo "## Summary"
  echo "- failures: $failure_count"
  if [[ "$failure_count" -eq 0 ]]; then
    echo "- status: PASS"
  else
    echo "- status: FAIL"
  fi
} >> "$report_file"

echo "report_written: $report_file"

if [[ "$failure_count" -gt 0 ]]; then
  exit 1
fi
