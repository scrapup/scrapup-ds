// OP-01 budget gate: the minified, uncompressed JS + CSS in dist/ must stay within 80 KB.
// Declarations, fonts and assets are excluded. Exits 1 when over budget or when dist/ is missing.
import { appendFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUDGET_BYTES = 81_920;
const DIST = 'dist';

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

if (!existsSync(DIST)) {
  process.stderr.write('size-check: dist/ not found — run `npm run build` first.\n');
  process.exit(1);
}

const files = listFiles(DIST)
  .filter((path) => /\.(js|css)$/.test(path))
  .map((path) => ({ file: relative(DIST, path), bytes: statSync(path).size }))
  .sort((a, b) => a.file.localeCompare(b.file));
const total = files.reduce((sum, { bytes }) => sum + bytes, 0);
const ok = total <= BUDGET_BYTES;

const rows = [
  '| File | Bytes |',
  '|---|---:|',
  ...files.map(({ file, bytes }) => `| \`${file}\` | ${bytes} |`),
  `| **Total** | **${total}** / ${BUDGET_BYTES} |`,
];
const report = `### Bundle size ${ok ? 'within' : 'OVER'} budget\n\n${rows.join('\n')}\n`;

process.stdout.write(`${report}\n`);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
process.exit(ok ? 0 : 1);
