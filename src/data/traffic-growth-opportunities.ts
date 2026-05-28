export interface TrafficGrowthLink {
  title: string;
  href: string;
  desc: string;
  badge?: string;
}

export const recoveryGrowthLinks: TrafficGrowthLink[] = [
  {
    title: 'คำนวณอายุวันนี้จากวันเกิด',
    href: '/คำนวณอายุ/',
    desc: 'หน้าที่เคยได้ impressions สูงสุด ต้องส่งลิงก์ตรงกลับไปที่เครื่องมือหลัก',
    badge: 'GSC recovery',
  },
  {
    title: 'คำนวณค่าไฟฟ้า 2569',
    href: '/คำนวณค่าไฟฟ้า/',
    desc: 'หน้าอันดับประมาณ 8-10 ที่ต้องกู้ impressions และ CTR เร็วที่สุด',
    badge: 'Top 10',
  },
  {
    title: 'คำนวณ VAT 7%',
    href: '/คำนวณภาษีมูลค่าเพิ่ม/',
    desc: 'จับคำค้น VAT 7, คิด VAT, วิธีคิด VAT 7% และ 10000/1.07',
    badge: 'VAT',
  },
  {
    title: 'คำนวณ BMI สูตร',
    href: '/คำนวณ-bmi/',
    desc: 'รองรับคำค้น BMI สูตร วิธีคำนวณ BMI และดัชนีมวลกายสำหรับคนไทย',
    badge: 'Health',
  },
  {
    title: 'คำนวณค่าโอที',
    href: '/คำนวณค่าโอที/',
    desc: 'หน้าใกล้หน้าแรกเดิม เหมาะกับการดันด้วยลิงก์ภายในและ FAQ',
    badge: 'Near page 1',
  },
  {
    title: 'คำนวณผ่อนรถ',
    href: '/คำนวณผ่อนรถ/',
    desc: 'หน้า affiliate-friendly ที่ต้องสะสม internal authority ต่อเนื่อง',
    badge: 'Affiliate',
  },
];

export const homepageGrowthLinks: TrafficGrowthLink[] = [
  {
    title: 'คำนวณอายุวันนี้',
    href: '/คำนวณอายุ/',
    desc: 'ส่ง authority ตรงกลับไปยังหน้าอายุที่เคยทำ impressions สูงสุดใน Search Console',
    badge: 'Priority',
  },
  {
    title: 'คำนวณค่าไฟฟ้า 2569',
    href: '/คำนวณค่าไฟฟ้า/',
    desc: 'หน้าไฟฟ้ายัง indexed และเคยติด top 10 จึงต้องได้ลิงก์ตรงจากหน้าแรก',
    badge: 'Priority',
  },
  {
    title: '1 kWh เท่ากับกี่บาท 2569',
    href: '/บทความ/1-kwh-เท่ากับกี่บาท-2569/',
    desc: 'ตอบคำค้นค่าไฟที่มี impressions สูง แล้วพาไปคำนวณจากจำนวนหน่วยจริง',
    badge: 'GSC opportunity',
  },
  {
    title: 'ค่าไฟห้องเช่า หน่วยละกี่บาท',
    href: '/บทความ/ค่าไฟห้องเช่าหน่วยละกี่บาท-2569/',
    desc: 'จับกลุ่มผู้เช่าหอพัก คอนโด และเจ้าของห้องเช่าที่ต้องเช็กค่าไฟรายเดือน',
    badge: 'ค่าไฟ',
  },
  {
    title: 'คำนวณ VAT 7%',
    href: '/คำนวณภาษีมูลค่าเพิ่ม/',
    desc: 'ดันหน้า VAT ที่เริ่มมี impressions แต่ยังไม่มี clicks ให้มีเส้นทางตรงจากหน้าแรก',
    badge: 'CTR lift',
  },
  {
    title: '10000 หาร 1.07 ถอด VAT',
    href: '/บทความ/10000-หาร-1-07-ถอด-vat/',
    desc: 'ตอบ query เลขตรงสำหรับคนขายของและออกใบกำกับภาษี',
    badge: 'VAT 7%',
  },
  {
    title: 'ดาวน์รถ 20% ผ่อนเท่าไร',
    href: '/บทความ/ดาวน์รถ-20-เปอร์เซ็นต์-ผ่อนเท่าไร/',
    desc: 'เชื่อม traffic ผ่อนรถเข้าหน้า affiliate-friendly หลังคำนวณค่างวด',
    badge: 'Affiliate',
  },
  {
    title: 'คำนวณผ่อนบ้าน',
    href: '/คำนวณผ่อนบ้าน/',
    desc: 'หน้าเงินกู้มูลค่าสูง เหมาะกับ internal link และ partner conversion',
    badge: 'Money page',
  },
];

