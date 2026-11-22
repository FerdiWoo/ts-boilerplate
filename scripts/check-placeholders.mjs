import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const PLACEHOLDER_PATTERN = /\b(?:table1|table2|entity1|entity2)\b/gi;
const SCAN_ROOTS = ['src/server/db/schema', 'src/features', 'drizzle'];
const SCANNED_EXTENSIONS = new Set([
  '.cjs',
  '.js',
  '.jsx',
  '.json',
  '.mjs',
  '.sql',
  '.ts',
  '.tsx',
]);

function projectRoot() {
  const rootFlag = process.argv.indexOf('--root');
  if (rootFlag === -1) return process.cwd();

  const value = process.argv[rootFlag + 1];
  if (!value) throw new Error('--root requires a directory path.');
  return path.resolve(value);
}

async function filesUnder(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'ENOENT') return [];
    }
    throw error;
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return filesUnder(entryPath);
      if (!entry.isFile()) return [];
      return SCANNED_EXTENSIONS.has(path.extname(entry.name))
        ? [entryPath]
        : [];
    })
  );

  return files.flat();
}

async function placeholderFindings(root) {
  const files = (
    await Promise.all(
      SCAN_ROOTS.map((scanRoot) => filesUnder(path.join(root, scanRoot)))
    )
  ).flat();
  const findings = [];

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const lines = content.split(/\r?\n/);

    for (const [index, line] of lines.entries()) {
      PLACEHOLDER_PATTERN.lastIndex = 0;
      const matches = [...line.matchAll(PLACEHOLDER_PATTERN)];
      for (const match of matches) {
        findings.push({
          file: path.relative(root, file),
          line: index + 1,
          placeholder: match[0],
        });
      }
    }
  }

  return findings;
}

const root = projectRoot();
const findings = await placeholderFindings(root);

if (findings.length) {
  console.error('Replace boilerplate placeholders before shipping:');
  for (const finding of findings) {
    console.error(
      `- ${finding.file}:${finding.line} contains "${finding.placeholder}"`
    );
  }
  process.exitCode = 1;
} else {
  console.log('Placeholder check passed.');
}
