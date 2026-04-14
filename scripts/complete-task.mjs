#!/usr/bin/env node

import fs from 'node:fs';

const args = process.argv.slice(2);
const idIndex = args.indexOf('--id');
const fileIndex = args.indexOf('--file');
const dryRun = args.includes('--dry-run');

const taskId = idIndex >= 0 ? args[idIndex + 1] : null;
const filePath = fileIndex >= 0 ? args[fileIndex + 1] : 'docs/production-100-plan.md';

if (!taskId) {
  console.error('Missing --id <task-id> (example: --id A1.1)');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
let updated = false;

const nextLines = lines.map((line) => {
  const pattern = new RegExp(`^(\\s*- \\[ \\]\\s+)(${taskId.replace('.', '\\.')}(?:\\s|\\.|:).*)$`);
  const match = line.match(pattern);
  if (match) {
    updated = true;
    return line.replace('- [ ]', '- [x]');
  }

  return line;
});

if (!updated) {
  console.error(`Task id "${taskId}" not found as pending in ${filePath}`);
  process.exit(1);
}

if (!dryRun) {
  fs.writeFileSync(filePath, `${nextLines.join('\n')}\n`, 'utf8');
}

console.log(`${dryRun ? '[dry-run] ' : ''}Marked task ${taskId} as completed in ${filePath}`);