export const electricityGrowthLinks: TrafficGrowthLink[] = [
  {
    title: '1 kWh เท่ากับกี่บาท 2569',
    href: '/บทความ/1-kwh-เท่ากับกี่บาท-2569/',
    desc: 'สรุปคำตอบเร็ว พร้อมอธิบายว่าบิลจริงมีค่าไฟฐาน Ft ค่าบริการ และ VAT',
    badge: 'คำค้นหลัก',
  },
  {
    title: 'ค่าไฟห้องเช่า หน่วยละกี่บาท 2569',
    href: '/บทความ/ค่าไฟห้องเช่าหน่วยละกี่บาท-2569/',
    desc: 'อ่านก่อนเทียบบิลหอพัก คอนโด หรือมิเตอร์แยก',
    badge: 'ห้องเช่า',
  },
  {
    title: 'คำนวณค่าไฟ PEA/MEA',
    href: '/คำนวณค่าไฟฟ้า/',
    desc: 'ใส่จำนวนหน่วยและ Ft เพื่อดูยอดประมาณการทันที',
    badge: 'Calculator',
  },
];

export const ageGrowthLinks: TrafficGrowthLink[] = [
  {
    title: 'คำนวณอายุวันนี้จากวันเกิด',
    href: '/บทความ/คำนวณอายุวันนี้-จากวันเกิด/',
    desc: 'ดูวิธีนับอายุเป็นปี เดือน วัน และแปลง พ.ศ./ค.ศ. ให้ถูกต้อง',
    badge: 'คำค้นหลัก',
  },
  {
    title: 'คำนวณอายุจากวันเกิด 2569',
    href: '/บทความ/คำนวณอายุ-จากวันเกิด-2569-ปี-เดือน-วัน/',
    desc: 'คู่มือเดิมสำหรับคนที่ต้องการรายละเอียดมากขึ้น',
    badge: 'Guide',
  },
  {
    title: 'คำนวณวันคลอด',
    href: '/คำนวณวันคลอด/',
    desc: 'เครื่องมือถัดไปสำหรับครอบครัวและสุขภาพ',
    badge: 'Related',
  },
];

export const vatGrowthLinks: TrafficGrowthLink[] = [
  {
    title: '10000 หาร 1.07 เท่ากับเท่าไร',
    href: '/บทความ/10000-หาร-1-07-ถอด-vat/',
    desc: 'ถอด VAT จากราคารวม 10,000 บาท พร้อมยอดภาษี 654.21 บาท',
    badge: 'Exact answer',
  },
  {
    title: 'VAT 7% คิดยังไง',
    href: '/บทความ/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน/',
    desc: 'สูตรบวก VAT ถอด VAT และตั้งราคาขายแบบไม่ขาดทุน',
    badge: 'Guide',
  },
  {
    title: 'คำนวณเปอร์เซ็นต์',
    href: '/คำนวณเปอร์เซ็นต์/',
    desc: 'ใช้ต่อกับส่วนลด กำไร และราคาโปรโมชั่น',
    badge: 'Related',
  },
];

export const carLoanGrowthLinks: TrafficGrowthLink[] = [
  {
    title: 'ดาวน์รถ 20% ผ่อนเท่าไร',
    href: '/บทความ/ดาวน์รถ-20-เปอร์เซ็นต์-ผ่อนเท่าไร/',
    desc: 'ตัวอย่างรถ 700,000 / 900,000 / 1,200,000 บาท แบบดอกเบี้ย flat rate',
    badge: 'Commercial',
  },
  {
    title: 'รถ 700,000 ผ่อน 5 ปี',
    href: '/บทความ/ผ่อนรถ-700000-บาท-5-ปี/',
    desc: 'หน้า long-tail เดิมสำหรับคนมีราคารถในใจแล้ว',
    badge: 'Long-tail',
  },
  {
    title: 'คำนวณเบี้ยประกันรถยนต์',
    href: '/คำนวณเบี้ยประกันรถยนต์/',
    desc: 'ต่อยอดจากค่างวดไปยังค่าใช้จ่ายรถรายปีและ affiliate intent',
    badge: 'Affiliate',
  },
];

export const homeLoanGrowthLinks: TrafficGrowthLink[] = [
  {
    title: 'กู้บ้าน 2,500,000 บาท 30 ปี',
    href: '/บทความ/กู้บ้าน-2500000-บาท-30-ปี-ผ่อนเดือนละเท่าไร/',
    desc: 'ตัวอย่างยอดกู้ยอดนิยมสำหรับคนประเมินความสามารถผ่อนบ้าน',
    badge: 'Long-tail',
  },
  {
    title: 'รีไฟแนนซ์บ้าน 2569 คุ้มไหม',
    href: '/บทความ/รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร/',
    desc: 'ช่วยตัดสินใจก่อนเปลี่ยนธนาคารหรือสมัครข้อเสนอใหม่',
    badge: 'Money page',
  },
  {
    title: 'ค่าธรรมเนียมโอนบ้าน 2569',
    href: '/คำนวณค่าธรรมเนียมโอนบ้าน/',
    desc: 'คิดต้นทุนวันโอนก่อนจองหรือยื่นกู้',
    badge: 'Related',
  },
];
