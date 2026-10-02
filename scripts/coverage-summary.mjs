// Prints the unit coverage totals (from Vitest's json-summary reporter) as a Markdown table for
// $GITHUB_STEP_SUMMARY. Warns instead of failing when the summary is missing.
import { existsSync, readFileSync } from 'node:fs';

const SUMMARY = 'coverage/coverage-summary.json';
const METRICS = ['lines', 'branches', 'functions', 'statements'];

if (!existsSync(SUMMARY)) {
  process.stdout.write(`::warning::${SUMMARY} not found — coverage summary skipped.\n`);
  process.exit(0);
}

const { total } = JSON.parse(readFileSync(SUMMARY, 'utf8'));
const rows = METRICS.map((metric) => `| ${metric} | ${total[metric].pct}% |`).join('\n');
process.stdout.write(`### Unit coverage\n\n| Metric | Covered |\n|---|---:|\n${rows}\n`);
