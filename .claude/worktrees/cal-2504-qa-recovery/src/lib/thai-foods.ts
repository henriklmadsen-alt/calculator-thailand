/**
 * Thai Food Database (ฐานข้อมูลอาหารไทย)
 * Common Thai foods with calorie and macronutrient data
 * Sources: Thai Nutrition Database, USDA, FAO
 */

export interface ThaiFood {
  name: string;       // Thai name
  nameEn: string;     // English name
  unit: string;       // หน่วย (serving unit: กัน, ชาม, ชิ้น, ลิตร, etc.)
  calories: number;   // kcal per serving
  protein: number;    // grams
  carbs: number;      // grams
  fat: number;        // grams
  fiber: number;      // grams
  category: string;   // food group
}

export const thaiFoods: ThaiFood[] = [
  // ข้าวและผลิตภัณฑ์ข้าว (Rice and Rice Products)
  {
    name: 'ข้าวสวย',
    nameEn: 'Steamed white rice',
    unit: 'ชาม (1 cup cooked)',
    calories: 206,
    protein: 4,
    carbs: 45,
    fat: 0.3,
    fiber: 0.6,
    category: 'grains',
  },
  {
    name: 'ข้าวเหนียว',
    nameEn: 'Sticky rice',
    unit: 'ชาม (1 cup cooked)',
    calories: 216,
    protein: 4,
    carbs: 48,
    fat: 0.3,
    fiber: 0.5,
    category: 'grains',
  },
  {
    name: 'ข้าวกล้อง',
    nameEn: 'Brown rice',
    unit: 'ชาม (1 cup cooked)',
    calories: 215,
    protein: 5,
    carbs: 45,
    fat: 2,
    fiber: 3.5,
    category: 'grains',
  },
  {
    name: 'โจ๊กไก่',
    nameEn: 'Chicken congee',
    unit: 'ชาม (1 bowl)',
    calories: 180,
    protein: 12,
    carbs: 28,
    fat: 2,
    fiber: 0.5,
    category: 'main_dishes',
  },
  // เนื้อและปลา (Meat and Fish)
  {
    name: 'ไก่ต้มเกลือ',
    nameEn: 'Salt-boiled chicken',
    unit: 'ชิ้น (100g)',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    category: 'protein',
  },
  {
    name: 'เนื้อวัวต้ม',
    nameEn: 'Boiled beef',
    unit: 'ชิ้น (100g)',
    calories: 215,
    protein: 26,
    carbs: 0,
    fat: 11,
    fiber: 0,
    category: 'protein',
  },
  {
    name: 'ปลาสดแล่',
    nameEn: 'Fresh fish',
    unit: 'ชิ้น (100g)',
    calories: 82,
    protein: 18,
    carbs: 0,
    fat: 0.7,
    fiber: 0,
    category: 'protein',
  },
  {
    name: 'กุ้ง',
    nameEn: 'Shrimp',
    unit: '100g',
    calories: 99,
    protein: 24,
    carbs: 0,
    fat: 0.3,
    fiber: 0,
    category: 'protein',
  },
  {
    name: 'หมูแดง',
    nameEn: 'Pork',
    unit: '100g',
    calories: 242,
    protein: 27,
    carbs: 0,
    fat: 14,
    fiber: 0,
    category: 'protein',
  },
  // ผักและผลไม้ (Vegetables and Fruits)
  {
    name: 'แตงกวา',
    nameEn: 'Cucumber',
    unit: '1 ลูก',
    calories: 16,
    protein: 0.7,
    carbs: 3.6,
    fat: 0.1,
    fiber: 0.5,
    category: 'vegetables',
  },
  {
    name: 'มะเขือ',
    nameEn: 'Eggplant',
    unit: '100g',
    calories: 25,
    protein: 1,
    carbs: 6,
    fat: 0.2,
    fiber: 3,
    category: 'vegetables',
  },
  {
    name: 'ผักกาด',
    nameEn: 'Leafy greens',
    unit: '100g',
    calories: 23,
    protein: 2.3,
    carbs: 4,
    fat: 0.2,
    fiber: 2.2,
    category: 'vegetables',
  },
  {
    name: 'มัน',
    nameEn: 'Cassava',
    unit: '100g',
    calories: 160,
    protein: 1.4,
    carbs: 38,
    fat: 0.3,
    fiber: 1.8,
    category: 'vegetables',
  },
  {
    name: 'มะพร้าว',
    nameEn: 'Coconut',
    unit: '1 ลูก',
    calories: 354,
    protein: 3.3,
    carbs: 15,
    fat: 33,
    fiber: 9,
    category: 'fruits',
  },
  {
    name: 'ช้อน (นม)',
    nameEn: 'Coconut milk',
    unit: 'ถ้วย (240ml)',
    calories: 560,
    protein: 5,
    carbs: 7,
    fat: 57,
    fiber: 0,
    category: 'condiments',
  },
  // จานเด็ด (Popular Dishes)
  {
    name: 'ส้มตำ',
    nameEn: 'Papaya salad',
    unit: 'จาน (200g)',
    calories: 95,
    protein: 5,
    carbs: 18,
    fat: 1.5,
    fiber: 3,
    category: 'main_dishes',
  },
  {
    name: 'แกงแค่ง',
    nameEn: 'Red curry',
    unit: 'ชาม (300ml)',
    calories: 280,
    protein: 18,
    carbs: 15,
    fat: 18,
    fiber: 2,
    category: 'main_dishes',
  },
  {
    name: 'แกงเขียว',
    nameEn: 'Green curry',
    unit: 'ชาม (300ml)',
    calories: 300,
    protein: 20,
    carbs: 14,
    fat: 20,
    fiber: 1.5,
    category: 'main_dishes',
  },
  {
    name: 'ต้มยำกุ้ง',
    nameEn: 'Tom yam goong',
    unit: 'ชาม (400ml)',
    calories: 140,
    protein: 18,
    carbs: 12,
    fat: 2,
    fiber: 2,
    category: 'main_dishes',
  },
  {
    name: 'ต้มจืดหมูกระดูก',
    nameEn: 'Clear pork soup',
    unit: 'ชาม (400ml)',
    calories: 120,
    protein: 14,
    carbs: 8,
    fat: 3,
    fiber: 1,
    category: 'main_dishes',
  },
  {
    name: 'ผัดไทย',
    nameEn: 'Pad Thai',
    unit: 'จาน (300g)',
    calories: 358,
    protein: 13,
    carbs: 45,
    fat: 14,
    fiber: 2,
    category: 'main_dishes',
  },
  {
    name: 'กะเพราหมูสับ',
    nameEn: 'Pork basil stir-fry',
    unit: 'จาน (250g)',
    calories: 245,
    protein: 22,
    carbs: 8,
    fat: 14,
    fiber: 1,
    category: 'main_dishes',
  },
  {
    name: 'ลาบหมู',
    nameEn: 'Pork larb',
    unit: 'จาน (150g)',
    calories: 180,
    protein: 24,
    carbs: 5,
    fat: 8,
    fiber: 1,
    category: 'main_dishes',
  },
  // ขนมหวานและเครื่องดื่ม (Desserts and Beverages)
  {
    name: 'ขนมครกชา',
    nameEn: 'Thai dessert',
    unit: 'ชิ้น (50g)',
    calories: 160,
    protein: 2,
    carbs: 25,
    fat: 6,
    fiber: 0.5,
    category: 'desserts',
  },
  {
    name: 'เข่งข้าว',
    nameEn: 'Sticky rice mango',
    unit: 'จาน (300g)',
    calories: 320,
    protein: 4,
    carbs: 58,
    fat: 6,
    fiber: 1,
    category: 'desserts',
  },
  {
    name: 'ชาไทย',
    nameEn: 'Thai iced tea',
    unit: 'แก้ว (250ml)',
    calories: 150,
    protein: 1,
    carbs: 30,
    fat: 2,
    fiber: 0,
    category: 'beverages',
  },
  {
    name: 'กาแฟสด',
    nameEn: 'Black coffee',
    unit: 'แก้ว (250ml)',
    calories: 2,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    category: 'beverages',
  },
  {
    name: 'นมสด',
    nameEn: 'Fresh milk',
    unit: 'แก้ว (250ml)',
    calories: 161,
    protein: 8,
    carbs: 12,
    fat: 9,
    fiber: 0,
    category: 'beverages',
  },
];

/**
 * Get a food by name
 */
export function getFoodByName(name: string): ThaiFood | undefined {
  return thaiFoods.find((f) => f.name.toLowerCase() === name.toLowerCase());
}

/**
 * Get all foods by category
 */
export function getFoodsByCategory(category: string): ThaiFood[] {
  return thaiFoods.filter((f) => f.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return [...new Set(thaiFoods.map((f) => f.category))];
}
