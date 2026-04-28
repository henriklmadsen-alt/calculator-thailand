import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_ALERT_COOLDOWN_MINUTES,
  DEFAULT_CHECKPOINT_SLA_MINUTES,
  DEFAULT_HARD_ESCALATION_SLA_MINUTES,
  buildIssueAlertComment,
  createRuntimeConfig,
  markdownSummary,
  mentionForLane,
  minutesBetween,
  parseArgs,
} from './no-idle-watchdog.mjs';

test('parseArgs supports flags and key/value arguments', () => {
  const parsed = parseArgs(['--dry-run', '--checkpoint-sla-minutes', '45', '--lane-names', 'CTO,CMO']);
  assert.equal(parsed['dry-run'], true);
  assert.equal(parsed['checkpoint-sla-minutes'], '45');
  assert.equal(parsed['lane-names'], 'CTO,CMO');
});

test('createRuntimeConfig uses 30-minute watchdog defaults', () => {
  const config = createRuntimeConfig({
    argv: [],
    env: {},
    now: new Date('2026-04-16T00:00:00.000Z'),
  });

  assert.equal(config.checkpointSlaMinutes, DEFAULT_CHECKPOINT_SLA_MINUTES);
  assert.equal(config.hardEscalationSlaMinutes, DEFAULT_HARD_ESCALATION_SLA_MINUTES);
  assert.equal(config.cooldownMinutes, DEFAULT_ALERT_COOLDOWN_MINUTES);
  assert.deepEqual(config.laneNames, ['CTO', 'CMO', 'UXDesigner', 'SEO Specialist']);
});

test('createRuntimeConfig accepts CLI overrides', () => {
  const config = createRuntimeConfig({
    argv: ['--checkpoint-sla-minutes', '20', '--hard-sla-minutes', '40', '--cooldown-minutes', '10'],
    env: {},
    now: new Date('2026-04-16T00:00:00.000Z'),
  });

  assert.equal(config.checkpointSlaMinutes, 20);
  assert.equal(config.hardEscalationSlaMinutes, 40);
  assert.equal(config.cooldownMinutes, 10);
});

test('createRuntimeConfig falls back to PAPERCLIP_TASK_ID for no-issue alerts', () => {
  const config = createRuntimeConfig({
    argv: [],
    env: { PAPERCLIP_TASK_ID: 'de67ab08-f97f-42ff-a90d-768d9cec8f13' },
    now: new Date('2026-04-16T00:00:00.000Z'),
  });

  assert.equal(config.noIssueAlertTargetId, 'de67ab08-f97f-42ff-a90d-768d9cec8f13');
});

test('mentionForLane maps known names to expected @mentions', () => {
  assert.equal(mentionForLane('SEO Specialist'), '@SEOSpecialist');
  assert.equal(mentionForLane('UXDesigner'), '@UXDesigner');
  assert.equal(mentionForLane('Data Ops Team'), '@DataOpsTeam');
});

test('buildIssueAlertComment includes hard escalation copy when hardEscalation=true', () => {
  const markdown = buildIssueAlertComment({
    laneName: 'CTO',
    issueIdentifier: 'CAL-166',
    prefix: 'CAL',
    laneMention: '@CTO',
    inactivityMinutes: 61,
    checkpointSlaMinutes: 30,
    hardEscalationSlaMinutes: 60,
    lastActivityAt: '2026-04-16T01:00:00.000Z',
    runAt: '2026-04-16T02:01:00.000Z',
    hardEscalation: true,
  });

  assert.match(markdown, /Hard SLA breached\./);
  assert.match(markdown, /@CEO/);
  assert.match(markdown, /lane-key:cto/);
});

test('markdownSummary renders lane table with links', () => {
  const summary = markdownSummary(
    {
      runAt: '2026-04-16T00:00:00.000Z',
      runId: 'run-1',
      checkpointSlaMinutes: 30,
      hardEscalationSlaMinutes: 60,
      alertsPosted: 1,
      alertsSkippedCooldown: 0,
      lanes: [
        {
          laneName: 'CTO',
          state: 'breach',
          inactivityMinutes: 42,
          freshestIssueIdentifier: 'CAL-166',
          action: 'alert_posted',
        },
      ],
      errors: [],
    },
    'CAL',
  );

  assert.match(summary, /\| CTO \| breach \| 42 \| \[CAL-166\]\(\/CAL\/issues\/CAL-166\)/);
});

test('minutesBetween never returns a negative number', () => {
  const older = new Date('2026-04-16T00:00:00.000Z');
  const newer = new Date('2026-04-16T00:10:00.000Z');
  const reversed = minutesBetween(older, newer);
  assert.equal(reversed, 0);
});
