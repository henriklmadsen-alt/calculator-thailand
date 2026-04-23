import { chromium } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';
const CALCULATORS = [
  { name: 'BMI', path: '/คำนวณ-bmi/' },
  { name: 'Income Tax', path: '/คำนวณภาษีเงินได้บุคคลธรรมดา/' },
  { name: 'Property Transfer', path: '/คำนวณค่าธรรมเนียมโอนบ้าน/' }
];

async function testCalculatorMobile() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone 12 dimensions
    deviceScaleFactor: 2,
  });

  try {
    for (const calc of CALCULATORS) {
      console.log(`\n=== Testing: ${calc.name} ===`);
      console.log(`Path: ${calc.path}`);

      const page = await context.newPage();

      try {
        const response = await page.goto(`${BASE_URL}${calc.path}`, { waitUntil: 'networkidle' });
        console.log(`✓ Page loaded: ${response.status()}`);

        // Check for input fields
        const inputs = await page.locator('input').count();
        console.log(`✓ Input fields found: ${inputs}`);

        // Check viewport dimensions
        const viewportSize = page.viewportSize();
        console.log(`✓ Viewport: ${viewportSize.width}x${viewportSize.height}`);

        // Check for text overflow issues
        const overflowElements = await page.locator('body *').evaluateAll(elements => {
          return elements.filter(el => {
            const style = window.getComputedStyle(el);
            const isOverflowing = el.scrollWidth > el.clientWidth;
            return isOverflowing;
          }).length;
        });

        if (overflowElements > 0) {
          console.log(`⚠ Warning: ${overflowElements} elements with horizontal overflow detected`);
        } else {
          console.log(`✓ No horizontal overflow detected`);
        }

        // Check for ad elements
        const adElements = await page.locator('[class*="ad"], [id*="ad"], [class*="adsbygoogle"]').count();
        console.log(`✓ Ad elements detected: ${adElements}`);

        // Check if calculator form is visible without scrolling
        const formVisible = await page.locator('form, [role="form"], .calculator-form').isVisible({ timeout: 5000 }).catch(() => false);
        console.log(`✓ Calculator form visible: ${formVisible}`);

        // Check for button clarity
        const buttons = await page.locator('button, [role="button"]').count();
        console.log(`✓ Buttons found: ${buttons}`);

        // Take a screenshot
        await page.screenshot({ path: `reports/mobile-qa/${calc.name.toLowerCase().replace(/\s+/g, '-')}-375px.png` });
        console.log(`✓ Screenshot saved`);

      } catch (error) {
        console.error(`✗ Error testing ${calc.name}: ${error.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
    await browser.close();
    console.log('\n=== Mobile QA Test Complete ===');
  }
}

testCalculatorMobile().catch(console.error);
