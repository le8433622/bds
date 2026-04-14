#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const now = new Date();
const yyyy = now.getUTCFullYear();
const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
const dd = String(now.getUTCDate()).padStart(2, '0');
const dateLabel = `${dd}/${mm}/${yyyy}`;

const progress = JSON.parse(
  execSync('node ./scripts/report-progress.mjs --json', { encoding: 'utf8', cwd: process.cwd() }),
);

const nextTasks = JSON.parse(
  execSync('node ./scripts/next-tasks.mjs --json --limit 5', { encoding: 'utf8', cwd: process.cwd() }),
);

const outputPath = path.resolve(process.cwd(), 'docs/bao-cao-tien-do-tu-dong.md');

const md = `# BÁO CÁO TIẾN ĐỘ TỰ ĐỘNG (GỬI GIÁM ĐỐC)\n\n` +
  `**Ngày báo cáo (UTC):** ${dateLabel}\n\n` +
  `## 1) Tình hình hiện tại\n` +
  `- Tiến độ tổng: **${progress.overall.percent}%**\n` +
  `- Hoàn thành: **${progress.overall.completed}/${progress.overall.total} tasks**\n` +
  `- Còn lại để đạt 100%: **${progress.overall.remainingTasks} tasks (${progress.overall.remainingPercentToTarget}%)**\n\n` +
  `## 2) Top 5 việc ưu tiên tiếp theo\n` +
  `${nextTasks.tasks.map((t, i) => `${i + 1}. [${t.section}] ${t.task}`).join('\n')}\n\n` +
  `## 3) Khi nào deploy được?\n` +
  `- Mốc go-live mục tiêu: **11/05/2026** (theo kế hoạch hiện tại).\n` +
  `- Chỉ deploy khi thỏa đồng thời: quality gate xanh, UAT pass, rollback drill đạt chuẩn, và checklist release không còn hạng mục chặn.\n\n` +
  `## 4) Đề xuất điều hành\n` +
  `- Duy trì mô hình triển khai theo batch nhỏ, review hằng ngày.\n` +
  `- Chỉ mở rộng phạm vi khi 5 việc ưu tiên trên đã hoàn tất và KPI kỹ thuật ổn định.\n` +
  `- Tiếp tục bám mốc RC/go-live đã thống nhất trong kế hoạch sản xuất.\n`;

fs.writeFileSync(outputPath, md, 'utf8');
console.log(`Generated ${outputPath}`);
