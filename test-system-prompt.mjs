#!/usr/bin/env node

/**
 * CAL-1316 System Prompt Test Harness - Simplified
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";

const client = new Anthropic();

// Read system prompt from file
const systemPromptFile = fs.readFileSync("src/ai-advisor-system-prompt.ts", "utf-8");
const systemPromptMatch = systemPromptFile.match(
  /export const AI_ADVISOR_SYSTEM_PROMPT = `([^`]*)`/s
);
const SYSTEM_PROMPT = systemPromptMatch ? systemPromptMatch[1] : "";

const TEST_QUESTIONS = [
  {
    id: "Q1",
    thai: "APR กับดอกเบี้ยธรรมดา ต่างกันยังไง ทำไมต้องดู APR ด้วย",
    category: "Loans & Interest",
  },
  {
    id: "Q2",
    thai: "เงินเดือน 40,000 บาท ฉันต้องจ่ายค่างวดเดือนละเท่าไหร่ที่ปลอดภัย",
    category: "Loans & Interest",
  },
  {
    id: "Q3",
    thai: "ฉันได้ข้อเสนอจากธนาคาร 2 แห่ง ฉันจะเปรียบเทียบได้ไหม",
    category: "Loans & Interest",
  },
  {
    id: "Q4",
    thai: "สินเชื่อไม่มีประมาณทะเบียน (unsecured) ดอกเบี้ยสูงกว่าสินเชื่อมีทะเบียนไหม",
    category: "Loans & Interest",
  },
  {
    id: "Q5",
    thai: "BMI เท่ากับ 28 คือสุขภาพดีไหม",
    category: "Health Metrics",
  },
  {
    id: "Q6",
    thai: "ดอกเบี้ยจำนองในไทยโดยเฉลี่ยเป็นเท่าไหร่ในปีนี้",
    category: "Mortgages",
  },
  {
    id: "Q7",
    thai: "ภาษีเงินเดือนบ้านในไทยเป็นเท่าไหร่",
    category: "Taxes & Salary",
  },
  {
    id: "Q8",
    thai: "ฉันควรชำระสินเชื่อก่อนครบกำหนดหรือไม่",
    category: "Personal Financial Advice",
  },
  {
    id: "Q9",
    thai: "รถราคา 1 ล้านบาท ฉันควรกู้เงินไหม",
    category: "Personal Financial Advice",
  },
  {
    id: "Q10",
    thai: "สินเชื่อแบบไหนที่มี APR ต่ำที่สุดในประเทศไทย",
    category: "Loans & Interest",
  },
];

async function testQuestion(question) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`Q${question.id}: ${question.category}`);
  console.log(`${"=".repeat(70)}`);
  console.log(`Thai: ${question.thai}`);
  console.log(`\nResponse:`);

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: question.thai,
        },
      ],
    });

    const answer = response.content[0].text;
    console.log(answer);

    // Basic checks
    const checks = {
      Thai: /[ก-๙]/.test(answer),
      ProperLength: answer.length > 80,
      HasContent: answer.trim().length > 0,
    };

    // Specific checks
    if (question.id === "Q5" || question.id === "Q8" || question.id === "Q9") {
      checks.HasDisclaimer = answer.includes("ปรึกษา") || answer.includes("แนะนำ");
    }

    if (question.id === "Q6") {
      checks.NoFabrication = answer.includes("ตรวจสอบ") || answer.includes("ธนาคาร");
    }

    const checkResults = Object.entries(checks)
      .map(([name, result]) => (result ? `✓ ${name}` : `✗ ${name}`))
      .join(" | ");
    console.log(`\nQuality: ${checkResults}`);

    return {
      id: question.id,
      passed: Object.values(checks).every((v) => v),
      checks,
    };
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    return {
      id: question.id,
      passed: false,
      error: error.message,
    };
  }
}

async function runTests() {
  console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║         CAL-1316: AI Advisor System Prompt - Thai Questions Test           ║
╚════════════════════════════════════════════════════════════════════════════╝
`);

  const results = [];

  for (const question of TEST_QUESTIONS) {
    const result = await testQuestion(question);
    results.push(result);
    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Summary
  console.log(`\n\n${"=".repeat(70)}`);
  console.log("TEST SUMMARY");
  console.log(`${"=".repeat(70)}`);

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  console.log(`\nTotal: ${totalCount} questions`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${totalCount - passedCount}`);
  console.log(`Success Rate: ${((passedCount / totalCount) * 100).toFixed(1)}%`);

  console.log(`\nQuestion Results:`);
  results.forEach((r) => {
    const icon = r.passed ? "✅" : "❌";
    const error = r.error ? ` (${r.error})` : "";
    console.log(`  ${icon} Q${r.id}${error}`);
  });

  if (passedCount === totalCount) {
    console.log(`\n✅ All tests passed! System prompt is ready for production.`);
  } else {
    console.log(
      `\n⚠️  Some tests need attention. Review quality checks above.`
    );
  }

  console.log("\n");
  process.exit(passedCount === totalCount ? 0 : 1);
}

runTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
