#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const jsonFlag = args.includes('--json');
const eventsPathArgIndex = args.indexOf('--events');
const eventsPath = eventsPathArgIndex >= 0 ? args[eventsPathArgIndex + 1] : '.ci/analytics-events.json';
const outputPath = path.resolve(process.cwd(), 'docs/funnel-dashboard.md');

function readEvents(filePath) {
  const resolved = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    return [];
  }

  const raw = fs.readFileSync(resolved, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (Array.isArray(parsed.events)) {
      return parsed.events;
    }
  } catch {
    // fall through
  }
  return [];
}

function count(events, name) {
  return events.filter((event) => event?.name === name).length;
}

function percent(numerator, denominator) {
  if (!denominator) {
    return 0;
  }
  return Number(((numerator / denominator) * 100).toFixed(2));
}

const events = readEvents(eventsPath);
const searches = count(events, 'search_submitted');
const details = count(events, 'detail_viewed');
const saves = count(events, 'property_saved');
const contacts = count(events, 'contact_requested');

const metrics = {
  generatedAtUtc: new Date().toISOString(),
  source: eventsPath,
  counts: {
    searches,
    details,
    saves,
    contacts,
  },
  rates: {
    searchToDetail: percent(details, searches),
    detailToSave: percent(saves, details),
    detailToContact: percent(contacts, details),
  },
};

if (jsonFlag) {
  console.log(JSON.stringify(metrics, null, 2));
  process.exit(0);
}

const markdown = `# Funnel Dashboard

**Generated (UTC):** ${metrics.generatedAtUtc}
**Data source:** \`${metrics.source}\`

## Counts
- Searches: **${searches}**
- Detail views: **${details}**
- Saves: **${saves}**
- Contacts: **${contacts}**

## Conversion rates
- Search -> Detail: **${metrics.rates.searchToDetail}%**
- Detail -> Save: **${metrics.rates.detailToSave}%**
- Detail -> Contact: **${metrics.rates.detailToContact}%**
`;

fs.writeFileSync(outputPath, markdown, 'utf8');
console.log(`Generated ${outputPath}`);
