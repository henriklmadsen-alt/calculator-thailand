import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function read(path) {
  return readFile(path, 'utf8');
}

const baseLayout = await read('src/layouts/BaseLayout.astro');
const relatedCore = await read('src/components/RelatedCalculators.astro');
const relatedTemplate = await read('src/components/templates/RelatedCalculators.astro');

assert.match(
  relatedTemplate,
  /import\s+RelatedCalculators\s+from\s+'\.\.\/RelatedCalculators\.astro'/,
  'templates/RelatedCalculators must import core RelatedCalculators component',
);
assert.match(
  relatedTemplate,
  /<RelatedCalculators\s+\{\.\.\.Astro\.props\}\s*\/>/,
  'templates/RelatedCalculators must forward props to core component',
);

assert.match(
  relatedCore,
  /getCalculatorLinks\(/,
  'core RelatedCalculators component must use internal link engine',
);

assert.match(
  baseLayout,
  /import\s+CalculatorSchema\s+from\s+'\.\.\/components\/schema\/CalculatorSchema\.astro'/,
  'BaseLayout must import CalculatorSchema',
);
assert.match(
  baseLayout,
  /<CalculatorSchema[\s\S]*calculatorType=\{calculatorSchemaType\}[\s\S]*\/>/,
  'BaseLayout must render CalculatorSchema with dynamic calculator type',
);
assert.match(
  baseLayout,
  /import\s+\{\s*setupKeyboardNavigation\s*\}\s+from\s+'\/src\/lib\/accessibility\.ts'/,
  'BaseLayout must initialize accessibility helpers',
);
assert.match(
  baseLayout,
  /import\s+\{\s*trackFormStart,\s*trackResultView,\s*trackCalculatorCompletion\s*\}\s+from\s+'\/src\/lib\/calculator-tracking\.ts'/,
  'BaseLayout must import CAL-2757 tracking library',
);
assert.match(
  baseLayout,
  /window\.__ctSharedTracking/,
  'BaseLayout must bridge shared tracking helpers for existing calculator pages',
);

console.log('CAL-2757 setup integration checks passed');
