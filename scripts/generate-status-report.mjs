#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const now = new Date();
const iso = now.toISOString();

const progress = JSON.parse(execSync('node ./scripts/report-progress.mjs --json', { encoding: 'utf8' }));
const nextTasks = JSON.parse(execSync('node ./scripts/next-tasks.mjs --json --limit 3', { encoding: 'utf8' }));

const lines = [
  '# Báo cáo tình hình hiện tại',
  '',
  `**Thời điểm tạo (UTC):** ${iso}`,
  '',
  '## Tổng quan',
  `- Tiến độ tổng: **${progress.overall.percent}%**`,
  `- Đã hoàn thành: **${progress.overall.completed}/${progress.overall.total} tasks**`,
  `- Còn lại: **${progress.overall.remainingTasks} tasks (${progress.overall.remainingPercentToTarget}%)**`,
  '',
  '## 3 việc ưu tiên kế tiếp',
  ...nextTasks.tasks.map((t, idx) => `${idx + 1}. [${t.section}] ${t.task}`),
  '',
  '## Khi nào deploy được?',
  '- Mốc kế hoạch hiện tại: **11/05/2026** (go-live MVP nếu đạt go/no-go).',
  '- Điều kiện bắt buộc trước deploy: pending tasks giảm về 0 cho checklist release trọng yếu, `npm run verify` xanh ổn định, UAT pass và rollback drill đạt ngưỡng.',
  '',
  '## Kết luận nhanh',
  '- Nền tảng kỹ thuật ổn định, trọng tâm còn lại là tích hợp UI production và hoàn thiện vận hành go-live.',
  '- Đề nghị bám sát batch nhỏ hằng ngày và cập nhật baseline khi có tăng trưởng tiến độ thực.',
  '',
];

const output = path.resolve(process.cwd(), 'docs/tinh-hinh-hien-tai.md');
fs.writeFileSync(output, lines.join('\n'), 'utf8');
console.log(`Generated ${output}`);
