// OP-01 budget gate: the minified, uncompressed JS + CSS in dist/ must stay within 80 KB.
// Declarations, fonts and assets are excluded. Also verifies that every file target of
// package.json#exports exists, so a renamed build output cannot ship a broken export.
// Exits 1 when over budget, when an export target is missing or when dist/ is missing.
import { appendFileSync, existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUDGET_BYTES = 80 * 1024;
const DIST = 'dist';

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function exportTargets(exportsField) {
  if (typeof exportsField === 'string') return [exportsField];
  return Object.values(exportsField).flatMap(exportTargets);
}

if (!existsSync(DIST)) {
  process.stderr.write('size-check: dist/ not found — run `npm run build` first.\n');
  process.exit(1);
}

const { exports: exportsField } = JSON.parse(readFileSync('package.json', 'utf8'));
const missingExports = exportTargets(exportsField)
  .filter((target) => !target.includes('*'))
  .filter((target) => !existsSync(target));

const files = listFiles(DIST)
  .filter((path) => /\.(js|css)$/.test(path))
  .map((path) => ({ file: relative(DIST, path), bytes: statSync(path).size }))
  .sort((a, b) => a.file.localeCompare(b.file));
const total = files.reduce((sum, { bytes }) => sum + bytes, 0);
const isWithinBudget = total <= BUDGET_BYTES;

const rows = [
  '| File | Bytes |',
  '|---|---:|',
  ...files.map(({ file, bytes }) => `| \`${file}\` | ${bytes} |`),
  `| **Total** | **${total}** / ${BUDGET_BYTES} |`,
];
const missing = missingExports.length
  ? `\n**Missing export targets:** ${missingExports.map((target) => `\`${target}\``).join(', ')}\n`
  : '';
const report = `### Bundle size ${isWithinBudget ? 'within' : 'OVER'} budget\n\n${rows.join('\n')}\n${missing}`;

process.stdout.write(`${report}\n`);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
process.exit(isWithinBudget && missingExports.length === 0 ? 0 : 1);
