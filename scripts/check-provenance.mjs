import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const requiredFields = [
  'id',
  'source_name',
  'source_url',
  'license_type',
  'tos_clause',
  'collected_at',
  'owner',
  'confidence_score',
  'last_verified_at',
];


function isAllowedSourceUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:', 'internal:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function isIsoDate(value) {
  if (typeof value !== 'string') return false;
  const time = Date.parse(value);
  return Number.isFinite(time);
}

function validateSource(source, index) {
  const prefix = `sources[${index}]`;

  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    throw new Error(`${prefix} must be an object`);
  }

  for (const field of requiredFields) {
    if (!(field in source)) {
      throw new Error(`${prefix} missing required field: ${field}`);
    }
  }

  for (const field of requiredFields) {
    if (field === 'confidence_score') continue;
    if (typeof source[field] !== 'string' || source[field].trim().length === 0) {
      throw new Error(`${prefix}.${field} must be a non-empty string`);
    }
  }

  if (!isIsoDate(source.collected_at)) {
    throw new Error(`${prefix}.collected_at must be ISO date string`);
  }

  if (!isIsoDate(source.last_verified_at)) {
    throw new Error(`${prefix}.last_verified_at must be ISO date string`);
  }

  if (!isAllowedSourceUrl(source.source_url)) {
    throw new Error(`${prefix}.source_url must be a valid URL with protocol http, https, or internal`);
  }

  if (typeof source.confidence_score !== 'number' || source.confidence_score < 0 || source.confidence_score > 1) {
    throw new Error(`${prefix}.confidence_score must be a number from 0 to 1`);
  }

  const collectedAt = Date.parse(source.collected_at);
  const lastVerifiedAt = Date.parse(source.last_verified_at);
  if (lastVerifiedAt < collectedAt) {
    throw new Error(`${prefix}.last_verified_at must be on/after collected_at`);
  }
}

function main() {
  const file = resolve(process.cwd(), 'docs/data-sources.json');
  const content = readFileSync(file, 'utf8');
  const data = JSON.parse(content);

  if (!data || typeof data !== 'object' || !Array.isArray(data.sources)) {
    throw new Error('docs/data-sources.json must be an object containing a sources array');
  }

  if (data.sources.length === 0) {
    throw new Error('docs/data-sources.json sources array must not be empty');
  }

  data.sources.forEach((source, index) => validateSource(source, index));
  console.log(`Provenance check passed for ${data.sources.length} source(s).`);
}

main();
