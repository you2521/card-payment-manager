import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  BankAccount
} from '../types';
import {
  sortCardsByPaymentDay,
  formatPaymentDay,
  getDaysUntilNextPayment,
  getBankAccount
} from '../utils/paymentUtils';
import { getBrandColorConfig } from '../utils/colors';
import {
  Calendar,
  Pencil,
  Trash2,
  Landmark,
  Sparkles,
  Info
} from 'lucide-react';

interface DashboardViewProps {
  cards: CreditCard[];
  accounts: BankAccount[];
  onEditCard: (card: CreditCard) => void;
  onDeleteCard: (cardId: string) => void;
  onEditAccount: (account: BankAccount) => void;
  onOpenAddCard: () => void;
  onOpenAddAccount: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cards,
  accounts,
  onEditCard,
  onDeleteCard,
  onEditAccount,
  onOpenAddCard,
  onOpenAddAccount,
}) => {
  const [viewGroupMode, setViewGroupMode] = useState<'date_sort' | 'bank_group'>('date_sort');
  const [showDetails, setShowDetails] = useState(false);

  // Cards sorted by payment day (4日 -> 10日 -> 26日 -> 月末)
  const sortedCards = useMemo(() => {
    return sortCardsByPaymentDay(cards);
  }, [cards]);

  // Group cards by payment date for compact mode
  const groupedCardsByDate = useMemo(() => {
    const map = new Map<string, { label: string; dayValue: number; cards: CreditCard[] }>();

    sortedCards.forEach((card) => {
      let key = '';
      let label = '';
      let dayValue = 99;

      if (card.paymentDayType === 'end_of_month') {
        key = 'end_of_month';
        label = '毎月末日';
        dayValue = 32;
      } else {
        const day = card.paymentDayValue || 1;
        key = `day_${day}`;
        label = `毎月 ${day}日`;
        dayValue = day;
      }

      if (!map.has(key)) {
        map.set(key, { label, dayValue, cards: [] });
      }
      map.get(key)!.cards.push(card);
    });

    return Array.from(map.values()).sort((a, b) => a.dayValue - b.dayValue);
  }, [sortedCards]);

  // Calculate next upcoming payment card among all cards
  const upcomingCardInfo = useMemo(() => {
    if (cards.length === 0) return null;
    const cardsWithDays = cards.map((c) => ({
      card: c,
      info: getDaysUntilNextPayment(c),
    }));
    // sort by daysLeft
    cardsWithDays.sort((a, b) => a.info.daysLeft - b.info.daysLeft);
    return cardsWithDays[0];
  }, [cards]);

  // Group cards by bank account
  const cardsByAccount = useMemo(() => {
    const map = new Map<string, CreditCard[]>();
    accounts.forEach((acc) => map.set(acc.id, []));

    const unassignedCards: CreditCard[] = [];

    cards.forEach((card) => {
      if (card.bankAccountId && map.has(card.bankAccountId)) {
        map.get(card.bankAccountId)!.push(card);
      } else {
        unassignedCards.push(card);
      }
    });

    const result = accounts.map((acc) => ({
      account: acc,
      cards: sortCardsByPaymentDay(map.get(acc.id) || []),
    }));

    if (unassignedCards.length > 0) {
      result.push({
        account: {
          id: '__unassigned__',
          name: '口座未設定・未登録',
          color: '#ef4444',
          note: '引き落とし口座が削除された、または未設定のカードです',
        },
        cards: sortCardsByPaymentDay(unassignedCards),
      });
    }

    return result;
  }, [accounts, cards]);

  // Accent color map for card brand badges
  const getBrandBadgeStyle = (brandColor?: string) => {
    switch (brandColor) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'rose':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'amber':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'cyan':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'blue':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'teal':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'orange':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'fuchsia':
        return 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30';
      case 'slate':
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
      case 'gold':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    }
  };

  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Upper Highlight Banner / Stats */}
      <div className="w-full">
        {/* Upcoming Payment Highlight */}
        {upcomingCardInfo ? (
          <div
            className="w-full relative overflow-hidden rounded-2xl border bg-white dark:bg-[#202124] p-3.5 sm:p-4 shadow-sm"
            style={{
              borderColor: getBrandColorConfig(upcomingCardInfo.card.brandColor, isDark).hex,
              borderWidth: '1.5px',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-blue-600 dark:text-blue-400">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-blue-600 dark:text-blue-400" />
                  <span className="uppercase tracking-wider text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300">直近の引き落とし</span>
                  
                  {/* Card Brand Accent Dot */}
                  {(() => {
                    const cfg = getBrandColorConfig(upcomingCardInfo.card.brandColor, isDark);
                    return (
                      <span
                        className="inline-flex items-center justify-center p-1 rounded-full border shadow-sm"
                        style={cfg.badgeStyle}
                        title={cfg.label}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cfg.hex }} />
                      </span>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onEditCard(upcomingCardInfo.card)}
                    className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#e8eaed] hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer text-left flex items-center gap-2"
                    title={`${upcomingCardInfo.card.name} を編集`}
                  >
                    <span>{upcomingCardInfo.card.name}</span>
                  </button>
                  <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#303134] text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-[#3c4043] font-mono font-bold">
                    {formatPaymentDay(upcomingCardInfo.card, true)}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <Landmark className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  {(() => {
                    const acc = getBankAccount(accounts, upcomingCardInfo.card.bankAccountId);
                    if (!acc) return <span className="font-semibold text-rose-600 dark:text-rose-400">口座未登録</span>;
                    return (
                      <button
                        type="button"
                        onClick={() => onEditAccount(acc)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm transition-opacity hover:opacity-80 cursor-pointer"
                        style={{
                          backgroundColor: isDark ? '#2a2d32' : '#f1f5f9',
                          borderColor: acc.color ? acc.color : (isDark ? '#4b5563' : '#cbd5e1'),
                          color: isDark ? '#ffffff' : '#0f172a',
                        }}
                        title={`${acc.name} を編集`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: acc.color || '#3b82f6' }} />
                        <span>{acc.name}</span>
                      </button>
                    );
                  })()}
                </div>
              </div>

              {/* Countdown badge */}
              <div className="flex items-center justify-between sm:flex-col sm:items-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-[#3c4043]">
                <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-50 dark:bg-[#303134] border border-emerald-200 dark:border-[#3c4043] text-left sm:text-right shadow-sm w-full sm:w-auto flex sm:block items-center justify-between">
                  <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {upcomingCardInfo.info.isToday ? (
                      '本日引き落とし！'
                    ) : upcomingCardInfo.info.isTomorrow ? (
                      '明日引き落とし'
                    ) : (
                      <>あと <span className="text-lg sm:text-xl text-emerald-700 dark:text-emerald-300">{upcomingCardInfo.info.daysLeft}</span> 日</>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] p-3 sm:p-4 flex items-center justify-between gap-2 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#e8eaed]">クレジットカードが未登録です</p>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar: View Group Mode Toggle & Detail Toggle */}
      <div className="flex items-center justify-between bg-white dark:bg-[#202124] p-2.5 sm:p-3 rounded-2xl border border-[#dadce0] dark:border-[#3c4043] shadow-sm">
        {/* View Group Mode Toggle: 支払日別 / 口座別 */}
        <div className="flex items-center rounded-full bg-slate-100 dark:bg-[#303134] p-1 border border-slate-200 dark:border-[#3c4043] text-xs">
          <button
            onClick={() => setViewGroupMode('date_sort')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              viewGroupMode === 'date_sort'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-[#9aa0a6] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>支払日別</span>
          </button>
          <button
            onClick={() => setViewGroupMode('bank_group')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              viewGroupMode === 'bank_group'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-[#9aa0a6] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Landmark className="h-3.5 w-3.5" />
            <span>口座別</span>
          </button>
        </div>

        {/* Visual Switch Toggle for Detail Display */}
        <button
          type="button"
          role="switch"
          aria-checked={showDetails}
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all border border-slate-200 dark:border-[#3c4043] bg-slate-100 dark:bg-[#303134] text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-500 shadow-sm cursor-pointer"
        >
          <span>詳細</span>
          <div className={`w-10 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${showDetails ? 'bg-blue-600' : 'bg-slate-300 dark:bg-gray-600'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200 ${showDetails ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>


      {/* Main List Section */}
      {viewGroupMode === 'date_sort' ? (
        /* 1. Date Sorted List (支払日早い順) */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-[#e8eaed] flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              カード一覧
              <span className="text-xs font-normal text-slate-500 dark:text-[#9aa0a6]">
                ({sortedCards.length}件)
              </span>
            </h2>
          </div>

          {sortedCards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-[#3c4043] bg-slate-50 dark:bg-[#202124]/50 p-6 text-center">
              <p className="text-sm text-slate-500 dark:text-[#9aa0a6] font-medium">条件に一致するクレジットカードがありません。</p>
            </div>
          ) : !showDetails ? (
            /* Date-Grouped Compact View */
            <div className="space-y-3">
              {groupedCardsByDate.map((group) => (
                <div
                  key={group.label}
                  className="rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] overflow-hidden shadow-sm"
                >
                  {/* Date Group Header */}
                  <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#171717] border-b border-[#dadce0] dark:border-[#3c4043] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        {group.label} 引き落とし
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-[#303134] text-slate-700 dark:text-[#9aa0a6]">
                      {group.cards.length}枚
                    </span>
                  </div>

                  {/* Cards inside this Date Group */}
                  <div className="divide-y divide-slate-100 dark:divide-[#3c4043]/50">
                    {group.cards.map((card) => {
                      const linkedAccount = getBankAccount(accounts, card.bankAccountId);
                      const brandCfg = getBrandColorConfig(card.brandColor, isDark);

                      return (
                        <div
                          key={card.id}
                          className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/80 dark:hover:bg-[#282a2d] transition-colors gap-3"
                        >
                          {/* Card Name + Brand Color Indicator */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm border border-black/10 dark:border-white/20"
                              style={{ backgroundColor: brandCfg.hex }}
                              title={`カードカラー: ${brandCfg.label}`}
                            />
                            <button
                              type="button"
                              onClick={() => onEditCard(card)}
                              className="text-sm font-bold text-slate-900 dark:text-white truncate hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer text-left"
                              title={`${card.name} を編集`}
                            >
                              {card.name}
                            </button>
                          </div>

                          {/* Linked Bank Account with Account Color */}
                          <div className="shrink-0 text-right">
                            {linkedAccount ? (
                              <button
                                type="button"
                                onClick={() => onEditAccount(linkedAccount)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm transition-opacity hover:opacity-80 cursor-pointer"
                                style={{
                                  backgroundColor: isDark ? '#2a2d32' : '#f8fafc',
                                  borderColor: linkedAccount.color ? linkedAccount.color : (isDark ? '#4b5563' : '#cbd5e1'),
                                  color: isDark ? '#ffffff' : '#0f172a',
                                }}
                                title={`${linkedAccount.name} を編集`}
                              >
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                                  style={{ backgroundColor: linkedAccount.color || '#3b82f6' }}
                                />
                                <span>{linkedAccount.name}</span>
                              </button>
                            ) : (
                              <span className="text-xs text-rose-500 font-semibold bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-500/20">
                                口座未登録
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Full Detailed View */
            <div className="grid grid-cols-1 gap-2.5">
              {sortedCards.map((card) => {
                const linkedAccount = getBankAccount(accounts, card.bankAccountId);
                const paymentInfo = getDaysUntilNextPayment(card);
                const brandCfg = getBrandColorConfig(card.brandColor, isDark);

                return (
                  <div
                    key={card.id}
                    className="group relative rounded-2xl border bg-white dark:bg-[#202124] hover:bg-slate-50 dark:hover:bg-[#282a2d] p-2.5 sm:p-3.5 transition-all shadow-sm overflow-hidden"
                    style={{
                      borderColor: brandCfg.hex,
                      borderWidth: '1.5px',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                      {/* Left Block: Payment Day Pill + Card Details */}
                      <div className="flex items-center gap-3">
                        {/* Payment Day Badge */}
                        <div
                          className="flex flex-col items-center justify-center shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl border font-bold"
                          style={{
                            backgroundColor: `${brandCfg.hex}18`,
                            borderColor: `${brandCfg.hex}50`,
                            color: brandCfg.hex,
                          }}
                        >
                          <span className="text-[8px] font-bold tracking-wider text-slate-500 dark:text-[#9aa0a6] uppercase">
                            毎月
                          </span>
                          <span className="text-base sm:text-lg font-mono font-bold tracking-tight">
                            {formatPaymentDay(card)}
                          </span>
                        </div>

                        {/* Card Info */}
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onEditCard(card)}
                              className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-left cursor-pointer hover:underline"
                              title={`${card.name} を編集`}
                            >
                              {card.name}
                            </button>

                            {/* Brand Color Tag (Dot only) */}
                            <span
                              className="inline-flex items-center justify-center p-1 rounded-full border shadow-sm shrink-0"
                              style={brandCfg.badgeStyle}
                              title={brandCfg.label}
                            >
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: brandCfg.hex }} />
                            </span>

                            {/* Closing Day Tag if available */}
                            {card.closingDay && (
                              <span className="text-[10px] text-slate-600 dark:text-[#9aa0a6] bg-slate-100 dark:bg-[#303134] px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-[#3c4043]">
                                {card.closingDay}
                              </span>
                            )}
                          </div>

                          {/* Linked Bank Account Display (High Contrast) */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {linkedAccount ? (
                              <button
                                type="button"
                                onClick={() => onEditAccount(linkedAccount)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm transition-opacity hover:opacity-80 cursor-pointer"
                                style={{
                                  backgroundColor: isDark ? '#2a2d32' : '#f1f5f9',
                                  borderColor: linkedAccount.color ? linkedAccount.color : (isDark ? '#4b5563' : '#cbd5e1'),
                                  color: isDark ? '#ffffff' : '#0f172a',
                                }}
                                title={`${linkedAccount.name} を編集`}
                              >
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                                  style={{ backgroundColor: linkedAccount.color || '#3b82f6' }}
                                />
                                <span>{linkedAccount.name}</span>
                              </button>
                            ) : (
                              <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-500/20">
                                口座未登録
                              </span>
                            )}
                          </div>

                          {/* Optional Memo */}
                          {card.memo && (
                            <p className="text-[11px] text-slate-500 dark:text-gray-400 flex items-center gap-1 pt-0.5">
                              <Info className="h-3 w-3 text-slate-400 dark:text-gray-500 shrink-0" />
                              <span className="truncate max-w-md">{card.memo}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Block: Days Left Badge & Edit/Delete Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-gray-800/80">
                        {/* Next Payment Countdown Pill */}
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-lg inline-block font-mono ${
                              paymentInfo.isToday
                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 animate-pulse'
                                : paymentInfo.daysLeft <= 5
                                ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                                : 'bg-slate-100 dark:bg-[#0a0c10] text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-800'
                            }`}
                          >
                            {paymentInfo.isToday
                              ? '本日引き落とし'
                              : paymentInfo.isTomorrow
                              ? '明日引き落とし'
                              : `あと ${paymentInfo.daysLeft} 日`}
                          </span>
                        </div>

                        {/* Edit / Delete Buttons */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => onEditCard(card)}
                            title="編集"
                            className="p-1.5 rounded-full hover:bg-blue-500/10 text-slate-400 dark:text-[#9aa0a6] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteCard(card.id)}
                            title="削除"
                            className="p-1.5 rounded-full hover:bg-rose-500/10 text-slate-400 dark:text-[#9aa0a6] hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* 2. Grouped by Bank Account (口座別表示) */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-2">
              <Landmark className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              引き落とし口座別のカード一覧
            </h2>
          </div>

          <div className="space-y-3">
            {cardsByAccount.map(({ account, cards: accCards }) => (
              <div
                key={account.id}
                className="rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] overflow-hidden shadow-sm"
              >
                {/* Bank Header */}
                <div
                  className="flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-[#dadce0] dark:border-[#3c4043] border-l-4"
                  style={{
                    backgroundColor: account.color ? `${account.color}15` : (isDark ? '#202124' : '#f8f9fa'),
                    borderLeftColor: account.color || '#3b82f6',
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div
                      className="p-1.5 sm:p-2 rounded-xl text-white shadow-sm shrink-0 flex items-center justify-center font-bold"
                      style={{ backgroundColor: account.color || '#3b82f6' }}
                    >
                      <Landmark className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <div>
                      {account.id === '__unassigned__' ? (
                        <span className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400">
                          {account.name}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onEditAccount(account)}
                          className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer text-left flex items-center gap-1.5"
                          title={`${account.name} を編集`}
                        >
                          <span>{account.name}</span>
                          <Pencil className="h-3 w-3 text-slate-400 opacity-60" />
                        </button>
                      )}
                      {account.note && (
                        <p className="text-[10px] text-slate-500 dark:text-[#9aa0a6]">{account.note}</p>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-700 dark:text-[#e8eaed] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#303134] border border-slate-200 dark:border-[#3c4043] font-mono">
                    {accCards.length} Cards
                  </span>
                </div>

                {/* Cards under this Bank Account */}
                <div className="p-2.5 sm:p-3 space-y-2">
                  {accCards.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-[#9aa0a6] py-2 text-center">
                      この口座に紐づいているカードはありません。
                    </p>
                  ) : (
                    accCards.map((card) => {
                      const brandCfg = getBrandColorConfig(card.brandColor, isDark);
                      return (
                        <div
                          key={card.id}
                          className="relative overflow-hidden flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#171717] border hover:border-blue-500/40 transition-colors"
                          style={{
                            borderColor: brandCfg.hex,
                            borderWidth: '1.5px',
                          }}
                        >

                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <span
                              className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg border shrink-0"
                              style={{
                                backgroundColor: `${brandCfg.hex}18`,
                                borderColor: `${brandCfg.hex}45`,
                                color: brandCfg.hex,
                              }}
                            >
                              {formatPaymentDay(card)}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => onEditCard(card)}
                                  className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer text-left"
                                  title={`${card.name} を編集`}
                                >
                                  {card.name}
                                </button>
                                <span
                                  className="inline-flex items-center justify-center p-1 rounded-full border shrink-0 shadow-sm"
                                  style={brandCfg.badgeStyle}
                                  title={brandCfg.label}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: brandCfg.hex }} />
                                </span>
                              </div>
                              {card.closingDay && (
                                <p className="text-[10px] text-slate-500 dark:text-[#9aa0a6]">{card.closingDay}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onEditCard(card)}
                              title="編集"
                              className="p-1.5 rounded-full hover:bg-blue-500/10 text-slate-400 dark:text-[#9aa0a6] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDeleteCard(card.id)}
                              title="削除"
                              className="p-1.5 rounded-full hover:bg-rose-500/10 text-slate-400 dark:text-[#9aa0a6] hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
