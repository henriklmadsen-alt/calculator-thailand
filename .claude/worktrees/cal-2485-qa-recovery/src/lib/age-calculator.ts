/**
 * Thai Age Calculator (คำนวณอายุ)
 * Calculate age from birthdate, supports Thai Buddhist Era (พ.ศ.)
 */

export interface AgeInput {
  birthDay: number;
  birthMonth: number;  // 1-12
  birthYear: number;   // พ.ศ. (Buddhist Era)
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  birthDateBE: string;  // พ.ศ. format
  birthDateCE: string;  // ค.ศ. format
  nextBirthdayDays: number;
  zodiacThai: string;
  zodiacEnglish: string;
  generation: string;
}

const THAI_ZODIAC: Record<number, { thai: string; english: string }> = {
  0: { thai: 'ราศีมังกร', english: 'Capricorn' },
  1: { thai: 'ราศีกุมภ์', english: 'Aquarius' },
  2: { thai: 'ราศีมีน', english: 'Pisces' },
  3: { thai: 'ราศีเมษ', english: 'Aries' },
  4: { thai: 'ราศีพฤษภ', english: 'Taurus' },
  5: { thai: 'ราศีเมถุน', english: 'Gemini' },
  6: { thai: 'ราศีกรกฎ', english: 'Cancer' },
  7: { thai: 'ราศีสิงห์', english: 'Leo' },
  8: { thai: 'ราศีกันย์', english: 'Virgo' },
  9: { thai: 'ราศีตุลย์', english: 'Libra' },
  10: { thai: 'ราศีพิจิก', english: 'Scorpio' },
  11: { thai: 'ราศีธนู', english: 'Sagittarius' },
};

const ZODIAC_DATES: [number, number][] = [
  // [month, startDay] — when each zodiac sign starts
  [1, 20],   // Aquarius
  [2, 19],   // Pisces
  [3, 21],   // Aries
  [4, 20],   // Taurus
  [5, 21],   // Gemini
  [6, 21],   // Cancer
  [7, 23],   // Leo
  [8, 23],   // Virgo
  [9, 23],   // Libra
  [10, 23],  // Scorpio
  [11, 22],  // Sagittarius
  [12, 22],  // Capricorn
];

function getZodiacIndex(month: number, day: number): number {
  for (let i = ZODIAC_DATES.length - 1; i >= 0; i--) {
    const [m, d] = ZODIAC_DATES[i];
    if (month > m || (month === m && day >= d)) {
      return (i + 1) % 12;
    }
  }
  return 0; // Capricorn (late Dec / early Jan)
}

function getGeneration(ceYear: number): string {
  if (ceYear >= 2013) return 'Gen Alpha (เจนอัลฟา)';
  if (ceYear >= 1997) return 'Gen Z (เจนซี)';
  if (ceYear >= 1981) return 'Gen Y / Millennials (เจนวาย)';
  if (ceYear >= 1965) return 'Gen X (เจนเอ็กซ์)';
  if (ceYear >= 1946) return 'Baby Boomer (เบบี้บูมเมอร์)';
  return 'Silent Generation';
}

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export function calculateAge(input: AgeInput): AgeResult | null {
  const { birthDay, birthMonth, birthYear } = input;
  const ceYear = birthYear - 543;

  const birthDate = new Date(ceYear, birthMonth - 1, birthDay);
  if (isNaN(birthDate.getTime())) return null;

  // Validate the date components match (catches invalid dates like Feb 30)
  if (birthDate.getDate() !== birthDay ||
      birthDate.getMonth() !== birthMonth - 1 ||
      birthDate.getFullYear() !== ceYear) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (birthDate > today) return null;

  // Calculate years, months, days
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Total calculations
  const diffMs = today.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Next birthday
  let nextBirthday = new Date(today.getFullYear(), birthMonth - 1, birthDay);
  if (nextBirthday <= today) {
    nextBirthday = new Date(today.getFullYear() + 1, birthMonth - 1, birthDay);
  }
  const nextBirthdayDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Zodiac
  const zodiacIdx = getZodiacIndex(birthMonth, birthDay);
  const zodiac = THAI_ZODIAC[zodiacIdx];

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    birthDateBE: `${birthDay} ${THAI_MONTHS[birthMonth - 1]} ${birthYear}`,
    birthDateCE: `${birthDay} ${THAI_MONTHS[birthMonth - 1]} ${ceYear}`,
    nextBirthdayDays,
    zodiacThai: zodiac.thai,
    zodiacEnglish: zodiac.english,
    generation: getGeneration(ceYear),
  };
}

export function formatThaiNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
