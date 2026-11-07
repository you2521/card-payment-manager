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
      {/* DADS セクション見出し */}
      <div className="dads-section-header">
        <h2 className="dads-section-title">支払日カレンダー</h2>
        <span className="dads-counter-badge">
          {year}年{month + 1}月: 計 {totalPaymentsInMonth} 件
        </span>
      </div>

      {/* メインカレンダーカード (DADS 8px角丸) */}
      <div className="dads-card p-3 sm:p-5 transition-colors space-y-3.5">
        {/* 月切り替えコントロールバー (DADS 4px角丸) */}
        <div className="flex items-center justify-between bg-[var(--dads-gray-100)] p-2 rounded-[4px] border border-[var(--dads-gray-300)]">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="dads-action-btn px-2"
            title="前月を表示"
          >
            <ChevronLeft strokeWidth={2} className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-base sm:text-lg font-bold font-mono text-[var(--dads-sumi-900)]">
              {year}年 {month + 1}月
            </span>
            {!isTodayMonth && (
              <button
                type="button"
                onClick={handleCurrentMonth}
                className="px-2.5 py-1 text-xs font-bold rounded-[4px] theme-bg-primary text-white transition-all cursor-pointer"
              >
                今月へ
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="dads-action-btn px-2"
            title="翌月を表示"
          >
            <ChevronRight strokeWidth={2} className="h-4 w-4" />
          </button>
        </div>

        {/* 曜日ヘッダー（日曜=DADSレッド、土曜=DADSブルー固定でテーマ色がオレンジ・赤でも混同しない） */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-bold py-1.5 border-b border-[var(--dads-gray-300)]">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd.name}
              className={
                wd.isSunday
                  ? 'text-[var(--dads-sunday)]'
                  : wd.isSaturday
                  ? 'text-[var(--dads-saturday)]'
                  : 'text-[var(--dads-sumi-700)]'
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
              className="h-14 sm:h-16 rounded-[4px] bg-[var(--dads-gray-100)]/50 border border-transparent"
            />
          ))}

          {/* 各日付セル (DADS 4px角丸) */}
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
                className={`h-14 sm:h-16 p-1.5 rounded-[4px] flex flex-col justify-between items-start transition-all border text-left cursor-pointer ${
                  isSelectedCell
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] dark:bg-[var(--color-primary-subtle-dark)] ring-1 ring-[var(--color-primary)]'
                    : isTodayCell
                    ? 'border-[var(--color-primary)] bg-[var(--dads-white)] hover:bg-[var(--dads-gray-100)]'
                    : hasPayments
                    ? 'bg-[var(--dads-warning-bg)] border-[var(--dads-warning-border)] hover:border-[var(--color-primary)]'
                    : 'bg-[var(--dads-white)] border-[var(--dads-gray-200)] hover:bg-[var(--dads-gray-100)]'
                }`}
              >
                {/* 日付ラベル＆件数 */}
                <div className="w-full flex items-center justify-between leading-none">
                  <span
                    className={`text-xs sm:text-sm font-bold font-mono ${
                      isTodayCell
                        ? 'w-5 h-5 rounded-[4px] theme-bg-primary text-white flex items-center justify-center text-xs'
                        : isSunday
                        ? 'text-[var(--dads-sunday)]'
                        : isSaturday
                        ? 'text-[var(--dads-saturday)]'
                        : 'text-[var(--dads-sumi-900)]'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {hasPayments && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-[3px] theme-bg-primary text-white font-mono">
                      {payments.length}
                    </span>
                  )}
                </div>

                {/* カラードット */}
                {hasPayments && (
                  <div className="w-full flex flex-wrap gap-1 mt-auto">
                    {payments.slice(0, 3).map((item) => {
                      const cfg = getBrandColorConfig(item.card.brandColor, isDark);
                      return (
                        <span
                          key={item.card.id}
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cfg.hex }}
                          title={item.card.name}
                        />
                      );
                    })}
                    {payments.length > 3 && (
                      <span className="text-[9px] text-[var(--dads-sumi-700)] leading-none font-bold">
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

      {/* 選択した日の詳細 (DADS カードUI) */}
      <div className="dads-card p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-[var(--dads-gray-200)]">
          <div className="flex items-center gap-2">
            <Clock strokeWidth={2} className="h-4 w-4 text-[var(--color-primary)]" />
            <h3 className="text-sm sm:text-base font-bold text-[var(--dads-sumi-900)]">
              {month + 1}月{selectedDay}日（{selectedWeekdayName}）の引き落とし予定
            </h3>
          </div>
          <span className="dads-counter-badge font-mono">
            {selectedDayPayments.length} 件
          </span>
        </div>

        {selectedDayPayments.length === 0 ? (
          <div className="py-5 text-center space-y-1">
            <p className="text-sm font-bold text-[var(--dads-sumi-700)]">
              この日に引き落とし予定のカードはありません。
            </p>
            <p className="text-xs text-[var(--dads-sumi-500)]">
              カレンダーの日付をタップすると、その日の予定を確認できます。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-0.5">
            {selectedDayPayments.map((item) => {
              const { card, isAdjusted, originalDay } = item;
              const linkedAccount = getBankAccount(accounts, card.bankAccountId);
              const brandCfg = getBrandColorConfig(card.brandColor, isDark);
              const accColor = getAccessibleColorHex(linkedAccount?.color, isDark);

              return (
                <div
                  key={card.id}
                  className="p-3 rounded-[4px] border border-[var(--dads-gray-300)] bg-[var(--dads-gray-100)]/50 flex items-center justify-between gap-2.5 hover:border-[var(--color-primary)] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: brandCfg.hex }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] sm:text-base font-bold text-[var(--dads-sumi-900)] truncate tracking-tight">
                          {card.name}
                        </span>
                        {isAdjusted && (
                          <span className="inline-flex items-center text-[10px] font-bold text-[var(--dads-warning-text)] bg-[var(--dads-warning-bg)] px-1.5 py-0.5 rounded-[4px] border border-[var(--dads-warning-border)]">
                            休日補正（本来{originalDay}日）
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-[var(--dads-sumi-700)] flex items-center gap-1.5 mt-0.5">
                        <Landmark
                          strokeWidth={1.75}
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: linkedAccount ? accColor : 'var(--color-primary)' }}
                        />
                        <span className="truncate font-bold text-[var(--dads-sumi-900)]">
                          {linkedAccount ? linkedAccount.name : '口座未設定'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {onEditCard && (
                    <button
                      type="button"
                      onClick={() => onEditCard(card)}
                      className="dads-action-btn shrink-0"
                      title="カード設定を編集"
                    >
                      <Pencil strokeWidth={1.75} className="h-3.5 w-3.5" />
                      <span>編集</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 補足案内 */}
      <div className="p-3 rounded-[4px] border border-[var(--dads-gray-300)] bg-[var(--dads-white)] flex items-start gap-2 text-xs text-[var(--dads-sumi-700)]">
        <Info strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          土日祝日等の休業日補正が有効なカードは、自動的に翌営業日の位置に表示されます。補正は「設定・保存」または各カードの編集画面から変更できます。
        </p>
      </div>
    </div>
  );
};
