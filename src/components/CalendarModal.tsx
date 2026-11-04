import React, { useState } from 'react';
import { CreditCard, BankAccount } from '../types';
import { getBankAccount } from '../utils/paymentUtils';
import { getBrandColorConfig } from '../utils/colors';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CreditCard as CardIcon,
  Landmark,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: CreditCard[];
  accounts: BankAccount[];
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

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  cards,
  accounts,
}) => {
  const [viewDate, setViewDate] = useState(() => new Date());
  const today = new Date();

  // Selected day within the current view month (1 - 31)
  const [selectedDay, setSelectedDay] = useState<number | null>(() => {
    return today.getDate();
  });

  if (!isOpen) return null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // Prev / Next Month
  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    setViewDate(now);
    setSelectedDay(now.getDate());
  };

  // Calendar calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  // Helper to get cards for a specific day in this month
  const getCardsForDay = (dayNum: number): CreditCard[] => {
    return cards.filter((card) => {
      if (card.paymentDayType === 'end_of_month') {
        return dayNum === daysInMonth;
      }
      return (card.paymentDayValue ?? 1) === dayNum;
    });
  };

  // Currently selected date cards
  const selectedDayCards = selectedDay ? getCardsForDay(selectedDay) : [];

  const isTodayMonth =
    today.getFullYear() === year && today.getMonth() === month;

  // Day cell click handler
  const handleSelectDay = (dayNum: number) => {
    setSelectedDay(dayNum);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-[#202124] border border-slate-200 dark:border-[#3c4043] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-white animate-scaleIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-[#3c4043] bg-slate-50 dark:bg-[#171717]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-blue-600 text-white shadow-md">
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold">
                支払日カレンダー
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-[#9aa0a6]">
                月別のクレジットカード引き落とし予定一覧
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-700 dark:text-[#9aa0a6] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#303134] transition-colors cursor-pointer"
            title="閉じる"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-3.5 sm:space-y-5 flex-1">
          {/* Month Navigation Control */}
          <div className="flex items-center justify-between bg-slate-100 dark:bg-[#303134] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#3c4043]">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-[#3c4043] transition-colors shadow-2xs cursor-pointer"
              title="前月"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm sm:text-lg font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {year}年 {month + 1}月
              </span>
              {!isTodayMonth && (
                <button
                  onClick={handleCurrentMonth}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                >
                  今月へ
                </button>
              )}
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-[#3c4043] transition-colors shadow-2xs cursor-pointer"
              title="翌月"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Weekday Header Grid */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-[11px] sm:text-xs font-bold py-1 border-b border-slate-200 dark:border-[#3c4043]">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd.name}
                className={`py-0.5 ${
                  wd.isSunday
                    ? 'text-rose-500'
                    : wd.isSaturday
                    ? 'text-blue-500'
                    : 'text-slate-500 dark:text-[#9aa0a6]'
                }`}
              >
                {wd.name}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1.5">
            {/* Empty padding cells for first week */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-11 sm:h-16 rounded-lg sm:rounded-xl bg-slate-50/50 dark:bg-[#1f2022]/30 border border-transparent"
              />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayCards = getCardsForDay(dayNum);
              const hasCards = dayCards.length > 0;
              const isTodayCell =
                isTodayMonth && today.getDate() === dayNum;
              const isSelectedCell = selectedDay === dayNum;

              const dayOfWeek = (firstDayOfWeek + i) % 7;
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`relative h-11 sm:h-16 p-1 sm:p-1.5 rounded-lg sm:rounded-xl flex flex-col justify-between items-start transition-all border text-left cursor-pointer overflow-hidden ${
                    isSelectedCell
                      ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/80 dark:bg-blue-600/20'
                      : isTodayCell
                      ? 'border-blue-400 bg-blue-50/40 dark:bg-blue-900/20'
                      : hasCards
                      ? 'bg-amber-50/50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 hover:border-amber-400'
                      : 'bg-white dark:bg-[#202124] border-slate-200 dark:border-[#3c4043] hover:bg-slate-50 dark:hover:bg-[#282a2d]'
                  }`}
                >
                  {/* Top row inside day cell: Day Number + Count Badge */}
                  <div className="w-full flex items-center justify-between leading-none">
                    <span
                      className={`text-[11px] sm:text-sm font-bold font-mono ${
                        isTodayCell
                          ? 'w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] sm:text-xs shadow-2xs'
                          : isSunday
                          ? 'text-rose-500'
                          : isSaturday
                          ? 'text-blue-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {hasCards && (
                      <span className="text-[8px] sm:text-[10px] font-extrabold px-1 sm:px-1.5 py-0.5 rounded bg-amber-500 text-white shadow-2xs leading-none">
                        {dayCards.length}<span className="hidden sm:inline">件</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom row inside day cell: Card Color Indicators */}
                  {hasCards && (
                    <div className="w-full flex flex-wrap gap-0.5 sm:gap-1 mt-auto pt-0.5">
                      {dayCards.slice(0, 3).map((c) => {
                        const cfg = getBrandColorConfig(c.brandColor, true);
                        return (
                          <span
                            key={c.id}
                            className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 shadow-2xs border border-white/40"
                            style={{ backgroundColor: cfg.hex }}
                            title={c.name}
                          />
                        );
                      })}
                      {dayCards.length > 3 && (
                        <span className="text-[7px] sm:text-[9px] font-bold text-slate-500 dark:text-[#9aa0a6]">
                          +{dayCards.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Details Section */}
          <div className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#3c4043] bg-slate-50 dark:bg-[#171717] p-3 sm:p-4 space-y-2.5 sm:space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#3c4043] pb-2 sm:pb-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                  {month + 1}月{selectedDay ?? '--'}日 の引き落とし詳細
                </h3>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-[#9aa0a6]">
                {selectedDayCards.length} 件の対象
              </span>
            </div>

            {selectedDayCards.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-[#9aa0a6] py-2.5 text-center">
                この日に引き落とし予定のカードはありません。
              </p>
            ) : (
              <div className="space-y-2">
                {selectedDayCards.map((card) => {
                  const linkedAccount = getBankAccount(accounts, card.bankAccountId);
                  const brandCfg = getBrandColorConfig(card.brandColor, true);

                  return (
                    <div
                      key={card.id}
                      className="p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-[#3c4043] bg-white dark:bg-[#202124] flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Brand color dot */}
                        <span
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20 shadow-xs"
                          style={{ backgroundColor: brandCfg.hex }}
                        />

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              {card.name}
                            </span>
                            {card.closingDay && (
                              <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#303134] text-slate-600 dark:text-[#9aa0a6]">
                                {card.closingDay}
                              </span>
                            )}
                          </div>
                          {card.memo && (
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#9aa0a6] mt-0.5">
                              {card.memo}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Linked Account Badge */}
                      <div className="shrink-0 self-start sm:self-auto">
                        {linkedAccount ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold border shadow-xs"
                            style={{
                              backgroundColor: '#202124',
                              borderColor: linkedAccount.color || '#3c4043',
                              color: '#ffffff',
                            }}
                          >
                            <Landmark className="h-3 w-3 text-emerald-400" />
                            <span>{linkedAccount.name}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] sm:text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-rose-200 dark:border-rose-500/20">
                            口座未登録
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 border-t border-slate-200 dark:border-[#3c4043] bg-slate-50 dark:bg-[#171717] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-slate-200 dark:bg-[#303134] hover:bg-slate-300 dark:hover:bg-[#3c4043] text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
