#!/usr/bin/env node

import { execSync } from 'node:child_process';

function run(step, command) {
  try {
    execSync(command, {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: process.env,
    });
    console.log(`[START_OK] ${step}`);
  } catch (error) {
    console.error(`[START_FAIL] ${step}`);
    const reason = error instanceof Error ? error.message : String(error);
    console.error(reason);
    process.exit(1);
  }
}

const mode = String(process.env.USE_MOCK_API ?? 'true').toLowerCase() === 'true' ? 'mock' : 'backend';

console.log('Starting HomeFinder MVP system...');
console.log(`Runtime mode: ${mode}`);

run('backend-readiness', 'npm run check:backend:readiness');
run('staging-smoke', 'npm run check:staging:smoke');
run('app-smoke', 'npm run app:smoke');
run('kpi-alerts', 'npm run check:kpi-alerts');

console.log('System start completed.');
