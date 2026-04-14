#!/usr/bin/env node

import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const allowEmpty = args.includes('--allow-empty');

function parseNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

const thresholdSearchToDetail = parseNumber(process.env.KPI_MIN_SEARCH_TO_DETAIL, 85);
const thresholdDetailToSave = parseNumber(process.env.KPI_MIN_DETAIL_TO_SAVE, 8);
const thresholdDetailToContact = parseNumber(process.env.KPI_MIN_DETAIL_TO_CONTACT, 3);

let metrics;
try {
  const raw = execSync('node ./scripts/generate-funnel-dashboard.mjs --json', {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  metrics = JSON.parse(raw);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Cannot load funnel metrics: ${message}`);
  process.exit(1);
}

const searches = Number(metrics?.counts?.searches ?? 0);
if (searches === 0 && allowEmpty) {
  console.log('KPI alerts skipped: no analytics events available.');
  process.exit(0);
}

const searchToDetail = Number(metrics?.rates?.searchToDetail ?? 0);
const detailToSave = Number(metrics?.rates?.detailToSave ?? 0);
const detailToContact = Number(metrics?.rates?.detailToContact ?? 0);

const failures = [];
if (searchToDetail < thresholdSearchToDetail) {
  failures.push(`Search->Detail ${searchToDetail}% < ${thresholdSearchToDetail}%`);
}
if (detailToSave < thresholdDetailToSave) {
  failures.push(`Detail->Save ${detailToSave}% < ${thresholdDetailToSave}%`);
}
if (detailToContact < thresholdDetailToContact) {
  failures.push(`Detail->Contact ${detailToContact}% < ${thresholdDetailToContact}%`);
}

if (failures.length > 0) {
  console.error('KPI alert triggered:');
  for (const line of failures) {
    console.error(`- ${line}`);
  }
  process.exit(1);
}

console.log('KPI alert check passed.');
