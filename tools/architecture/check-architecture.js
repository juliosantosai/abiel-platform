#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../..");
const srcRoot = path.join(repoRoot, "src");
const rulesPath = path.join(__dirname, "layer-rules.json");
const rules = JSON.parse(fs.readFileSync(rulesPath, "utf8"));

function walk(dir, files) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, files);
      continue;
    }

    if (!entry.name.endsWith(".js")) {
      continue;
    }

    const relative = path.relative(repoRoot, abs).split(path.sep).join("/");
    const isExcluded = rules.excludePatterns.some((pattern) => relative.endsWith(pattern));
    if (isExcluded) {
      continue;
    }

    files.push({ abs, relative });
  }
}

function fileLayer(relativePath) {
  const normalized = relativePath.split(path.sep).join("/");
  const entries = Object.entries(rules.pathToLayer);
  for (const [prefix, layer] of entries) {
    if (normalized.startsWith(prefix)) {
      return layer;
    }
  }
  return "other";
}

function extractDependencies(content) {
  const refs = [];
  const requireRegex = /require\((['"])(.*?)\1\)/g;
  const importRegex = /import\s+(?:[^"']+\s+from\s+)?(['"])(.*?)\1/g;

  let m;
  while ((m = requireRegex.exec(content)) !== null) {
    refs.push(m[2]);
  }

  while ((m = importRegex.exec(content)) !== null) {
    refs.push(m[2]);
  }

  return refs;
}

function resolveImport(fromAbs, specifier) {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const fromDir = path.dirname(fromAbs);
  const candidate = path.resolve(fromDir, specifier);
  const variants = [candidate, `${candidate}.js`, path.join(candidate, "index.js")];

  for (const v of variants) {
    if (fs.existsSync(v) && fs.statSync(v).isFile()) {
      return v;
    }
  }

  return null;
}

function isLikelyLegacyWrapper(content) {
  const trimmed = content.trim();
  return /^module\.exports\s*=\s*require\((['"]).+?\1\);?/m.test(trimmed);
}

function hasWrapperContamination(content) {
  const firstLine = content.split(/\r?\n/, 1)[0] || "";
  const m = firstLine.match(/^\s*module\.exports\s*=\s*require\((['"]).+?\1\);?(.*)$/);
  if (!m) {
    return false;
  }
  return m[2].trim().length > 0;
}

function inSlice(relative, marker) {
  return relative.includes(`/${marker}/`) || relative.startsWith(`${marker}/`) || relative.includes(`${marker}/`);
}

function startsWithSafe(value, prefix) {
  return typeof value === "string" && typeof prefix === "string" && value.startsWith(prefix);
}

function isAllowedException(from, to) {
  const exceptions = rules.allowedImportExceptions || [];
  return exceptions.some((exception) => {
    if (exception.from && exception.to) {
      return exception.from === from && exception.to === to;
    }

    const fromOk = exception.fromPrefix ? startsWithSafe(from, exception.fromPrefix) : true;
    const toOk = exception.toPrefix ? startsWithSafe(to, exception.toPrefix) : true;
    return fromOk && toOk;
  });
}

const files = [];
walk(srcRoot, files);

const edges = [];
const prohibited = [];
const implicitContracts = [];
const cleanViolations = [];
const wrappers = [];
const contaminatedWrappers = [];

const graph = new Map();

for (const file of files) {
  const content = fs.readFileSync(file.abs, "utf8");
  const fromLayer = fileLayer(file.relative);

  if (isLikelyLegacyWrapper(content)) {
    wrappers.push(file.relative);
    if (hasWrapperContamination(content)) {
      contaminatedWrappers.push(file.relative);
    }
  }

  const refs = extractDependencies(content);
  graph.set(file.relative, []);

  for (const ref of refs) {
    const resolved = resolveImport(file.abs, ref);
    if (!resolved) {
      continue;
    }

    const toRelative = path.relative(repoRoot, resolved).split(path.sep).join("/");
    const toLayer = fileLayer(toRelative);
    edges.push({ from: file.relative, to: toRelative, fromLayer, toLayer, specifier: ref });
    graph.get(file.relative).push(toRelative);

    const allowed = rules.allowedDependencies[fromLayer] || [];
    if (fromLayer !== "other" && toLayer !== "other" && !allowed.includes(toLayer) && !isAllowedException(file.relative, toRelative)) {
      prohibited.push({ from: file.relative, fromLayer, to: toRelative, toLayer, specifier: ref });
    }

    const crossLayer = fromLayer !== toLayer && fromLayer !== "other" && toLayer !== "other";
    const deepPath = toRelative.split("/").length >= 5;
    if (crossLayer && deepPath) {
      implicitContracts.push({ from: file.relative, to: toRelative, fromLayer, toLayer, specifier: ref });
    }

    const fromDomain = inSlice(file.relative, "domain");
    const toInfrastructure = inSlice(toRelative, "infrastructure");
    const fromApplication = inSlice(file.relative, "application");

    if ((fromDomain || fromApplication) && toInfrastructure) {
      cleanViolations.push({ from: file.relative, to: toRelative, specifier: ref, rule: "domain/application cannot depend on infrastructure" });
    }
  }
}

function findCycles(dependencyGraph) {
  const visited = new Set();
  const stack = [];
  const inStack = new Set();
  const cycles = new Set();

  function visit(node) {
    visited.add(node);
    stack.push(node);
    inStack.add(node);

    const next = dependencyGraph.get(node) || [];
    for (const neighbor of next) {
      if (!dependencyGraph.has(neighbor)) {
        continue;
      }

      if (!visited.has(neighbor)) {
        visit(neighbor);
        continue;
      }

      if (inStack.has(neighbor)) {
        const idx = stack.indexOf(neighbor);
        if (idx >= 0) {
          const cycle = stack.slice(idx).concat(neighbor).join(" -> ");
          cycles.add(cycle);
        }
      }
    }

    stack.pop();
    inStack.delete(node);
  }

  for (const node of dependencyGraph.keys()) {
    if (!visited.has(node)) {
      visit(node);
    }
  }

  return Array.from(cycles).sort();
}

const cycles = findCycles(graph);

const layerEdgeCount = {};
for (const edge of edges) {
  const k = `${edge.fromLayer} -> ${edge.toLayer}`;
  layerEdgeCount[k] = (layerEdgeCount[k] || 0) + 1;
}

const inventoryLines = [
  "# Legacy Wrappers Inventory",
  "",
  `Generated at: ${new Date().toISOString()}`,
  `Total wrappers: ${wrappers.length}`,
  `Contaminated wrappers: ${contaminatedWrappers.length}`,
  "",
  "## Wrappers",
  ""
];

for (const file of wrappers) {
  inventoryLines.push(`- ${file}`);
}

if (contaminatedWrappers.length) {
  inventoryLines.push("", "## Contaminated Wrappers (contains legacy trailing code)", "");
  for (const file of contaminatedWrappers) {
    inventoryLines.push(`- ${file}`);
  }
}

const inventoryPath = path.join(repoRoot, "docs/arquitectura/wrappers-legacy-inventory.md");
if (process.argv.includes("--write-inventory")) {
  fs.writeFileSync(inventoryPath, inventoryLines.join("\n") + "\n", "utf8");
}

const report = {
  timestamp: new Date().toISOString(),
  totals: {
    filesScanned: files.length,
    edges: edges.length,
    wrappers: wrappers.length,
    contaminatedWrappers: contaminatedWrappers.length,
    prohibitedImports: prohibited.length,
    implicitContracts: implicitContracts.length,
    cleanArchitectureViolations: cleanViolations.length,
    cycles: cycles.length
  },
  layerEdgeCount,
  prohibited,
  cleanViolations,
  cycles,
  wrappers,
  contaminatedWrappers,
  implicitContracts: implicitContracts.slice(0, 200)
};

const reportPath = path.join(repoRoot, "tmp/architecture-report.json");
if (!fs.existsSync(path.dirname(reportPath))) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
}
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

console.log("Architecture fitness report generated:");
console.log(`- ${reportPath}`);
console.log(`- files scanned: ${report.totals.filesScanned}`);
console.log(`- edges: ${report.totals.edges}`);
console.log(`- prohibited imports: ${report.totals.prohibitedImports}`);
console.log(`- clean architecture violations: ${report.totals.cleanArchitectureViolations}`);
console.log(`- cycles: ${report.totals.cycles}`);
console.log(`- wrappers: ${report.totals.wrappers}`);
console.log(`- contaminated wrappers: ${report.totals.contaminatedWrappers}`);
console.log(`- implicit contracts (sampled): ${report.totals.implicitContracts}`);

if (prohibited.length) {
  console.log("\nProhibited imports:");
  for (const violation of prohibited.slice(0, 50)) {
    console.log(`- [${violation.fromLayer} -> ${violation.toLayer}] ${violation.from} -> ${violation.to}`);
  }
}

if (cleanViolations.length) {
  console.log("\nClean architecture violations:");
  for (const violation of cleanViolations.slice(0, 50)) {
    console.log(`- ${violation.from} -> ${violation.to} (${violation.rule})`);
  }
}

if (cycles.length) {
  console.log("\nDependency cycles:");
  for (const cycle of cycles.slice(0, 20)) {
    console.log(`- ${cycle}`);
  }
}

const strict = process.argv.includes("--strict");
const hasError = prohibited.length > 0 || cleanViolations.length > 0 || cycles.length > 0;
if (strict && hasError) {
  process.exit(1);
}
