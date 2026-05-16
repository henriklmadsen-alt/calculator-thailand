const fs = require('fs');
const path = require('path');

const filePath = path.join(
  process.cwd(),
  'src',
  'pages',
  'บทความ',
  'ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด',
  'index.astro',
);

let source = fs.readFileSync(filePath, 'utf8');

source = source.replace(
  /const title = '([^']+)';/,
  "const title = 'ลดหย่อนภาษี 2569 มีอะไรบ้าง และประหยัดภาษีอย่างถูกกฎหมาย | Kamnuanlek';",
);

source = source.replace(
  /const description = '([^']+)';/,
  "const description = 'รวมรายการลดหย่อนภาษี 2569 ว่ามีอะไรบ้าง พร้อมวิธีวางแผนประหยัดภาษีอย่างถูกกฎหมายแบบเข้าใจง่าย';",
);

source = source.replace(
  /<h1 class=\"text-2xl sm:text-3xl font-bold text-gray-900 mb-4\">[\s\S]*?<\/h1>/,
  `<h1 class=\"text-2xl sm:text-3xl font-bold text-gray-900 mb-4\">\n    ลดหย่อนภาษี 2569 มีอะไรบ้าง และประหยัดภาษีอย่างถูกกฎหมาย\n  </h1>`,
);

fs.writeFileSync(filePath, source, 'utf8');
console.log('updated_t073_snippet=true');
