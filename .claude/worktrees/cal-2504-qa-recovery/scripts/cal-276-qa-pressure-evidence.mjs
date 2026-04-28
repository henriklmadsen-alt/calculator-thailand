#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_SNAPSHOT_UTC = '2026-04-18T21:30:22.000Z';
const DEFAULT_OUTPUT_PATH = 'reports/cal-276-qa-pressure-evidence-2026-04-19.json';
const DEFAULT_QA_ROOTS = [
  'C:/paperclip-workspaces/calculator-thailand/app/reports/qa/cal-197/2026-04-19',
  'C:/paperclip-workspaces/calculator-thailand/app/reports/qa/cal-198/2026-04-19',
  'C:/paperclip-workspaces/calculator-thailand/app/reports/qa/cal-246/2026-04-19',
];
const DEFAULT_GA4_SNAPSHOT = {
  users7d: 685,
  users30m: 101,
  thaiUsers7d: 634,
  nonThaiUsers7d: 51,
};

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}

function walkJsonFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkJsonFiles(absolutePath, out);
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
      out.push(absolutePath);
    }
  }
  return out;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function getGeneratedAt(doc) {
  const candidates = [
    doc?.meta?.generatedAt,
    doc?.generatedAt,
    doc?.createdAt,
    doc?.timestamp,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

function getCheckUnits(doc) {
  const candidates = [
    doc?.summary?.totalChecks,
    doc?.summary?.total,
    doc?.summary?.checkedRoutes,
    doc?.meta?.checkedRoutes,
    doc?.meta?.totalChecks,
    Array.isArray(doc?.checks) ? doc.checks.length : null,
    Array.isArray(doc?.routeChecks) ? doc.routeChecks.length : null,
    Array.isArray(doc?.results) ? doc.results.length : null,
  ];

  for (const candidate of candidates) {
    if (Number.isFinite(candidate) && candidate > 0) {
      return candidate;
    }
  }

  return 0;
}

function aggregateByWindow(entries, snapshotTime, windowMinutes) {
  const lowerBound = windowMinutes === null
    ? null
    : new Date(snapshotTime.getTime() - (windowMinutes * 60_000));

  const selected = entries.filter((entry) => {
    if (entry.generatedAt > snapshotTime) return false;
    if (!lowerBound) return true;
    return entry.generatedAt >= lowerBound;
  });

  return {
    runs: selected.length,
    checkUnits: selected.reduce((sum, entry) => sum + entry.checkUnits, 0),
  };
}

function computeEstimate({ ga4Snapshot, qaWindowStats }) {
  const rawUsers = ga4Snapshot.users7d;
  const nonThaiUsers = ga4Snapshot.nonThaiUsers7d;
  const qaRuns7d = qaWindowStats.last7d.runs;
  const qaCheckUnits7d = qaWindowStats.last7d.checkUnits;
  const qaRuns60m = qaWindowStats.last60m.runs;
  const qaCheckUnits60m = qaWindowStats.last60m.checkUnits;

  const agentLow = Math.max(nonThaiUsers, Math.round(qaRuns7d * 4));
  const agentHigh = Math.min(rawUsers, Math.round(qaCheckUnits7d * 0.85));
  const agentPoint = Math.round((agentLow + agentHigh) / 2);

  const unknownLow = Math.round(rawUsers * 0.117);
  const unknownHigh = Math.round(rawUsers * 0.175);
  const unknownPoint = Math.round((unknownLow + unknownHigh) / 2);

  const realLow = Math.max(0, rawUsers - agentHigh - unknownHigh);
  const realHigh = Math.max(realLow, rawUsers - agentLow - unknownLow);
  const realPoint = Math.max(0, rawUsers - agentPoint - unknownPoint);

  const contaminationConfidence = (qaRuns60m >= 8 || qaCheckUnits60m >= 150)
    ? 'high'
    : 'medium';

  return {
    buckets: {
      likelyRealUsers: {
        pointEstimate: realPoint,
        range: {
          min: realLow,
          max: realHigh,
        },
      },
      likelyAgentOrInternal: {
        pointEstimate: agentPoint,
        range: {
          min: agentLow,
          max: agentHigh,
        },
      },
      unknownMixed: {
        pointEstimate: unknownPoint,
        range: {
          min: unknownLow,
          max: unknownHigh,
        },
      },
    },
    confidence: {
      contaminationPresent: contaminationConfidence,
      exactSplitPercentages: 'medium_low',
      exactRealUserCount: 'low',
    },
    modelNotes: [
      'Agent/internal lower bound = max(non-TH users, 4 users per QA run in 7d evidence).',
      'Agent/internal upper bound = 0.85 * QA check-units in 7d evidence.',
      'Unknown bucket = 11.7%-17.5% of raw 7d users for overlap and untagged sources.',
      'Likely real users = raw users - likely agent/internal - unknown.',
      'This is bounded estimation until traffic_actor tagging in CAL-275 is live.',
    ],
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const snapshotTime = new Date(args.snapshot || DEFAULT_SNAPSHOT_UTC);
  if (Number.isNaN(snapshotTime.getTime())) {
    throw new Error(`Invalid --snapshot value: ${args.snapshot}`);
  }

  const outputPath = args.out || DEFAULT_OUTPUT_PATH;
  const qaRoots = args['qa-root']
    ? String(args['qa-root']).split(',').map((item) => item.trim()).filter(Boolean)
    : DEFAULT_QA_ROOTS;

  const qaFiles = qaRoots.flatMap((root) => walkJsonFiles(root));
  const entries = [];

  for (const qaFile of qaFiles) {
    const parsed = readJson(qaFile);
    if (!parsed) continue;
    const generatedAt = getGeneratedAt(parsed);
    if (!generatedAt) continue;

    entries.push({
      qaFile,
      generatedAt,
      checkUnits: getCheckUnits(parsed),
    });
  }

  entries.sort((left, right) => left.generatedAt - right.generatedAt);

  const qaWindowStats = {
    last30m: aggregateByWindow(entries, snapshotTime, 30),
    last45m: aggregateByWindow(entries, snapshotTime, 45),
    last60m: aggregateByWindow(entries, snapshotTime, 60),
    last7d: aggregateByWindow(entries, snapshotTime, 7 * 24 * 60),
  };

  const estimate = computeEstimate({
    ga4Snapshot: DEFAULT_GA4_SNAPSHOT,
    qaWindowStats,
  });

  const payload = {
    issue: 'CAL-276',
    generatedAt: new Date().toISOString(),
    snapshotTimeUtc: snapshotTime.toISOString(),
    ga4Snapshot: DEFAULT_GA4_SNAPSHOT,
    qaEvidence: {
      qaRoots,
      filesParsed: entries.length,
      windows: qaWindowStats,
      runsBeforeSnapshot: aggregateByWindow(entries, snapshotTime, null).runs,
      checkUnitsBeforeSnapshot: aggregateByWindow(entries, snapshotTime, null).checkUnits,
      latestEntriesBeforeSnapshot: entries
        .filter((entry) => entry.generatedAt <= snapshotTime)
        .slice(-8)
        .map((entry) => ({
          generatedAt: entry.generatedAt.toISOString(),
          checkUnits: entry.checkUnits,
          qaFile: entry.qaFile,
        })),
    },
    estimate,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const outputSummary = {
    outputPath,
    windows: payload.qaEvidence.windows,
    buckets: payload.estimate.buckets,
    confidence: payload.estimate.confidence,
  };

  process.stdout.write(`${JSON.stringify(outputSummary, null, 2)}\n`);
}

main();
