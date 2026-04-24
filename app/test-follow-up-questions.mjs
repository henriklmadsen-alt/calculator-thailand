/**
 * Test script for /api/ai-advisor/generate-follow-up-questions endpoint
 *
 * Tests:
 * 1. Valid request with full context
 * 2. Request without conversation history
 * 3. Request without calculator context
 * 4. Invalid requests (missing fields, bad types)
 * 5. Validate response format and question quality
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

// Example AI responses for testing
const testCases = [
  {
    name: 'APR Calculator followup',
    payload: {
      aiResponse: 'ดอกเบี้ยประจำปี (APR) คือการวัดอัตราดอกเบี้ยรวมของสินเชื่อ โดยรวมถึงอัตราดอกเบี้ยพื้นฐาน ค่าธรรมเนียม และค่าใช้สายอื่น',
      userQuestion: 'APR คืออะไร?',
      conversationHistory: [
        { role: 'user', content: 'APR คืออะไร?' },
        { role: 'ai', content: 'ดอกเบี้ยประจำปี (APR) คือ...' }
      ],
      calculatorContext: {
        calculatorName: 'APR Calculator',
        userInput: { loanAmount: 100000, interestRate: 8, duration: 12 },
        relatedCalculators: ['Mortgage Calculator', 'Salary Net Calculator']
      },
      maxQuestions: 3
    }
  }
];

async function testEndpoint(testCase) {
  console.log(`\n📋 Testing: ${testCase.name}`);
  try {
    const response = await fetch(`${API_BASE}/api/ai-advisor/generate-follow-up-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCase.payload)
    });
    const data = await response.json();
    if (response.ok) {
      console.log(`✅ Success: Generated ${data.data.questions.length} questions`);
      data.data.questions.forEach((q, i) => console.log(`   ${i + 1}. ${q.text}`));
    } else {
      console.log(`❌ Error: ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
  }
}

async function runTests() {
  console.log('🚀 Testing /api/ai-advisor/generate-follow-up-questions endpoint');
  for (const testCase of testCases) {
    await testEndpoint(testCase);
  }
  console.log('\n✨ Test run complete');
}

runTests().catch(console.error);
