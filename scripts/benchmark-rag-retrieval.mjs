#!/usr/bin/env node

/**
 * CAL-1311: RAG Retrieval Performance Benchmark
 *
 * Runs 100 random questions through retrieveCalculatorContext()
 * Measures p50 and p99 latency against targets: p50 <100ms, p99 <300ms
 *
 * Usage:
 *   node scripts/benchmark-rag-retrieval.mjs [--api-url=<url>] [--verbose]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test questions: 100 diverse Thai financial questions
const testQuestions = [
  // Loans & Interest (20 questions)
  'APR คืออะไร และแตกต่างจากอัตราดอกเบี้ยทั่วไปอย่างไร',
  'ฉันควรจะสมัครสินเชื่อกับอัตรา 3.5% หรือ 4.2% ที่ผู้ให้กู้อื่นคนนี้แนะนำ',
  'สัญญาสินเชื่อ 500,000 บาท ระยะเวลา 5 ปี อัตรา 4% ฉันจะต้องจ่ายดอกเบี้ยทั้งหมดเท่าไหร่',
  'อัตราส่วนหนี้สู่รายได้ (Debt-to-Income Ratio) คืออะไร และทำไมมันสำคัญ',
  'ฉันมีรายได้ 40,000 บาทต่อเดือน ฉันสามารถกู้ยืมได้ประมาณเท่าไหร่',
  'สินเชื่อชนิดไหนดีกว่า ธนาคารหรือบริษัทเงินกู้',
  'จำนวนเงินของสินเชื่อเดิม และเงินออมของฉันในแต่ละเดือนควรจะเป็นเท่าไหร่',
  'ระยะเวลากู้ 3 ปี ดีกว่า หรือ 5 ปีดีกว่า ในด้านดอกเบี้ยทั้งหมด',
  'ฉันควรจะติดต่อธนาคารไหนสำหรับสินเชื่อ',
  'สินเชื่อสูงสุดที่ฉันสามารถรับได้คืออะไร',
  'ฉันกู้ยืม 1,000,000 บาท อัตรา 5% ระยะเวลา 10 ปี เงินชำระต่อเดือนจะเป็นเท่าไหร่',
  'ดอกเบี้ยแบบคงที่ดีกว่า หรือ อัตราดอกเบี้ยลอยตัวดีกว่า',
  'ฉันมีหนี้สินอยู่ 3 แห่ง ควรใช้สินเชื่อตั้งแต่เดือนไหน',
  'ผู้ให้กู้เรียกเก็บอัตราประเมิน (APR) 12% นั่นสูงไหม',
  'เงินคืนสินเชื่อในแต่ละเดือนเท่าไหร่ถ้า principal = 500,000 บาท, rate = 4.5%, term = 7 ปี',
  'สินเชื่อถูก VS สินเชื่อแพง ความแตกต่างเรื่องดอกเบี้ยจริง ๆ คืออะไร',
  'ฉันควรจ่ายหนี้สินไหนก่อน: 3% หรือ 6%',
  'สัญญาสินเชื่อมีค่าธรรมเนียมอื่น ๆ ที่อยู่นอกเหนือ APR ไหม',
  'การปรึกษาธนาคารเกี่ยวกับสินเชื่อมีค่าใช้จ่ายไหม',
  'ถ้าฉันชำระคืนสินเชื่อก่อนกำหนด จะมีค่าปรับไหม',

  // Taxes & Income (20 questions)
  'ถ้ารายได้ของฉัน 50,000 บาทต่อเดือน ฉันต้องเสียภาษีเท่าไหร่ต่อปี',
  'ภาษีเงินได้บุคคลธรรมชาติคำนวณจากรายได้รวมหรือรายได้สุทธิ',
  'หักลดหย่อนภาษีเงินได้ได้เท่าไหร่ในปี 2566',
  'บ้านเชื่อ 60,000 บาทต่อเดือน เสียภาษีรวมเท่าไหร่ต่อปี',
  'เบี้ยประกันชีวิตสามารถหักลดหย่อนภาษีได้ไหม',
  'ดอกเบี้ยจากเงินฝากออมทรัพย์ต้องเสียภาษีไหม',
  'เงินโบนัสเสียภาษีเท่าไหร่',
  'ภาษีมูลค่าเพิ่ม (VAT) คำนวณอย่างไร',
  'ถ้าเสียภาษี 5,000 บาทต่อเดือน ต้องเสียภาษีทั้งปีเท่าไหร่',
  'หักภาษีที่จ่ายได้ (Tax Deductible) คืออะไร',
  'ค่าเบี้ยประกันสุขภาพหักลดหย่อนภาษีได้ไหม และเท่าไหร่',
  'ฉันมีเงินออมทรัพย์ 2 ล้านบาท ดอกเบี้ยปี 2.5% เป็นเท่าไหร่ ต้องเสียภาษีไหม',
  'ถ้ารายได้รวม 1.2 ล้านบาท และมีค่าใช้จ่ายชำระหนี้ 200,000 บาท เสียภาษีเท่าไหร่',
  'ค่าเล่าเรียนเด็ก หักลดหย่อนภาษีได้ไหม',
  'บ้านเชื่อสินเชื่อ 5% ก่อนหักภาษี เงินจริงที่ได้เป็นเท่าไหร่',
  'โครงสร้างภาษีแบบก้าวบันได (Progressive Tax) คืออะไร',
  'ถ้าจ่ายภาษี 100,000 บาทต่อปี รายได้ก่อนหักภาษีอยู่ที่ประมาณเท่าไหร่',
  'ภาษีคาร์บอนของยานพาหนะเพิ่มเติมต่อปีหรือเท่าไร',
  'เงินทดแทนจากการสูญเสีย(Loss Compensation) เสียภาษีไหม',
  'บ้านเชื่อเป็นตัวแทนเก็บภาษี ควรกังวลปัญหาไหมบ้าง',

  // Savings & Investment (20 questions)
  'ฉันควรเก็บเงินฉุกเฉินเท่าไหร่',
  'เงินเก็บออมส่วนตัวควรเป็นกี่เดือนของค่าใช้จ่ายประจำเดือน',
  'เงินลงทุนในสินค้าอื่นนอกจากเงินฝาก ดีไหม',
  'อายุ 25 ปี ควรเริ่มลงทุนเมื่อไหร่',
  'ยี่กีหรือลอตเตอรี่เป็นการลงทุนหรือเล่นการพนัน',
  'อัตราผลตอบแทนจากเงินฝาก 2% ต่อปี ถ้าเก็บ 500,000 บาท 10 ปี จะได้เท่าไหร่',
  'เงินลงทุน 100,000 บาท อัตราผลตอบแทน 7% ต่อปี 20 ปีจะมีเท่าไหร่',
  'ลงทุนในพันธบัตรรัฐบาล ดีหรือเสีย',
  'เงินสดในมือควรมีเท่าไหร่',
  'ลงทุนในทองคำดีไหม ต่างจากเงินเก็บออมทรัพย์อย่างไร',
  'อายุ 30 ปี เงินเก็บออมควรมีเท่าไหร่',
  'เงิน 300,000 บาท ลงทุนในหุ้นเริ่มต้นไหม',
  'ดอกเบี้ยทบต้น (Compound Interest) ทำให้เงินเพิ่มขึ้นหรือได้เท่าไหร่',
  'บัญชีเงินฝากออมทรัพย์ดีกว่าบัญชีประจำ ในเรื่องอะไร',
  'กองทุนมูลค่าต่อหน่วย 50 บาท ลงทุน 50,000 บาท ได้หน่วยเท่าไหร่',
  'ถ้าไม่มีเงินออมกำลังใจควรมีไหม',
  'การออมและการลงทุน ต่างกันอย่างไร',
  'ฉันอายุ 60 ปี ควรออมหรือลงทุน',
  'มูลค่าปัจจุบันของเงิน 1 ล้านบาท ใน 10 ปีจะเป็นเท่าไหร่ ถ้าเงินเฟ้อ 2%',
  'เงินออม 1,000 บาท/เดือน 30 ปี จะมีเท่าไหร่ ถ้ารายได้ 3%',

  // Property & Real Estate (20 questions)
  'บ้านราคา 3 ล้านบาท อัตราดอกเบี้ย 3.5% ระยะเวลา 30 ปี ผ่อนชำระเดือนละเท่าไหร่',
  'ผ่อนบ้านลง 20% หรือไม่ลด ดีกว่าเหตุใด',
  'ดอกเบี้ยบ้านลอยตัว VS คงที่ ควรเลือกอย่างไร',
  'ซื้อบ้านแผนครั้งแรก ควรดูอะไรก่อน',
  'บ้านตัวจริง ราคา 2.5 ล้าน หนึ่งหน่วยคำนวณค่าจดทะเบียนเท่าไหร่',
  'เงินดาวน์บ้านควรมีเท่าไหร่',
  'บ้านแห่งแรก ได้ยืมได้เท่าไหร่สูงสุด',
  'ค่าดำเนินการจดสิทธิ์รวมกับค่าใช้จ่ายอื่นประมาณเท่าไหร่',
  'บ้านราคา 2 ล้าน คืนรวมทั้งค่าจดทะเบียน ใช้เงินหมดเท่าไหร่',
  'ที่ดินเหล้องหนึ่งราคา 500,000 บาท ต่อลงสิ้นเดือนควรกำหนดราคาต่อตารางเมตร',
  'อพยพบ้าน vs รถที่จำเป็นต้องลงทุน อันไหนสำคัญก่อน',
  'บ้านหลักตัวแรก ได้สิทธิพิเศษในสินเชื่อบ้านจากธนาคารไหม',
  'สินเชื่อบ้านคืนแกตลาดหรือตันแบงค์',
  'เงินดาวน์บ้านต่ำ ต้องเสียประกันจำนองเพิ่มเติมไหม',
  'อพยพบ้านลง 10% ได้ไหม',
  'บ้านตัวจริง + ค่าใช้จ่ายบ้านต่อเดือนรวมทั้งหมดเป็นเท่าไหร่',
  'บ้านแรก โครงการที่ไหนดีสำหรับการลงทุน',
  'บ้านอพยพลง 50% ได้ไหม ธนาคารจะให้ยืมไหม',
  'อพยพบ้านแล้วต้องเสียค่าใช้จ่ายต่อเดือนไหมบ้าง',
  'ราคาบ้านใหม่ vs บ้านเก่า ตัวไหนควรซื้อ',

  // Health & Personal (20 questions)
  'ดัชนีมวลกาย (BMI) คำนวณจากส่วนไหนของร่างกาย',
  'ฉันหนัก 70 กิโลกรัม สูง 170 เซนติเมตร BMI ของฉันเป็นเท่าไหร่',
  'BMI 25 ถือว่าน้ำหนักตัวเท่าไหร่',
  'ผู้หญิงอายุ 30 ปี หนัก 60 กิโล สูง 160 ซม. น้ำหนักมาตรฐานควรมากหรือน้อย',
  'ฉันต้องลดน้ำหนัก 10 กิโลกรัม จะใช้เวลาเท่าไหร่',
  'ออกกำลังกายวันละนาน จะลดน้ำหนักได้เร็ว',
  'ทำอาหารเหมาะสมกับการลดน้ำหนักควรเป็นอย่างไร',
  'บ้านเชื่อ 80 กิโลกรัม ลดเหลือ 70 เพื่อให้ BMI ตรงต้องกินความร้อนเท่าไหร่',
  'ทำให้ BMI ของฉันตรงต้องใช้เวลากี่เดือน',
  'ออกกำลังกาย 30 นาที วันละครั้ง จะลดน้ำหนักไหม',
  'เด็กอายุ 10 ปี หนัก 40 กิโล สูง 140 ซม. น้ำหนักปกติไหม',
  'BMI ของเด็กกับผู้ใหญ่คำนวณต่างกันไหม',
  'ผู้บำรุงน้ำหนัก BMI ตรงปกติควรเก็บประมาณเท่าไหร่',
  'การลดน้ำหนักอย่างไรให้ปลอดภัย',
  'ผู้บ่อยเป็นเบาหวาน น้ำหนักควรควบคุมอย่างไร',
  'กีฬาไหนออกแบบเพื่อลดน้ำหนัก',
  'ฉันเป็นอ้วน BMI 30 ควรพบแพทย์ไหม',
  'ทำให้ BMI ปกติต้องเปลี่ยนอาหารหรือออกกำลังกายก่อน',
  'ผู้ประชดอายุ 25 ปี BMI ควรเป้นเท่าไหร่ที่เหมาะสม',
  'ระยะเวลา 3 เดือน ลดน้ำหนัก 15 กิโลกรัม ปลอดภัยไหม',
];

// Parse command line arguments
const args = process.argv.slice(2);
const apiUrl = args.find(arg => arg.startsWith('--api-url='))?.split('=')[1] || 'http://localhost:3000';
const verbose = args.includes('--verbose');
const outputFile = 'RAG-PERFORMANCE-BENCHMARK-RESULTS.json';

// Shuffle array for random sampling
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Run benchmark
async function runBenchmark() {
  console.log('\n🔬 CAL-1311: RAG Retrieval Performance Benchmark');
  console.log('='.repeat(60));
  console.log(`API URL: ${apiUrl}`);
  console.log(`Test questions: ${testQuestions.length}`);
  console.log(`Performance targets: p50 <100ms, p99 <300ms\n`);

  // Select 100 random questions
  const selectedQuestions = shuffle(testQuestions).slice(0, 100);
  const results = [];
  const latencies = [];

  let successCount = 0;
  let errorCount = 0;

  // Test each question
  for (let i = 0; i < selectedQuestions.length; i++) {
    const question = selectedQuestions[i];
    const questionNum = i + 1;

    try {
      const startTime = performance.now();

      const response = await fetch(`${apiUrl}/api/ai-advisor/retrieve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          topK: 3,
        }),
      });

      const elapsedTime = performance.now() - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'API returned error');
      }

      const searchTimeMs = data.data.search_time_ms || elapsedTime;
      latencies.push(searchTimeMs);
      successCount++;

      results.push({
        question_num: questionNum,
        question: question.substring(0, 50) + (question.length > 50 ? '...' : ''),
        latency_ms: Math.round(searchTimeMs * 100) / 100,
        chunks_returned: data.data.chunks?.length || 0,
        status: 'success',
      });

      if (verbose || questionNum % 10 === 0) {
        console.log(`[${questionNum}/100] ✓ ${searchTimeMs.toFixed(2)}ms`);
      }
    } catch (error) {
      errorCount++;
      results.push({
        question_num: questionNum,
        question: question.substring(0, 50) + (question.length > 50 ? '...' : ''),
        latency_ms: null,
        status: 'error',
        error: error.message,
      });

      if (verbose) {
        console.log(`[${questionNum}/100] ✗ Error: ${error.message}`);
      }
    }

    // Small delay between requests to avoid overwhelming the server
    if (i < selectedQuestions.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  // Calculate percentiles
  latencies.sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];
  const min = latencies[0];
  const max = latencies[latencies.length - 1];
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;

  // Performance assessment
  const p50Pass = p50 < 100 ? '✓ PASS' : '✗ FAIL';
  const p99Pass = p99 < 300 ? '✓ PASS' : '✗ FAIL';

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📊 Performance Benchmark Results');
  console.log('='.repeat(60));
  console.log(`\nSuccessful queries: ${successCount}/${selectedQuestions.length}`);
  console.log(`Failed queries: ${errorCount}/${selectedQuestions.length}`);
  console.log(`\nLatency Statistics (${latencies.length} successful queries):`);
  console.log(`  Min:  ${min.toFixed(2)}ms`);
  console.log(`  Max:  ${max.toFixed(2)}ms`);
  console.log(`  Avg:  ${avg.toFixed(2)}ms`);
  console.log(`  P50:  ${p50.toFixed(2)}ms  ${p50Pass}  (target: <100ms)`);
  console.log(`  P99:  ${p99.toFixed(2)}ms  ${p99Pass}  (target: <300ms)`);

  // Overall assessment
  const overallPass = p50 < 100 && p99 < 300;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Overall: ${overallPass ? '✓ PASS' : '✗ NEEDS OPTIMIZATION'}`);
  console.log('='.repeat(60) + '\n');

  // Save results to file
  const summary = {
    benchmark_date: new Date().toISOString(),
    api_url: apiUrl,
    total_questions: selectedQuestions.length,
    successful: successCount,
    failed: errorCount,
    latency_stats: {
      min_ms: parseFloat(min.toFixed(2)),
      max_ms: parseFloat(max.toFixed(2)),
      avg_ms: parseFloat(avg.toFixed(2)),
      p50_ms: parseFloat(p50.toFixed(2)),
      p99_ms: parseFloat(p99.toFixed(2)),
    },
    performance_targets: {
      p50_target_ms: 100,
      p99_target_ms: 300,
      p50_status: p50 < 100 ? 'PASS' : 'FAIL',
      p99_status: p99 < 300 ? 'PASS' : 'FAIL',
    },
    overall_status: overallPass ? 'PASS' : 'NEEDS_OPTIMIZATION',
    detailed_results: results,
  };

  fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));
  console.log(`📁 Results saved to: ${outputFile}`);

  // Recommendations if not passing
  if (!overallPass) {
    console.log('\n📋 Optimization Recommendations:');
    if (p50 >= 100) {
      console.log('  1. Verify ivfflat vector index is active in PostgreSQL');
      console.log('  2. Tune ivfflat "lists" parameter (increase for speed, decrease for accuracy)');
      console.log('  3. Add connection pooling (increase pool.max from 5 to 10-20)');
      console.log('  4. Use PostgreSQL vector functions (pgvector cosine_distance) instead of in-memory similarity');
      console.log('  5. Profile database query time to identify bottlenecks');
    }
    if (p99 >= 300) {
      console.log('  1. Check for connection pool exhaustion');
      console.log('  2. Increase connection pool timeout limits');
      console.log('  3. Implement query caching for repeated questions');
      console.log('  4. Monitor database server resource usage (CPU, memory, disk I/O)');
    }
  }
}

// Run the benchmark
runBenchmark().catch(error => {
  console.error('❌ Benchmark failed:', error);
  process.exit(1);
});
