import { BankAccount, CreditCard } from '../types';

export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc-1',
    name: 'PayPay銀行',
    accountType: '普通',
    color: '#FF0033', // Red accent
    note: 'JALカードnavi、Paidy用'
  },
  {
    id: 'acc-2',
    name: '楽天銀行',
    accountType: '普通',
    color: '#BF0000', // Crimson accent
    note: 'ビックカメラSuica用'
  },
  {
    id: 'acc-3',
    name: '三井住友銀行',
    accountType: '普通',
    color: '#004B23', // Emerald green accent
    note: 'Oliveクレジットモード用'
  }
];

export const INITIAL_CREDIT_CARDS: CreditCard[] = [
  {
    id: 'card-1',
    name: 'ビックカメラSuicaカード',
    paymentDayType: 'day',
    paymentDayValue: 4,
    bankAccountId: 'acc-2', // 楽天銀行
    closingDay: '前月10日締め',
    brandColor: 'emerald',
    memo: '交通系ICオートチャージ連携'
  },
  {
    id: 'card-2',
    name: 'JALカードnavi',
    paymentDayType: 'day',
    paymentDayValue: 10,
    bankAccountId: 'acc-1', // PayPay銀行
    closingDay: '前月15日締め',
    brandColor: 'rose',
    memo: 'マイル還元用メインカード'
  },
  {
    id: 'card-3',
    name: 'Oliveクレジットモード',
    paymentDayType: 'day',
    paymentDayValue: 26,
    bankAccountId: 'acc-3', // 三井住友銀行
    closingDay: '前月15日締め',
    brandColor: 'amber',
    memo: 'Vポイント還元＆三井住友統合口座'
  },
  {
    id: 'card-4',
    name: 'Paidyカード',
    paymentDayType: 'end_of_month',
    bankAccountId: 'acc-1', // PayPay銀行
    closingDay: '前月末日締め',
    brandColor: 'purple',
    memo: '翌月一括払い・バーチャルカード'
  }
];
