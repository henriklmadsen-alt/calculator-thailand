function normalizeRoute(route) {
  if (!route) {
    return '/';
  }

  let value = String(route).trim();
  if (!value.startsWith('/')) {
    value = `/${value}`;
  }
  if (value !== '/' && !value.endsWith('/')) {
    value = `${value}/`;
  }
  return value;
}

function sortUniqueRoutes(routes) {
  return [...new Set((routes || []).map((route) => normalizeRoute(route)))].sort((a, b) => a.localeCompare(b));
}

export function diffExpectedRoutes(expectedRoutes, observedRoutes) {
  const expected = sortUniqueRoutes(expectedRoutes);
  const observed = sortUniqueRoutes(observedRoutes);
  const observedSet = new Set(observed);
  const expectedSet = new Set(expected);

  return {
    expectedRoutes: expected,
    observedRoutes: observed,
    missingRoutes: expected.filter((route) => !observedSet.has(route)),
    unexpectedRoutes: observed.filter((route) => !expectedSet.has(route)),
  };
}

export function containsThaiText(text) {
  return /[\u0E00-\u0E7F]/u.test(String(text || ''));
}

export function containsMojibake(text) {
  const value = String(text || '');
  if (!value) {
    return false;
  }

  return /�|à¸|à¹|Ã.|Â.|â€|â€™|â€œ|â€�|â€¢|â€¦/u.test(value);
}

export function evaluateSurfaceResult(input) {
  const reasons = [];
  const statusCode = Number(input?.httpStatus ?? 0);

  if (statusCode !== 200) {
    reasons.push(`http status ${statusCode || 'n/a'}`);
  }
  if (!input?.visible) {
    reasons.push('surface not visible');
  }
  if (!input?.thaiTextOk) {
    reasons.push('thai text missing');
  }
  if (input?.mojibakeDetected) {
    reasons.push('mojibake detected');
  }
  if (Number(input?.contrastFailureCount || 0) > 0) {
    reasons.push(`contrast failures ${Number(input?.contrastFailureCount || 0)}`);
  }
  if (input?.hasOverflow) {
    reasons.push('layout overflow');
  }

  return {
    pass: reasons.length === 0,
    reasons,
  };
}
