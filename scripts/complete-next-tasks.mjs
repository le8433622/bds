#!/usr/bin/env node

import fs from 'node:fs';

const args = process.argv.slice(2);
const limitIndex = args.indexOf('--limit');
const limit = limitIndex >= 0 ? Number(args[limitIndex + 1]) : 1;
const dryRun = args.includes('--dry-run');
const fileIndex = args.indexOf('--file');
const filePath = fileIndex >= 0 ? args[fileIndex + 1] : 'docs/production-100-plan.md';

const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 1;

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

let completed = 0;
const updatedLines = lines.map((line) => {
  if (completed >= safeLimit) {
    return line;
  }

  if (/^\s*- \[ \]\s+/.test(line)) {
    completed += 1;
    return line.replace('- [ ]', '- [x]');
  }

  return line;
});

if (completed === 0) {
  console.error(`No pending tasks found in ${filePath}`);
  process.exit(1);
}

if (!dryRun) {
  fs.writeFileSync(filePath, `${updatedLines.join('\n')}\n`, 'utf8');
}

console.log(`${dryRun ? '[dry-run] ' : ''}Marked ${completed} task(s) as completed in ${filePath}`);
