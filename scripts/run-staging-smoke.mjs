#!/usr/bin/env node

const env = process.env;
const enabled = String(env.STAGING_SMOKE_ENABLED ?? 'false').toLowerCase() === 'true';

if (!enabled) {
  console.log('Staging smoke skipped (set STAGING_SMOKE_ENABLED=true to run).');
  process.exit(0);
}

const baseUrl = env.STAGING_API_BASE_URL ?? env.API_BASE_URL;
if (!baseUrl) {
  console.error('Missing STAGING_API_BASE_URL (or API_BASE_URL).');
  process.exit(1);
}

const timeoutMs = Number(env.STAGING_SMOKE_TIMEOUT_MS ?? env.API_TIMEOUT_MS ?? 5000);
const maxTimeout = Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : 5000;

async function requestJson(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), maxTimeout);
  const url = `${baseUrl.replace(/\/$/, '')}${path}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'X-Request-Id': `staging-smoke-${Date.now()}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${path}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

try {
  const health = await requestJson('/health');
  if (!health || health.status !== 'ok') {
    throw new Error('Health payload invalid');
  }

  const properties = await requestJson('/properties?page=1&pageSize=3');
  if (!Array.isArray(properties)) {
    throw new Error('Properties response is not an array');
  }

  console.log('Staging smoke passed.');
  console.log(`- health.status: ${health.status}`);
  console.log(`- properties.count: ${properties.length}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Staging smoke failed: ${message}`);
  process.exit(1);
}
