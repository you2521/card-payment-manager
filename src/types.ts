export type PaymentDayType = 'day' | 'end_of_month';

export interface BankAccount {
  id: string;
  name: string;
  branchName?: string;
  accountType?: string; // e.g. "普通", "当座"
  color?: string; // e.g. badge color tag
  note?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  paymentDayType: PaymentDayType;
  paymentDayValue?: number; // 1 - 31
  bankAccountId: string;
  closingDay?: string; // e.g. "15日締め" or "前月末締め"
  brandColor?: string; // e.g., "blue", "emerald", "amber", "purple", "rose"
  memo?: string;
  adjustForBankHolidays?: boolean; // 金融機関休業日（土日祝日）の翌営業日補正（未指定時はtrue）
}

export type ActiveTab = 'dashboard' | 'cards' | 'accounts';

export type ThemeAccentColor = 'blue' | 'orange' | 'green' | 'purple' | 'red' | 'slate';

export interface ThemeColorConfig {
  id: ThemeAccentColor;
  label: string;
  primaryHex: string;
  hoverHex: string;
  lightBgHex: string;
}
