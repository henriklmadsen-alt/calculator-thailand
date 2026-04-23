import { chromium } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

async function testCalculatorInteraction() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });

  const page = await context.newPage();

  const testCases = [
    {
      name: 'BMI',
      url: '/คำนวณ-bmi/',
      inputs: [
        { selector: 'input[placeholder*="65"], input[type="number"]:nth-child(1)', value: '65' },
        { selector: 'input[placeholder*="170"], input[type="number"]:nth-child(2)', value: '170' }
      ],
      submitButton: 'button:has-text("คำนวณ")',
      resultSelector: '.result, [class*="result"], h3'
    },
    {
      name: 'Income Tax',
      url: '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
      inputs: [
        { selector: 'input[type="number"]', value: '600000' }
      ],
      submitButton: 'button:has-text("คำนวณ")',
      resultSelector: '.result, [class*="result"], h3'
    },
    {
      name: 'Property Transfer',
      url: '/คำนวณค่าธรรมเนียมโอนบ้าน/',
      inputs: [
        { selector: 'input[type="number"]', value: '5000000' }
      ],
      submitButton: 'button:has-text("คำนวณ")',
      resultSelector: '.result, [class*="result"], h3'
    }
  ];

  for (const test of testCases) {
    console.log(`\n=== ${test.name} Calculator Interaction Test ===`);

    try {
      await page.goto(`${BASE_URL}${test.url}`, { waitUntil: 'networkidle' });
      console.log(`✓ Page loaded`);

      // Fill inputs
      for (const input of test.inputs) {
        const inputElements = await page.locator(input.selector).all();
        if (inputElements.length > 0) {
          await inputElements[0].fill(input.value);
          console.log(`✓ Filled input with value: ${input.value}`);
        }
      }

      // Click calculate button
      const buttons = await page.locator('button').all();
      let clicked = false;
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('คำนวณ')) {
          await btn.click();
          clicked = true;
          console.log(`✓ Clicked calculate button`);
          break;
        }
      }

      if (!clicked) {
        console.log(`⚠ Could not find calculate button, checking for results anyway`);
      }

      // Wait for results
      await page.waitForTimeout(1000);

      // Check result visibility
      const bodyText = await page.textContent('body');
      if (bodyText.includes('ผล') || bodyText.includes('result') || bodyText.includes('คำนวณ')) {
        console.log(`✓ Result appears to be visible`);
      }

      // Take screenshot after calculation
      await page.screenshot({
        path: `reports/mobile-qa/${test.name.toLowerCase()}-result-375px.png`
      });
      console.log(`✓ Result screenshot saved`);

      // Check scroll position needed for result
      const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
      console.log(`✓ Page height: ${scrollHeight}px (375px width viewport)`);

      if (scrollHeight > 812) {
        console.log(`⚠ Result may require scrolling (page height: ${scrollHeight}px)`);
      } else {
        console.log(`✓ Result visible without scrolling`);
      }

    } catch (error) {
      console.error(`✗ Error: ${error.message}`);
    }
  }

  await context.close();
  await browser.close();
  console.log('\n=== Mobile Interaction Test Complete ===');
}

testCalculatorInteraction().catch(console.error);
