import React, { useState } from 'react';
import { CreditCard, BankAccount } from '../types';
import { getBankAccount } from '../utils/paymentUtils';
import { getBrandColorConfig } from '../utils/colors';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Landmark,
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

  const getCardsForDay = (dayNum: number): CreditCard[] => {
    return cards.filter((card) => {
      if (card.paymentDayType === 'end_of_month') {
        return dayNum === daysInMonth;
      }
      return (card.paymentDayValue ?? 1) === dayNum;
    });
  };

  const selectedDayCards = selectedDay ? getCardsForDay(selectedDay) : [];

  const isTodayMonth =
    today.getFullYear() === year && today.getMonth() === month;

  const handleSelectDay = (dayNum: number) => {
    setSelectedDay(dayNum);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative z-10 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-lg shadow-xl overflow-hidden transition-all text-[#101828] dark:text-[#f0f2f5] animate-scaleIn">
        
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[#d0d5dd] dark:border-[#2e3642] bg-[#f4f6f8] dark:bg-[#222730]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#0047AB] dark:text-[#5294e2]" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                支払日カレンダー
              </h2>
              <p className="text-[10px] text-[#475467] dark:text-[#98a2b3]">
                月別のクレジットカード引き落とし予定
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#667085] hover:text-[#101828] dark:hover:text-white hover:bg-[#eaecf0] dark:hover:bg-[#2c333f]"
            title="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* 月移動バー */}
          <div className="flex items-center justify-between bg-[#f4f6f8] dark:bg-[#222730] p-2 rounded-md border border-[#d0d5dd] dark:border-[#363f4e]">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-md hover:bg-white dark:hover:bg-[#1a1f26] border border-transparent hover:border-[#d0d5dd] text-[#344054] dark:text-[#cfd5e0] transition-colors"
              title="前月"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold font-mono text-[#101828] dark:text-white">
                {year}年 {month + 1}月
              </span>
              {!isTodayMonth && (
                <button
                  onClick={handleCurrentMonth}
                  className="px-2 py-0.5 text-xs font-bold rounded-xs bg-[#0047AB] text-white hover:bg-[#003882] transition-colors shadow-xs"
                >
                  今月へ
                </button>
              )}
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-md hover:bg-white dark:hover:bg-[#1a1f26] border border-transparent hover:border-[#d0d5dd] text-[#344054] dark:text-[#cfd5e0] transition-colors"
              title="翌月"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold py-1 border-b border-[#d0d5dd] dark:border-[#2e3642]">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd.name}
                className={wd.isSunday ? 'text-[#d92d20]' : wd.isSaturday ? 'text-[#0047AB] dark:text-[#5294e2]' : 'text-[#475467] dark:text-[#98a2b3]'}
              >
                {wd.name}
              </div>
            ))}
          </div>

          {/* カレンダーグリッド */}
          <div className="grid grid-cols-7 gap-1">
            {/* 前月余白 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12 sm:h-14 rounded-xs bg-[#f4f6f8]/40 dark:bg-[#12151a]/40" />
            ))}

            {/* 日付セル */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayCards = getCardsForDay(dayNum);
              const hasCards = dayCards.length > 0;
              const isTodayCell = isTodayMonth && today.getDate() === dayNum;
              const isSelectedCell = selectedDay === dayNum;

              const dayOfWeek = (firstDayOfWeek + i) % 7;
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;

              return (
                <button
                  key={`day-${dayNum}`}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-12 sm:h-14 p-1 rounded-xs flex flex-col justify-between items-start transition-all border text-left cursor-pointer ${
                    isSelectedCell
                      ? 'border-[#0047AB] bg-[#0047AB]/10 ring-1 ring-[#0047AB]'
                      : isTodayCell
                      ? 'border-[#0047AB]/50 bg-[#0047AB]/5'
                      : hasCards
                      ? 'bg-[#b54708]/5 border-[#b54708]/30 hover:border-[#0047AB]'
                      : 'bg-white dark:bg-[#1a1f26] border-[#d0d5dd]/70 dark:border-[#2e3642] hover:bg-[#f4f6f8] dark:hover:bg-[#222730]'
                  }`}
                >
                  <div className="w-full flex items-center justify-between leading-none">
                    <span
                      className={`text-xs font-bold font-mono ${
                        isTodayCell
                          ? 'w-5 h-5 rounded-full bg-[#0047AB] text-white flex items-center justify-center text-[10px]'
                          : isSunday
                          ? 'text-[#d92d20]'
                          : isSaturday
                          ? 'text-[#0047AB] dark:text-[#5294e2]'
                          : 'text-[#101828] dark:text-white'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {hasCards && (
                      <span className="text-[9px] font-bold px-1 rounded-xs bg-[#b54708] text-white">
                        {dayCards.length}
                      </span>
                    )}
                  </div>

                  {hasCards && (
                    <div className="w-full flex flex-wrap gap-0.5 mt-auto">
                      {dayCards.slice(0, 3).map((c) => {
                        const cfg = getBrandColorConfig(c.brandColor, true);
                        return (
                          <span
                            key={c.id}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: cfg.hex || '#0047AB' }}
                            title={c.name}
                          />
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* 選択した日の詳細エリア */}
          <div className="rounded-md border border-[#d0d5dd] dark:border-[#2e3642] bg-[#f4f6f8] dark:bg-[#222730] p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-[#d0d5dd] dark:border-[#2e3642] pb-1.5">
              <span className="text-xs font-bold text-[#101828] dark:text-white">
                {month + 1}月{selectedDay ?? '--'}日 の引き落とし対象
              </span>
              <span className="text-xs text-[#475467] dark:text-[#98a2b3]">
                {selectedDayCards.length} 件
              </span>
            </div>

            {selectedDayCards.length === 0 ? (
              <p className="text-xs text-[#667085] dark:text-[#8e98a8] py-2 text-center">
                この日に引き落とし予定のカードはありません。
              </p>
            ) : (
              <div className="space-y-1.5">
                {selectedDayCards.map((card) => {
                  const linkedAccount = getBankAccount(accounts, card.bankAccountId);
                  const brandCfg = getBrandColorConfig(card.brandColor, true);

                  return (
                    <div
                      key={card.id}
                      className="p-2 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] bg-white dark:bg-[#1a1f26] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: brandCfg.hex || '#0047AB' }}
                        />
                        <span className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
                          {card.name}
                        </span>
                      </div>

                      <div className="shrink-0 text-xs text-[#475467] dark:text-[#98a2b3]">
                        {linkedAccount ? (
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Landmark className="h-3 w-3 text-[#0047AB] dark:text-[#5294e2]" />
                            <span>{linkedAccount.name}</span>
                          </span>
                        ) : (
                          <span className="text-[#d92d20] font-bold">口座未設定</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="px-4 py-2.5 border-t border-[#d0d5dd] dark:border-[#2e3642] bg-[#f4f6f8] dark:bg-[#222730] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-bold text-[#344054] dark:text-[#cfd5e0] hover:bg-white dark:hover:bg-[#1a1f26]"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
