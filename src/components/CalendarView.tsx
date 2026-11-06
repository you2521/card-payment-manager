import React, { useState, useMemo } from 'react';
import { CreditCard, BankAccount } from '../types';
import { getBankAccount } from '../utils/paymentUtils';
import { getBrandColorConfig, getAccessibleColorHex } from '../utils/colors';
import { adjustToNextBankBusinessDay } from '../utils/bankHolidayUtils';
import {
  ChevronLeft,
  ChevronRight,
  Landmark,
  Clock,
  Pencil,
  Info,
} from 'lucide-react';

interface CalendarViewProps {
  cards: CreditCard[];
  accounts: BankAccount[];
  isDark?: boolean;
  adjustForBankHolidays?: boolean;
  onEditCard?: (card: CreditCard) => void;
}

const WEEKDAYS = [
  { name: '日', isSunday: true },
  { name: '月' },
  { name: '火' },
  { name: '水' },
  { name: '木' },
  { name: '金' },
  { name: '土', isSaturday: true },
];

interface DayPaymentItem {
  card: CreditCard;
  isAdjusted: boolean;
  originalDay: number;
  reason?: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  cards,
  accounts,
  isDark = false,
  adjustForBankHolidays = true,
  onEditCard,
}) => {
  const [viewDate, setViewDate] = useState(() => new Date());
  const today = new Date();

  // 現在表示中の年月
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // 選択中の日付 (1 - 31)
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    return today.getFullYear() === year && today.getMonth() === month
      ? today.getDate()
      : 1;
  });

  // 前月・翌月・今月へ
  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    setViewDate(prev);
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    const next = new Date(year, month + 1, 1);
    setViewDate(next);
    setSelectedDay(1);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    setViewDate(now);
    setSelectedDay(now.getDate());
  };

  const isTodayMonth = today.getFullYear() === year && today.getMonth() === month;

  // カレンダー計算
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  // 当月の各日付における引き落とし予定マップを事前計算（土日祝日補正を反映）
  const monthPaymentsMap = useMemo(() => {
    const map = new Map<number, DayPaymentItem[]>();
    for (let d = 1; d <= daysInMonth; d++) {
      map.set(d, []);
    }

    cards.forEach((card) => {
      let rawTargetDay = 1;
      if (card.paymentDayType === 'end_of_month') {
        rawTargetDay = daysInMonth;
      } else {
        const setVal = card.paymentDayValue ?? 1;
        rawTargetDay = Math.min(setVal, daysInMonth);
      }

      const rawDate = new Date(year, month, rawTargetDay);

      // カード別設定または全体設定で土日祝補正を適用
      const shouldAdjust =
        card.adjustForBankHolidays !== undefined
          ? card.adjustForBankHolidays
          : adjustForBankHolidays;

      if (!shouldAdjust) {
        const list = map.get(rawTargetDay) || [];
        list.push({ card, isAdjusted: false, originalDay: rawTargetDay });
        map.set(rawTargetDay, list);
      } else {
        const { adjustedDate, isAdjusted, reason } = adjustToNextBankBusinessDay(rawDate);
        // 補正後の日付が同じ月内にある場合
        if (adjustedDate.getFullYear() === year && adjustedDate.getMonth() === month) {
          const actualDay = adjustedDate.getDate();
          const list = map.get(actualDay) || [];
          list.push({ card, isAdjusted, originalDay: rawTargetDay, reason });
          map.set(actualDay, list);
        }
      }
    });

    return map;
  }, [cards, year, month, daysInMonth, adjustForBankHolidays]);

  // 当月の総引き落とし件数
  const totalPaymentsInMonth = useMemo(() => {
    let count = 0;
    monthPaymentsMap.forEach((list) => {
      count += list.length;
    });
    return count;
  }, [monthPaymentsMap]);

  // 選択中の日付の引き落としカード一覧
  const selectedDayPayments = monthPaymentsMap.get(selectedDay) || [];

  // 選択中の日付の曜日
  const selectedWeekdayIndex = new Date(year, month, selectedDay).getDay();
  const selectedWeekdayName = WEEKDAYS[selectedWeekdayIndex].name;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* DADS準拠の端正なセクション見出し */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-xs bg-[var(--color-primary)] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">
            支払日カレンダー
          </h2>
          <span className="text-xs font-mono text-[#667085] dark:text-[#98a2b3]">
            ({year}年{month + 1}月: 計{totalPaymentsInMonth}件)
          </span>
        </div>
      </div>

      {/* メインカレンダーカード */}
      <div className="rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-3 sm:p-5 transition-colors space-y-4">
        {/* 月切り替えコントロールバー */}
        <div className="flex items-center justify-between bg-[#f4f6f8] dark:bg-[#222730] p-2 sm:p-2.5 rounded-lg border border-[#d0d5dd] dark:border-[#363f4e]">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-md hover:bg-white dark:hover:bg-[#1a1f26] border border-transparent hover:border-[#d0d5dd] text-[#344054] dark:text-[#cfd5e0] transition-colors cursor-pointer"
            title="前月を表示"
          >
            <ChevronLeft strokeWidth={1.75} className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold font-mono text-[#101828] dark:text-white">
              {year}年 {month + 1}月
            </span>
            {!isTodayMonth && (
              <button
                type="button"
                onClick={handleCurrentMonth}
                className="px-2.5 py-1 text-xs font-bold rounded-md theme-bg-primary text-white transition-all cursor-pointer"
              >
                今月へ
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-md hover:bg-white dark:hover:bg-[#1a1f26] border border-transparent hover:border-[#d0d5dd] text-[#344054] dark:text-[#cfd5e0] transition-colors cursor-pointer"
            title="翌月を表示"
          >
            <ChevronRight strokeWidth={1.75} className="h-5 w-5" />
          </button>
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold py-1 border-b border-[#d0d5dd] dark:border-[#2e3642]">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd.name}
              className={
                wd.isSunday
                  ? 'text-[#d92d20] dark:text-[#f87171]'
                  : wd.isSaturday
                  ? 'text-[var(--color-primary)]'
                  : 'text-[#475467] dark:text-[#98a2b3]'
              }
            >
              {wd.name}
            </div>
          ))}
        </div>

        {/* カレンダーマトリックス */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {/* 前月余白 */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="h-14 sm:h-16 rounded-md bg-[#f4f6f8]/40 dark:bg-[#12151a]/40 border border-transparent"
            />
          ))}

          {/* 各日付セル */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const payments = monthPaymentsMap.get(dayNum) || [];
            const hasPayments = payments.length > 0;
            const isTodayCell = isTodayMonth && today.getDate() === dayNum;
            const isSelectedCell = selectedDay === dayNum;

            const dayOfWeek = (firstDayOfWeek + i) % 7;
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                onClick={() => setSelectedDay(dayNum)}
                className={`h-14 sm:h-16 p-1 sm:p-1.5 rounded-lg flex flex-col justify-between items-start transition-all border text-left cursor-pointer ${
                  isSelectedCell
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] dark:bg-[var(--color-primary-subtle-dark)] ring-1 ring-[var(--color-primary)]'
                    : isTodayCell
                    ? 'border-[var(--color-primary)]/60 bg-[var(--color-primary-subtle)]/40 hover:border-[var(--color-primary)]'
                    : hasPayments
                    ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/35 hover:border-[var(--color-primary)]'
                    : 'bg-white dark:bg-[#1a1f26] border-[#d0d5dd]/70 dark:border-[#2e3642] hover:bg-[#f4f6f8] dark:hover:bg-[#222730]'
                }`}
              >
                {/* 日付ラベル＆件数 */}
                <div className="w-full flex items-center justify-between leading-none">
                  <span
                    className={`text-xs font-bold font-mono ${
                      isTodayCell
                        ? 'w-5 h-5 rounded-full theme-bg-primary text-white flex items-center justify-center text-[10px]'
                        : isSunday
                        ? 'text-[#d92d20] dark:text-[#f87171]'
                        : isSaturday
                        ? 'text-[var(--color-primary)]'
                        : 'text-[#101828] dark:text-white'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {hasPayments && (
                    <span className="text-[9px] font-bold px-1 py-0.2 rounded-xs theme-bg-primary text-white">
                      {payments.length}
                    </span>
                  )}
                </div>

                {/* カラードット（ライト/ダーク双方で高視認性の色） */}
                {hasPayments && (
                  <div className="w-full flex flex-wrap gap-1 mt-auto">
                    {payments.slice(0, 3).map((item) => {
                      const cfg = getBrandColorConfig(item.card.brandColor, isDark);
                      return (
                        <span
                          key={item.card.id}
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: cfg.hex }}
                          title={item.card.name}
                        />
                      );
                    })}
                    {payments.length > 3 && (
                      <span className="text-[8px] text-[#667085] dark:text-[#98a2b3] leading-none">
                        +{payments.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 選択した日の詳細（独立アイランドカードUI） */}
      <div className="rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-3.5 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#d0d5dd] dark:border-[#2e3642]">
          <div className="flex items-center gap-2">
            <Clock strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
              {month + 1}月{selectedDay}日（{selectedWeekdayName}）の引き落とし予定
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#475467] dark:text-[#cfd5e0]">
            {selectedDayPayments.length} 件
          </span>
        </div>

        {selectedDayPayments.length === 0 ? (
          <div className="py-6 text-center space-y-1">
            <p className="text-xs sm:text-sm text-[#667085] dark:text-[#98a2b3]">
              この日に引き落とし予定のカードはありません。
            </p>
            <p className="text-[11px] text-[#98a2b3] dark:text-[#667085]">
              カレンダーの日付をタップすると、その日の予定を確認できます。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {selectedDayPayments.map((item) => {
              const { card, isAdjusted, originalDay } = item;
              const linkedAccount = getBankAccount(accounts, card.bankAccountId);
              const brandCfg = getBrandColorConfig(card.brandColor, isDark);
              const accColor = getAccessibleColorHex(linkedAccount?.color, isDark);

              return (
                <div
                  key={card.id}
                  className="p-3 rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 flex items-center justify-between gap-3 hover:border-[var(--color-primary)] transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: brandCfg.hex }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white truncate">
                          {card.name}
                        </span>
                        {isAdjusted && (
                          <span className="inline-flex items-center text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded-xs border border-amber-300 dark:border-amber-700">
                            休日補正（本来{originalDay}日）
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#475467] dark:text-[#cfd5e0] flex items-center gap-1.5 mt-0.5">
                        <Landmark
                          strokeWidth={1.75}
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: linkedAccount ? accColor : 'var(--color-primary)' }}
                        />
                        <span className="truncate">
                          {linkedAccount ? linkedAccount.name : '口座未設定'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {onEditCard && (
                    <button
                      type="button"
                      onClick={() => onEditCard(card)}
                      className="p-1.5 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] text-[#475467] dark:text-[#cfd5e0] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors cursor-pointer shrink-0"
                      title="カード設定を編集"
                    >
                      <Pencil strokeWidth={1.75} className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 補足案内 */}
      <div className="p-3 rounded-lg border border-[#d0d5dd]/80 dark:border-[#2e3642] bg-[#f4f6f8] dark:bg-[#161a20] flex items-start gap-2 text-xs text-[#475467] dark:text-[#98a2b3]">
        <Info strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          土日祝日等の休業日補正が有効なカードは、自動的に翌営業日の位置に表示されます。補正は「設定・保存」または各カードの編集画面から変更できます。
        </p>
      </div>
    </div>
  );
};
