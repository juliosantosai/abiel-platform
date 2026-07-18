export {};

#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const srcRoot = path.join(repoRoot, 'src');
const tmpDir = path.join(repoRoot, 'tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const tsWrapperRegex = new RegExp('^const\\s+impl\\s*=\\s*require\\(__filename\\.replace\\(/\\.ts\\$, \\".js\\"\\)\\);\\s*export\\s*=\\s*impl;\\s*$', 'm');
const jsWrapperRegex = /^module\.exports\s*=\s*require\((['"])(.*?)\1\);?\s*$/;
const jsWrapperPureRegex = /^module\.exports\s*=\s*require\((['"])(.*?)\1\);?\s*$/;
const importRegex = /(?:import\s+(?:[^'";]+?)\s+from\s+['"]([^'"']+)['"])|(?:import\(['"]([^'"']+)['"]\))|(?:require\(['"]([^'"']+)['"]\))/g;

function walkDir(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(abs, callback);
    } else if (entry.isFile()) {
      callback(abs);
    }
  }
}

function relativePath(abs) {
  return path.relative(repoRoot, abs).split(path.sep).join('/');
}

function fileCategory(rel) {
  if (!rel) return 'other';
  const normalized = rel.replace(/\\/g, '/');
  if (normalized.startsWith('src/modules/')) {
    const parts = normalized.split('/');
    return parts[2] || 'modules';
  }
  const first = normalized.split('/')[1] || normalized.split('/')[0];
  if (['core', 'shared', 'infrastructure', 'engines', 'modules'].includes(first)) {
    return first;
  }
  return 'other';
}

function normalizeImportTarget(target) {
  return target.split(path.sep).join('/');
}

function resolveRelativeTarget(absFile, target) {
  if (!target.startsWith('.') && !target.startsWith('..')) return null;
  const sourceDir = path.dirname(absFile);
  const candidateBase = path.resolve(sourceDir, target);
  const ext = path.extname(target);
  const candidates = [];

  if (ext) {
    candidates.push(candidateBase);
  } else {
    candidates.push(`${candidateBase}.js`);
    candidates.push(`${candidateBase}.ts`);
    candidates.push(path.join(candidateBase, 'index.js'));
    candidates.push(path.join(candidateBase, 'index.ts'));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function isTestFile(rel) {
  return /(?:\.test\.(ts|js)$|\b__tests__\b|\/test\b|\\btest\\b)/.test(rel);
}

const files = [];
walkDir(srcRoot, (abs) => {
  if (abs.endsWith('.ts') || abs.endsWith('.js')) {
    files.push(abs);
  }
});

const stats = {
  totalFiles: files.length,
  tsFiles: 0,
  jsFiles: 0,
  tsWrappers: [],
  jsWrappers: [],
  jsWrapperDetails: [],
  jsImports: [],
  jsImportTargets: {},
  jsImportTargetsResolved: {},
  wrapperByCategory: {},
  wrapperReferences: {},
};

const wrapperCandidates = new Set();

for (const abs of files) {
  const rel = relativePath(abs);
  const content = fs.readFileSync(abs, 'utf8');

  if (abs.endsWith('.ts')) {
    stats.tsFiles += 1;
    if (tsWrapperRegex.test(content.trim())) {
      stats.tsWrappers.push(rel);
      const category = fileCategory(rel);
      stats.wrapperByCategory[category] = (stats.wrapperByCategory[category] || 0) + 1;
    }
  }

  if (abs.endsWith('.js')) {
    stats.jsFiles += 1;
    const trimmed = content.trim();
    const wrapperMatch = jsWrapperRegex.exec(trimmed);
    if (wrapperMatch) {
      const target = wrapperMatch[2];
      const isPureWrapper = jsWrapperPureRegex.test(trimmed);
      stats.jsWrappers.push(rel);
      stats.jsWrapperDetails.push({
        wrapper: rel,
        category: fileCategory(rel),
        isPureWrapper,
        target,
        references: 0,
        referencedBy: [],
        sourceType: isTestFile(rel) ? 'test' : 'code',
      });
      wrapperCandidates.add(rel);
    }
  }
}

const wrapperDetailsByPath = stats.jsWrapperDetails.reduce((acc, item) => {
  acc[item.wrapper] = item;
  return acc;
}, {});

for (const abs of files) {
  const rel = relativePath(abs);
  const content = fs.readFileSync(abs, 'utf8');
  const sourceType = isTestFile(rel) ? 'test' : 'code';

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const target = match[1] || match[2] || match[3];
    if (!target) continue;
    const normalized = normalizeImportTarget(target);
    const importEntry = {
      from: rel,
      target: normalized,
      resolved: null,
      sourceType,
    };

    const resolvedAbsolute = resolveRelativeTarget(path.join(repoRoot, rel), normalized);
    if (resolvedAbsolute) {
      const resolvedRel = relativePath(resolvedAbsolute);
      importEntry.resolved = resolvedRel;
      stats.jsImportTargetsResolved[resolvedRel] = (stats.jsImportTargetsResolved[resolvedRel] || 0) + 1;
      if (wrapperCandidates.has(resolvedRel)) {
        const detail = wrapperDetailsByPath[resolvedRel];
        detail.references += 1;
        detail.referencedBy.push(rel);
      }
    }

    if (normalized.endsWith('.js')) {
      stats.jsImports.push(importEntry);
      stats.jsImportTargets[normalized] = (stats.jsImportTargets[normalized] || 0) + 1;
    }
  }
}

const wrapperSummary = {
  totalWrappers: stats.jsWrappers.length,
  pureWrappers: stats.jsWrapperDetails.filter((w) => w.isPureWrapper).length,
  wrappersWithExtraCode: stats.jsWrapperDetails.filter((w) => !w.isPureWrapper).length,
  referencedWrappers: stats.jsWrapperDetails.filter((w) => w.references > 0).length,
  unreferencedWrappers: stats.jsWrapperDetails.filter((w) => w.references === 0).length,
};

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    totalFiles: stats.totalFiles,
    tsFiles: stats.tsFiles,
    jsFiles: stats.jsFiles,
    tsWrappers: stats.tsWrappers.length,
    jsWrappers: stats.jsWrappers.length,
    jsImportsExplicit: stats.jsImports.length,
    jsImportTargetsExplicit: Object.entries(stats.jsImportTargets).sort((a, b) => b[1] - a[1]).slice(0, 200),
    jsImportTargetsResolved: Object.entries(stats.jsImportTargetsResolved).sort((a, b) => b[1] - a[1]).slice(0, 200),
  },
  wrapperByCategory: stats.wrapperByCategory,
  wrapperSummary,
  tsWrappers: stats.tsWrappers,
  jsWrappers: stats.jsWrappers,
  jsWrapperDetails: stats.jsWrapperDetails.sort((a, b) => b.references - a.references || a.wrapper.localeCompare(b.wrapper)),
  jsImports: stats.jsImports,
};

const outputPath = path.join(tmpDir, 'wrapper-ts-audit.json');
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
console.log(`Wrapper TS audit written to ${outputPath}`);
console.log(`tsWrappers=${report.totals.tsWrappers} jsWrappers=${report.totals.jsWrappers} jsImportsExplicit=${report.totals.jsImportsExplicit}`);
console.log(`wrapperReferences=${report.wrapperSummary.referencedWrappers} unreferencedWrappers=${report.wrapperSummary.unreferencedWrappers}`);

