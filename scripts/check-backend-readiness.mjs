#!/usr/bin/env node

const env = process.env;
const useMockApi = String(env.USE_MOCK_API ?? 'true').toLowerCase() === 'true';
const baseUrl = env.API_BASE_URL ?? 'https://api.homefinder.example.com';
const timeoutMs = Number(env.API_TIMEOUT_MS ?? 5000);

if (useMockApi) {
  console.log('Backend readiness check skipped because USE_MOCK_API=true.');
  process.exit(0);
}

if (!baseUrl) {
  console.error('Missing API_BASE_URL.');
  process.exit(1);
}

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), Number.isFinite(timeoutMs) ? timeoutMs : 5000);

try {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/health`, {
    method: 'GET',
    signal: controller.signal,
    headers: {
      'X-Request-Id': `readiness-${Date.now()}`,
    },
  });

  if (!response.ok) {
    console.error(`Backend readiness failed: HTTP ${response.status}`);
    process.exit(1);
  }

  const payload = await response.json();
  if (!payload || payload.status !== 'ok') {
    console.error('Backend readiness failed: invalid health payload.');
    process.exit(1);
  }

  console.log(`Backend readiness passed (${payload.timestamp ?? 'timestamp-missing'}).`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Backend readiness failed: ${message}`);
  process.exit(1);
} finally {
  clearTimeout(timeout);
}
