#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const baselinePath = path.resolve(process.cwd(), '.ci/progress-baseline.json');
const reportPath = path.resolve(process.cwd(), 'progress-report.json');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Invalid JSON content in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

function readReport() {
  if (fs.existsSync(reportPath)) {
    return readJson(reportPath);
  }

  try {
    const raw = execSync('node ./scripts/report-progress.mjs --json', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return JSON.parse(raw);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`Missing file: ${reportPath}`);
    console.error(`Also failed to generate progress JSON dynamically: ${reason}`);
    console.error('Provide progress-report.json or run `node ./scripts/report-progress.mjs --json > progress-report.json`.');
    process.exit(1);
  }
}

if (!fs.existsSync(baselinePath)) {
  console.error(`Missing file: ${baselinePath}`);
  process.exit(1);
}

const baseline = readJson(baselinePath);
const report = readReport();

const baselinePercent = Number(baseline.overallPercent ?? 0);
const currentPercent = Number(report?.overall?.percent ?? 0);

if (Number.isNaN(baselinePercent) || Number.isNaN(currentPercent)) {
  console.error('Invalid progress data: expected numeric percentages.');
  process.exit(1);
}

const epsilon = 1e-9;
if (currentPercent + epsilon < baselinePercent) {
  console.error(
    `Progress regression detected: current ${currentPercent.toFixed(2)}% < baseline ${baselinePercent.toFixed(2)}%`,
  );
  process.exit(1);
}

console.log(
  `Progress gate passed: current ${currentPercent.toFixed(2)}% >= baseline ${baselinePercent.toFixed(2)}%`,
);
