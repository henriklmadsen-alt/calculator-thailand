#!/usr/bin/env node
/**
 * Generate English versions of calculator pages
 * Maps Thai calculator pages to English equivalents
 */
import fs from 'fs';
import path from 'path';

const calculatorMap = [
  {
    thai: 'คำนวณค่าไฟฟ้า',
    english: 'electricity-bill',
    title: 'Electricity Bill Calculator',
  },
  {
    thai: 'คำนวณภาษีที่ดิน',
    english: 'land-tax',
    title: 'Land Tax Calculator',
  },
  {
    thai: 'คำนวณผ่อนกู้',
    english: 'loan-payment',
    title: 'Loan Payment Calculator',
  },
  {
    thai: 'คำนวณค่าโอที',
    english: 'overtime-pay',
    title: 'Overtime Pay Calculator',
  },
  {
    thai: 'คำนวณค่าธรรมเนียมโอนบ้าน',
    english: 'property-transfer-tax',
    title: 'Property Transfer Tax Calculator',
  },
  {
    thai: 'แปลงหน่วย',
    english: 'unit-converter',
    title: 'Unit Converter',
  },
];

const publicDir = 'public/en';

// Create English directories
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`✓ Created ${publicDir}`);
}

// Create placeholder English pages
calculatorMap.forEach(({ english, title }) => {
  const englishDir = path.join(publicDir, english);
  if (!fs.existsSync(englishDir)) {
    fs.mkdirSync(englishDir, { recursive: true });
  }

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Calculator Thailand</title>
  <meta name="description" content="Free ${title}. Coming soon in full English version.">
  <link rel="canonical" href="https://www.kamnuanlek.com/en/${english}/">
  <link rel="alternate" hreflang="th" href="https://www.kamnuanlek.com/คำนวณค่าไฟฟ้า/">
  <link rel="alternate" hreflang="en" href="https://www.kamnuanlek.com/en/${english}/">
  <script>
    // Redirect to Thai version for now; will be replaced with full English pages
    window.location.replace('https://www.kamnuanlek.com/');
  </script>
</head>
<body>
  <p>Redirecting to Thai version...</p>
</body>
</html>`;

  fs.writeFileSync(path.join(englishDir, 'index.html'), indexHtml);
});

console.log(`✓ Generated ${calculatorMap.length} English calculator page redirects`);
console.log('Note: Pages currently redirect to Thai version. Full English pages coming in Phase 2.');
