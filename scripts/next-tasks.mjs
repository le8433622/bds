#!/usr/bin/env node

import fs from 'node:fs';

const args = process.argv.slice(2);
const limitIndex = args.indexOf('--limit');
const limit = limitIndex >= 0 ? Number(args[limitIndex + 1]) : 10;
const asJson = args.includes('--json');
const fileIndex = args.indexOf('--file');
const filePath = fileIndex >= 0 ? args[fileIndex + 1] : 'docs/production-100-plan.md';

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

const pending = [];
let currentHeading = '';

for (const line of lines) {
  if (/^##+\s+/.test(line)) {
    currentHeading = line.replace(/^#+\s+/, '').trim();
  }

  const match = line.match(/^\s*- \[ \]\s+(.*)$/);
  if (match) {
    pending.push({
      section: currentHeading || 'General',
      task: match[1].trim(),
    });
  }
}

const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
const selected = pending.slice(0, safeLimit);

if (asJson) {
  console.log(
    JSON.stringify(
      {
        source: filePath,
        totalPending: pending.length,
        limit: safeLimit,
        tasks: selected,
      },
      null,
      2,
    ),
  );
} else {
  console.log(`Next ${selected.length}/${pending.length} pending tasks from ${filePath}`);
  console.log('====================================================');
  selected.forEach((item, index) => {
    console.log(`${index + 1}. [${item.section}] ${item.task}`);
  });
}
