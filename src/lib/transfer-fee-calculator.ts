// Thai bank transfer fee calculator
// Sources: Bank of Thailand (BOT) fee schedule, major Thai bank published rates (2025-2026)
// PromptPay free mandate: BOT announcement effective 2020, still active 2026
// ATM/counter interbank fees: based on published NITMX/bank rate cards

export type TransferChannel =
  | 'promptpay'
  | 'mobile_same_bank'
  | 'mobile_interbank'
  | 'atm_same_bank'
  | 'atm_interbank'
  | 'counter_same_bank'
  | 'counter_interbank'
  | 'bahtnet';

export interface TransferFeeInput {
  amount: number;
  channel: TransferChannel;
}

export interface TransferFeeResult {
  channel: TransferChannel;
  channelNameTh: string;
  amount: number;
  fee: number;
  total: number;
  note: string;
}

export interface TransferComparisonResult {
  amount: number;
  results: TransferFeeResult[];
  cheapest: TransferFeeResult;
}

const CHANNEL_NAMES: Record<TransferChannel, string> = {
  promptpay: 'พร้อมเพย์ (PromptPay)',
  mobile_same_bank: 'โมบายแบงก์กิ้ง (ภายในธนาคาร)',
  mobile_interbank: 'โมบายแบงก์กิ้ง (ข้ามธนาคาร)',
  atm_same_bank: 'ATM (ภายในธนาคาร)',
  atm_interbank: 'ATM (ข้ามธนาคาร)',
  counter_same_bank: 'เคาน์เตอร์ธนาคาร (ภายในธนาคาร)',
  counter_interbank: 'เคาน์เตอร์ธนาคาร (ข้ามธนาคาร)',
  bahtnet: 'BAHTNET (โอนเงินรายใหญ่)',
};

function calculateChannelFee(channel: TransferChannel, amount: number): { fee: number; note: string } {
  switch (channel) {
    case 'promptpay':
      return { fee: 0, note: 'ฟรีไม่จำกัดจำนวนครั้ง (นโยบาย ธปท.)' };

    case 'mobile_same_bank':
      return { fee: 0, note: 'ฟรีสำหรับโอนภายในธนาคารเดียวกันผ่านแอปฯ' };

    case 'mobile_interbank':
      return { fee: 0, note: 'ฟรีสำหรับโอนข้ามธนาคารผ่านแอปฯ (นโยบาย ธปท.)' };

    case 'atm_same_bank':
      return { fee: 0, note: 'ฟรีสำหรับโอนภายในธนาคารเดียวกันผ่านตู้ ATM' };

    case 'atm_interbank':
      // BOT/NITMX standard ATM interbank fee tiers (published rate card)
      if (amount <= 20000) {
        return { fee: 25, note: 'ค่าธรรมเนียม ATM ข้ามธนาคาร (ไม่เกิน 20,000 บาท)' };
      } else if (amount <= 50000) {
        return { fee: 35, note: 'ค่าธรรมเนียม ATM ข้ามธนาคาร (20,001-50,000 บาท)' };
      } else {
        // ATM interbank typically capped at 50,000 per transaction
        return { fee: 35, note: 'ค่าธรรมเนียม ATM ข้ามธนาคาร (เกิน 20,000 บาท) — ATM จำกัดโอนครั้งละไม่เกิน 50,000 บาท' };
      }

    case 'counter_same_bank':
      // Most banks: free for same-bank counter transfers
      if (amount <= 100000) {
        return { fee: 0, note: 'ฟรีสำหรับโอนภายในธนาคารเดียวกันที่เคาน์เตอร์' };
      } else {
        return { fee: 0, note: 'ฟรีสำหรับโอนภายในธนาคารเดียวกันที่เคาน์เตอร์ (บางธนาคารอาจมีค่าธรรมเนียมสำหรับยอดสูง)' };
      }

    case 'counter_interbank':
      // Counter interbank: tiered fees (based on major Thai bank published rates)
      if (amount <= 20000) {
        return { fee: 150, note: 'ค่าธรรมเนียมข้ามธนาคารที่เคาน์เตอร์ (ไม่เกิน 20,000 บาท)' };
      } else if (amount <= 50000) {
        return { fee: 150, note: 'ค่าธรรมเนียมข้ามธนาคารที่เคาน์เตอร์ (ไม่เกิน 50,000 บาท)' };
      } else {
        return { fee: 200, note: 'ค่าธรรมเนียมข้ามธนาคารที่เคาน์เตอร์ (เกิน 50,000 บาท)' };
      }

    case 'bahtnet':
      // BAHTNET: BOT real-time gross settlement for high-value transfers
      if (amount < 2000000) {
        return { fee: 150, note: 'BAHTNET สำหรับโอนยอดต่ำกว่า 2 ล้านบาท (ค่าธรรมเนียมขั้นต่ำ)' };
      } else {
        return { fee: 250, note: 'BAHTNET สำหรับโอนยอดตั้งแต่ 2 ล้านบาทขึ้นไป' };
      }

    default:
      return { fee: 0, note: '' };
  }
}

export function calculateTransferFee(input: TransferFeeInput): TransferFeeResult {
  const amount = Math.max(0, input.amount);
  const { fee, note } = calculateChannelFee(input.channel, amount);

  return {
    channel: input.channel,
    channelNameTh: CHANNEL_NAMES[input.channel],
    amount,
    fee: Math.round(fee * 100) / 100,
    total: Math.round((amount + fee) * 100) / 100,
    note,
  };
}

export const ALL_CHANNELS: TransferChannel[] = [
  'promptpay',
  'mobile_same_bank',
  'mobile_interbank',
  'atm_same_bank',
  'atm_interbank',
  'counter_same_bank',
  'counter_interbank',
  'bahtnet',
];

export function compareAllChannels(amount: number): TransferComparisonResult {
  const results = ALL_CHANNELS.map((channel) => calculateTransferFee({ amount, channel }));
  const cheapest = results.reduce((min, r) => (r.fee < min.fee ? r : min), results[0]);

  return { amount, results, cheapest };
}

export function getChannelNameTh(channel: TransferChannel): string {
  return CHANNEL_NAMES[channel];
}
