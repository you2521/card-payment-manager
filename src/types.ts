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
}

export type ActiveTab = 'dashboard' | 'cards' | 'accounts';
