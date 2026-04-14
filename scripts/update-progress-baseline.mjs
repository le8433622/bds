#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

const reportRaw = execSync('node ./scripts/report-progress.mjs --json', {
  cwd: process.cwd(),
  encoding: 'utf8',
});

const report = JSON.parse(reportRaw);
const percent = Number(report?.overall?.percent ?? 0);

if (Number.isNaN(percent)) {
  console.error('Unable to compute overall progress percent.');
  process.exit(1);
}

const baselinePath = path.resolve(process.cwd(), '.ci/progress-baseline.json');
const payload = {
  overallPercent: Number(percent.toFixed(2)),
};

if (!dryRun) {
  fs.writeFileSync(baselinePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

console.log(`${dryRun ? '[dry-run] ' : ''}Updated ${baselinePath} -> overallPercent=${payload.overallPercent}`);
