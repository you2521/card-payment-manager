import { CreditCard, BankAccount } from '../types';

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
 * Calculate the next actual date (YYYY-MM-DD) for a card relative to reference date (default: today)
 */
export function getNextPaymentDate(card: CreditCard, referenceDate: Date = new Date()): Date {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth(); // 0-indexed
  const today = referenceDate.getDate();

  let targetYear = year;
  let targetMonth = month;
  let targetDay = 1;

  if (card.paymentDayType === 'end_of_month') {
    // Last day of current month
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
      // Payment day in current month hasn't passed
      const maxDayCurrentMonth = new Date(year, month + 1, 0).getDate();
      targetDay = Math.min(cardDay, maxDayCurrentMonth);
    } else {
      // Payment day passed, move to next month
      targetMonth = month + 1;
      const maxDayNextMonth = new Date(year, targetMonth + 1, 0).getDate();
      targetDay = Math.min(cardDay, maxDayNextMonth);
    }
  }

  return new Date(targetYear, targetMonth, targetDay);
}

/**
 * Get days remaining until next payment
 */
export function getDaysUntilNextPayment(card: CreditCard, referenceDate: Date = new Date()): {
  daysLeft: number;
  nextDateFormatted: string;
  isToday: boolean;
  isTomorrow: boolean;
} {
  const nextDate = getNextPaymentDate(card, referenceDate);
  
  // Set times to midnight for clean day calculation
  const startToday = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const startNext = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());

  const diffMs = startNext.getTime() - startToday.getTime();
  const daysLeft = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const monthStr = nextDate.getMonth() + 1;
  const dateStr = nextDate.getDate();
  const nextDateFormatted = `${monthStr}/${dateStr}`;

  return {
    daysLeft,
    nextDateFormatted,
    isToday: daysLeft === 0,
    isTomorrow: daysLeft === 1
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
