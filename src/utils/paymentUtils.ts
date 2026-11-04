import { CreditCard, BankAccount } from '../types';
import { adjustToNextBankBusinessDay, getJapaneseHolidayName } from './bankHolidayUtils';

export const JAPANESE_WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

/**
 * Get numeric sort rank for a card based on its payment date.
 * Specific days 1-31 return 1-31. End of month returns 32.
 */
export function getPaymentDaySortRank(card: CreditCard): number {
  if (card.paymentDayType === 'end_of_month') {
    return 32;
  }
  return card.paymentDayValue ?? 31;
}

/**
 * Sort credit cards by payment date from earliest to latest (e.g. 4日 -> 10日 -> 26日 -> 月末).
 */
export function sortCardsByPaymentDay(cards: CreditCard[]): CreditCard[] {
  return [...cards].sort((a, b) => {
    const rankA = getPaymentDaySortRank(a);
    const rankB = getPaymentDaySortRank(b);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.name.localeCompare(b.name, 'ja');
  });
}

/**
 * Format payment day for display.
 * e.g. "4日", "10日", "26日", "月末"
 */
export function formatPaymentDay(card: CreditCard, prefixEveryMonth: boolean = false): string {
  if (card.paymentDayType === 'end_of_month') {
    return prefixEveryMonth ? '毎月末日' : '月末';
  }
  const day = card.paymentDayValue ?? 1;
  return prefixEveryMonth ? `毎月${day}日` : `${day}日`;
}

/**
 * Calculate the raw scheduled date in current or next month without holiday adjustment
 */
export function getRawScheduledDate(card: CreditCard, referenceDate: Date = new Date()): Date {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const today = referenceDate.getDate();

  let targetYear = year;
  let targetMonth = month;
  let targetDay = 1;

  if (card.paymentDayType === 'end_of_month') {
    const lastDayCurrentMonth = new Date(year, month + 1, 0).getDate();
    if (today <= lastDayCurrentMonth) {
      targetDay = lastDayCurrentMonth;
    } else {
      targetMonth = month + 1;
      targetDay = new Date(year, targetMonth + 1, 0).getDate();
    }
  } else {
    const cardDay = card.paymentDayValue ?? 1;
    if (today <= cardDay) {
      const maxDayCurrentMonth = new Date(year, month + 1, 0).getDate();
      targetDay = Math.min(cardDay, maxDayCurrentMonth);
    } else {
      targetMonth = month + 1;
      const maxDayNextMonth = new Date(year, targetMonth + 1, 0).getDate();
      targetDay = Math.min(cardDay, maxDayNextMonth);
    }
  }

  return new Date(targetYear, targetMonth, targetDay);
}

/**
 * Calculate the next actual payment date (accounting for bank business days if enabled)
 */
export function getNextPaymentDate(
  card: CreditCard,
  referenceDate: Date = new Date(),
  adjustForHolidays: boolean = true
): {
  date: Date;
  isAdjusted: boolean;
  originalDate: Date;
  adjustmentReason?: string;
} {
  const rawDate = getRawScheduledDate(card, referenceDate);

  if (!adjustForHolidays) {
    return {
      date: rawDate,
      isAdjusted: false,
      originalDate: rawDate,
    };
  }

  const { adjustedDate, isAdjusted, originalDate, reason } = adjustToNextBankBusinessDay(rawDate);

  // If today is past the adjusted date (which can happen if raw date was today or yesterday and shifted),
  // recalculate starting from tomorrow or move to next month cycle
  const startToday = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const startAdjusted = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate());

  if (startAdjusted.getTime() < startToday.getTime()) {
    // Already passed, calculate for next cycle
    const nextRef = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);
    const nextRaw = getRawScheduledDate(card, nextRef);
    const nextAdjusted = adjustToNextBankBusinessDay(nextRaw);
    return {
      date: nextAdjusted.adjustedDate,
      isAdjusted: nextAdjusted.isAdjusted,
      originalDate: nextAdjusted.originalDate,
      adjustmentReason: nextAdjusted.reason,
    };
  }

  return {
    date: adjustedDate,
    isAdjusted,
    originalDate,
    adjustmentReason: reason,
  };
}

/**
 * Get days remaining until next payment with weekday and holiday shift details
 */
export function getDaysUntilNextPayment(
  card: CreditCard,
  referenceDate: Date = new Date(),
  adjustForHolidays: boolean = true
): {
  daysLeft: number;
  nextDateFormatted: string;
  nextDateWithWeekday: string;
  isToday: boolean;
  isTomorrow: boolean;
  isAdjusted: boolean;
  originalDateFormatted: string;
  adjustmentReason?: string;
  weekdayStr: string;
} {
  const { date: nextDate, isAdjusted, originalDate, adjustmentReason } = getNextPaymentDate(
    card,
    referenceDate,
    adjustForHolidays
  );

  const startToday = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const startNext = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());

  const diffMs = startNext.getTime() - startToday.getTime();
  const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const monthStr = nextDate.getMonth() + 1;
  const dateStr = nextDate.getDate();
  const weekday = JAPANESE_WEEKDAYS[nextDate.getDay()];
  const nextDateFormatted = `${monthStr}/${dateStr}`;
  const nextDateWithWeekday = `${monthStr}/${dateStr}(${weekday})`;

  const origMonth = originalDate.getMonth() + 1;
  const origDay = originalDate.getDate();
  const origWeekday = JAPANESE_WEEKDAYS[originalDate.getDay()];
  const originalDateFormatted = `${origMonth}/${origDay}(${origWeekday})`;

  return {
    daysLeft,
    nextDateFormatted,
    nextDateWithWeekday,
    isToday: daysLeft === 0,
    isTomorrow: daysLeft === 1,
    isAdjusted,
    originalDateFormatted,
    adjustmentReason,
    weekdayStr: weekday,
  };
}

/**
 * Lookup bank account name by ID
 */
export function getBankAccountName(accounts: BankAccount[], accountId: string): string {
  const account = accounts.find((a) => a.id === accountId);
  return account ? account.name : '未登録口座';
}

/**
 * Helper to get bank object
 */
export function getBankAccount(accounts: BankAccount[], accountId: string): BankAccount | undefined {
  return accounts.find((a) => a.id === accountId);
}
