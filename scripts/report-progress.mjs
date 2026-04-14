#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const files = [
  'docs/progress.md',
  'docs/production-100-plan.md',
];

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const noRepeat = args.includes('--no-repeat');
const record = args.includes('--record');
const failBelowIndex = args.indexOf('--fail-below');
const failBelowValue = failBelowIndex >= 0 ? Number(args[failBelowIndex + 1]) : null;
const targetIndex = args.indexOf('--target');
const targetValue = targetIndex >= 0 ? Number(args[targetIndex + 1]) : 100;
const snapshotPath = '.ci/last-progress-snapshot.json';

function parseChecklist(markdown) {
  const lines = markdown.split(/\r?\n/);
  let completed = 0;
  let total = 0;

  for (const line of lines) {
    const normalized = line.trim();

    if (/^- \[x\]/i.test(normalized)) {
      completed += 1;
      total += 1;
      continue;
    }

    if (/^- \[ \]/.test(normalized)) {
      total += 1;
    }
  }

  return { completed, total };
}

function formatPercent(completed, total) {
  if (total === 0) {
    return '0.00';
  }

  return ((completed / total) * 100).toFixed(2);
}

function readFileRelative(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.readFileSync(fullPath, 'utf8');
}

let globalCompleted = 0;
let globalTotal = 0;
const perFile = [];
if (!asJson && !noRepeat) {
  console.log('Project Progress Report');
  console.log('=======================');
}

for (const filePath of files) {
  const content = readFileRelative(filePath);
  const { completed, total } = parseChecklist(content);
  const percent = formatPercent(completed, total);

  globalCompleted += completed;
  globalTotal += total;
  perFile.push({
    file: filePath,
    completed,
    total,
    percent: Number(percent),
  });

  if (!asJson && !noRepeat) {
    console.log(`- ${filePath}: ${completed}/${total} tasks (${percent}%)`);
  }
}

const overallPercent = Number(formatPercent(globalCompleted, globalTotal));
const remainingPercent = Number(Math.max(0, targetValue - overallPercent).toFixed(2));
const remainingTasks = Math.max(0, globalTotal - globalCompleted);

let previousSnapshot = null;
if (noRepeat || record) {
  try {
    previousSnapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  } catch {
    previousSnapshot = null;
  }
}

if (noRepeat && previousSnapshot?.overallPercent === overallPercent && !asJson) {
  console.log(`No progress change since last snapshot (${overallPercent.toFixed(2)}%).`);
  process.exit(0);
}

if (noRepeat && !asJson) {
  if (typeof previousSnapshot?.overallPercent === 'number') {
    const delta = Number((overallPercent - previousSnapshot.overallPercent).toFixed(2));
    console.log(`Progress update: ${overallPercent.toFixed(2)}% (${delta >= 0 ? '+' : ''}${delta}%)`);
  } else {
    console.log(`Progress snapshot: ${overallPercent.toFixed(2)}%`);
  }
}

if (asJson) {
  console.log(
    JSON.stringify(
      {
        overall: {
          completed: globalCompleted,
          total: globalTotal,
          percent: overallPercent,
          remainingPercentToTarget: remainingPercent,
          remainingTasks,
          targetPercent: targetValue,
        },
        files: perFile,
      },
      null,
      2,
    ),
  );
} else if (!noRepeat) {
  console.log('-----------------------');
  console.log(`Overall: ${globalCompleted}/${globalTotal} tasks (${overallPercent.toFixed(2)}%)`);
  console.log(`Remaining to ${targetValue}%: ${remainingTasks} tasks (${remainingPercent.toFixed(2)}%)`);
}

if (typeof failBelowValue === 'number' && !Number.isNaN(failBelowValue)) {
  if (overallPercent < failBelowValue) {
    console.error(`Progress gate failed: overall ${overallPercent.toFixed(2)}% < required ${failBelowValue.toFixed(2)}%`);
    process.exit(1);
  }
}

if (record) {
  fs.writeFileSync(
    snapshotPath,
    `${JSON.stringify({ overallPercent, completed: globalCompleted, total: globalTotal }, null, 2)}\n`,
    'utf8',
  );
}
