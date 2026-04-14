#!/usr/bin/env node

import fs from 'node:fs';

const args = process.argv.slice(2);
const reportOnly = args.includes('--report-only');
const asJson = args.includes('--json');

const files = ['docs/progress.md', 'docs/production-100-plan.md'];

function countPending(content) {
  const lines = content.split(/\r?\n/);
  return lines.reduce((acc, line) => acc + (/^\s*- \[ \]\s+/.test(line) ? 1 : 0), 0);
}

const details = files.map((file) => {
  const content = fs.readFileSync(file, 'utf8');
  return { file, pending: countPending(content) };
});

const totalPending = details.reduce((sum, item) => sum + item.pending, 0);

if (asJson) {
  console.log(
    JSON.stringify(
      {
        readyFor100: totalPending === 0,
        totalPending,
        files: details,
      },
      null,
      2,
    ),
  );
} else {
  console.log('Readiness 100% check');
  console.log('====================');
  for (const d of details) {
    console.log(`- ${d.file}: pending ${d.pending}`);
  }
  console.log(`Total pending: ${totalPending}`);
}

if (totalPending === 0) {
  if (!asJson) {
    console.log('Result: READY_FOR_100');
  }
  process.exit(0);
}

if (reportOnly) {
  if (!asJson) {
    console.log('Result: NOT_READY_FOR_100 (report only)');
  }
  process.exit(0);
}

if (!asJson) {
  console.error('Result: NOT_READY_FOR_100');
}
process.exit(1);
