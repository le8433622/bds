#!/usr/bin/env node

import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const limitIndex = args.indexOf('--limit');
const limit = limitIndex >= 0 ? Number(args[limitIndex + 1]) : 3;
const apply = args.includes('--apply');
const updateBaseline = args.includes('--update-baseline');

const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 3;

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
}

console.log('=== Light-speed execution cycle ===');
console.log(`Mode: ${apply ? 'APPLY' : 'PREVIEW (dry-run)'}`);
console.log(`Batch size: ${safeLimit}`);

console.log('\n[1/4] Next pending tasks');
run(`node ./scripts/next-tasks.mjs --limit ${safeLimit}`);

console.log('\n[2/4] Complete next tasks');
if (apply) {
  run(`node ./scripts/complete-next-tasks.mjs --limit ${safeLimit}`);
} else {
  run(`node ./scripts/complete-next-tasks.mjs --limit ${safeLimit} --dry-run`);
}

console.log('\n[3/4] Progress report');
run('node ./scripts/report-progress.mjs');

if (apply && updateBaseline) {
  console.log('\n[4/4] Update progress baseline');
  run('node ./scripts/update-progress-baseline.mjs');
} else {
  console.log('\n[4/4] Baseline update skipped');
}

console.log('\nCycle completed.');
