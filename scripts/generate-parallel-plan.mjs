#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const source = 'docs/production-100-plan.md';
const output = 'docs/ke-hoach-song-song-100.md';
const content = fs.readFileSync(source, 'utf8');
const lines = content.split(/\r?\n/);

const sections = new Map();
let current = 'General';

for (const line of lines) {
  const heading = line.match(/^##\s+(.+)$/);
  if (heading) {
    current = heading[1].trim();
    if (!sections.has(current)) sections.set(current, []);
    continue;
  }

  const task = line.match(/^\s*- \[ \]\s+(.+)$/);
  if (task) {
    if (!sections.has(current)) sections.set(current, []);
    sections.get(current).push(task[1].trim());
  }
}

const laneEntries = [...sections.entries()].filter(([, tasks]) => tasks.length > 0);
const maxRows = Math.max(...laneEntries.map(([, tasks]) => tasks.length), 0);

const tableHeader = ['| Wave | ' + laneEntries.map(([lane]) => lane).join(' | ') + ' |',
  '|---|' + laneEntries.map(() => '---').join('|') + '|'];

const tableRows = [];
for (let i = 0; i < maxRows; i += 1) {
  const cols = laneEntries.map(([, tasks]) => tasks[i] ?? '');
  tableRows.push(`| ${i + 1} | ${cols.join(' | ')} |`);
}

const md = [
  '# Kế hoạch chạy song song để tiến tới 100%',
  '',
  `**Nguồn dữ liệu:** ${source}`,
  '',
  '## Nguyên tắc triển khai đồng thời',
  '- Mỗi lane chạy tối đa 1 task active để tránh tắc nghẽn review.',
  '- Wave kế tiếp chỉ mở khi tất cả task cùng hàng đã có owner + deadline.',
  '- Ưu tiên xử lý blocker liên lane trước task tối ưu nhỏ.',
  '',
  '## Bảng phân rã song song (theo wave)',
  ...tableHeader,
  ...tableRows,
  '',
  '## Cách dùng',
  '1. Gán owner cho từng ô trong wave hiện tại.',
  '2. Chốt deadline 24h cho từng task.',
  '3. Cuối ngày cập nhật checklist và chạy lại generator này.',
  '',
].join('\n');

fs.writeFileSync(path.resolve(process.cwd(), output), md, 'utf8');
console.log(`Generated ${output}`);
