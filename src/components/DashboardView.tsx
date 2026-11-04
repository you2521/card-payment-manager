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
  Plus,
  ArrowRight,
  AlertCircle,
  CreditCard as CardIcon
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
          color: '#d92d20',
          note: '引き落とし口座が未設定または削除されたカードです',
        },
        cards: sortCardsByPaymentDay(unassignedCards),
      });
    }

    return result;
  }, [accounts, cards]);

  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false;

  // データが0件の場合のEmpty State（初めて使う方向けのステップ案内）
  if (cards.length === 0 && accounts.length === 0) {
    return (
      <div className="space-y-6 py-4 animate-fadeIn">
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-lg p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-lg bg-[#0047AB]/10 text-[#0047AB] dark:bg-[#5294e2]/20 dark:text-[#5294e2] flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-[#101828] dark:text-white">
              管理をはじめましょう
            </h2>
            <p className="text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3]">
              登録したデータはお使いの端末（ブラウザ）にのみ安全に保存されます。まずは引き落とし口座を登録してみましょう。
            </p>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            <button
              onClick={onOpenAddAccount}
              className="flex items-center justify-between p-4 rounded-md border-2 border-[#0047AB] bg-[#0047AB] hover:bg-[#003882] text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <Landmark className="h-5 w-5 shrink-0" />
                <div>
                  <div className="text-[10px] text-blue-200">ステップ 1</div>
                  <div>銀行口座を登録</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenAddCard}
              className="flex items-center justify-between p-4 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] bg-white dark:bg-[#222730] hover:bg-[#f4f6f8] dark:hover:bg-[#2c333f] text-[#101828] dark:text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <CardIcon className="h-5 w-5 shrink-0 text-[#0047AB] dark:text-[#5294e2]" />
                <div>
                  <div className="text-[10px] text-[#667085] dark:text-[#8e98a8]">ステップ 2</div>
                  <div>カードを登録</div>
                </div>
              </div>
              <Plus className="h-4 w-4 text-[#667085]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. 直近の引き落とし情報（DADS基準のコールアウトパネル） */}
      {upcomingCardInfo ? (
        <section 
          aria-label="直近の引き落とし予定"
          className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 sm:p-5 shadow-xs relative overflow-hidden border-l-4"
          style={{
            borderLeftColor: getBrandColorConfig(upcomingCardInfo.card.brandColor, isDark).hex || '#0047AB',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0047AB]/10 text-[#0047AB] dark:bg-[#5294e2]/20 dark:text-[#5294e2] px-2 py-0.5 rounded-xs">
                  次回引き落とし予定
                </span>
                <span className="text-xs text-[#475467] dark:text-[#98a2b3]">
                  {upcomingCardInfo.info.nextDateFormatted}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => onEditCard(upcomingCardInfo.card)}
                  className="text-base sm:text-lg font-bold text-[#101828] dark:text-white hover:text-[#0047AB] dark:hover:text-[#5294e2] hover:underline cursor-pointer text-left"
                  title={`${upcomingCardInfo.card.name} を編集`}
                >
                  {upcomingCardInfo.card.name}
                </button>
                <span className="text-xs px-2 py-0.5 rounded-xs bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] font-mono font-bold text-[#344054] dark:text-[#cfd5e0]">
                  {formatPaymentDay(upcomingCardInfo.card, true)}
                </span>
              </div>

              <div className="text-xs text-[#475467] dark:text-[#98a2b3] flex items-center gap-1.5 pt-0.5">
                <Landmark className="h-3.5 w-3.5 shrink-0" />
                <span>引き落とし口座:</span>
                {(() => {
                  const acc = getBankAccount(accounts, upcomingCardInfo.card.bankAccountId);
                  if (!acc) return <span className="text-[#d92d20] font-bold">未登録</span>;
                  return (
                    <button
                      type="button"
                      onClick={() => onEditAccount(acc)}
                      className="font-bold text-[#101828] dark:text-white hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: acc.color || '#0047AB' }} />
                      <span>{acc.name}</span>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* カウントダウン表示（DADSスタイルの太枠バッジ） */}
            <div className="flex items-center justify-between sm:flex-col sm:items-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#d0d5dd] dark:border-[#2e3642]">
              <div className={`px-3.5 py-1.5 rounded-md font-bold text-center ${
                upcomingCardInfo.info.isToday
                  ? 'bg-[#d92d20] text-white'
                  : upcomingCardInfo.info.isTomorrow
                  ? 'bg-[#b54708] text-white'
                  : 'bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] text-[#101828] dark:text-white'
              }`}>
                {upcomingCardInfo.info.isToday ? (
                  <span>本日引き落とし日</span>
                ) : upcomingCardInfo.info.isTomorrow ? (
                  <span>明日引き落とし日</span>
                ) : (
                  <div className="text-xs sm:text-sm">
                    残り <span className="text-base sm:text-lg font-black text-[#0047AB] dark:text-[#5294e2] font-mono">{upcomingCardInfo.info.daysLeft}</span> 日
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-lg p-4 flex items-center justify-between">
          <p className="text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3]">クレジットカードが未登録です。</p>
          <button
            onClick={onOpenAddCard}
            className="px-3 py-1.5 rounded-md bg-[#0047AB] hover:bg-[#003882] text-white text-xs font-bold transition-all shadow-xs"
          >
            カードを追加
          </button>
        </div>
      )}

      {/* 2. 表示切り替えコントロールバー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1a1f26] p-2.5 sm:p-3 rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] shadow-xs">
        {/* グループ切り替えボタン */}
        <div className="flex items-center rounded-md bg-[#f4f6f8] dark:bg-[#222730] p-1 border border-[#d0d5dd] dark:border-[#363f4e] text-xs">
          <button
            onClick={() => setViewGroupMode('date_sort')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm font-bold transition-all cursor-pointer flex-1 sm:flex-none ${
              viewGroupMode === 'date_sort'
                ? 'bg-white dark:bg-[#1a1f26] text-[#0047AB] dark:text-[#5294e2] shadow-xs'
                : 'text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-white'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>支払日順</span>
          </button>
          <button
            onClick={() => setViewGroupMode('bank_group')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm font-bold transition-all cursor-pointer flex-1 sm:flex-none ${
              viewGroupMode === 'bank_group'
                ? 'bg-white dark:bg-[#1a1f26] text-[#0047AB] dark:text-[#5294e2] shadow-xs'
                : 'text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-white'
            }`}
          >
            <Landmark className="h-3.5 w-3.5" />
            <span>口座別</span>
          </button>
        </div>

        {/* 右側アクション：詳細トグル & 新規追加 */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={showDetails}
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold border border-[#d0d5dd] dark:border-[#363f4e] bg-[#f4f6f8] dark:bg-[#222730] text-[#344054] dark:text-[#cfd5e0] hover:bg-[#eaecf0] dark:hover:bg-[#2c333f] cursor-pointer"
          >
            <span>詳細表示</span>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${showDetails ? 'bg-[#0047AB]' : 'bg-[#d0d5dd] dark:bg-[#475467]'}`}>
              <div className={`w-3 h-3 rounded-full bg-white shadow-xs transition-transform duration-200 ${showDetails ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          <button
            onClick={onOpenAddCard}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#0047AB] hover:bg-[#003882] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>カード追加</span>
          </button>
        </div>
      </div>

      {/* 3. メイン一覧 */}
      {viewGroupMode === 'date_sort' ? (
        /* 支払日順 */
        <div className="space-y-3">
          {sortedCards.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#d0d5dd] dark:border-[#363f4e] bg-[#f4f6f8] dark:bg-[#1a1f26] p-8 text-center space-y-2">
              <p className="text-sm font-bold text-[#101828] dark:text-white">登録されたカードがありません</p>
              <button
                onClick={onOpenAddCard}
                className="px-4 py-2 rounded-md bg-[#0047AB] hover:bg-[#003882] text-white text-xs font-bold"
              >
                最初のクレジットカードを登録する
              </button>
            </div>
          ) : !showDetails ? (
            /* コンパクト一覧（支払日グループ別） */
            <div className="space-y-3">
              {groupedCardsByDate.map((group) => (
                <div
                  key={group.label}
                  className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] overflow-hidden shadow-xs"
                >
                  <div className="px-4 py-2 bg-[#f4f6f8] dark:bg-[#222730] border-b border-[#d0d5dd] dark:border-[#2e3642] flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#0047AB] dark:text-[#5294e2]" />
                      {group.label} 引き落とし
                    </span>
                    <span className="text-xs font-bold text-[#475467] dark:text-[#98a2b3]">
                      {group.cards.length} 件
                    </span>
                  </div>

                  <div className="divide-y divide-[#d0d5dd]/50 dark:divide-[#2e3642]">
                    {group.cards.map((card) => {
                      const linkedAccount = getBankAccount(accounts, card.bankAccountId);
                      const brandCfg = getBrandColorConfig(card.brandColor, isDark);

                      return (
                        <div
                          key={card.id}
                          className="flex items-center justify-between px-4 py-3 hover:bg-[#f9fafb] dark:hover:bg-[#222730]/50 transition-colors gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: brandCfg.hex || '#0047AB' }}
                            />
                            <button
                              type="button"
                              onClick={() => onEditCard(card)}
                              className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white truncate hover:text-[#0047AB] dark:hover:text-[#5294e2] hover:underline cursor-pointer text-left"
                            >
                              {card.name}
                            </button>
                          </div>

                          <div className="shrink-0 text-right">
                            {linkedAccount ? (
                              <button
                                type="button"
                                onClick={() => onEditAccount(linkedAccount)}
                                className="inline-flex items-center gap-1 text-xs text-[#344054] dark:text-[#cfd5e0] hover:underline cursor-pointer font-medium"
                              >
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: linkedAccount.color || '#0047AB' }}
                                />
                                <span>{linkedAccount.name}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#d92d20] font-bold">
                                口座未設定
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
            /* 詳細一覧 */
            <div className="grid grid-cols-1 gap-2.5">
              {sortedCards.map((card) => {
                const linkedAccount = getBankAccount(accounts, card.bankAccountId);
                const paymentInfo = getDaysUntilNextPayment(card);
                const brandCfg = getBrandColorConfig(card.brandColor, isDark);

                return (
                  <div
                    key={card.id}
                    className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-3 sm:p-4 shadow-xs border-l-4"
                    style={{
                      borderLeftColor: brandCfg.hex || '#0047AB',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 rounded-md bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] font-bold">
                          <span className="text-[8px] text-[#667085] dark:text-[#8e98a8]">毎月</span>
                          <span className="text-sm sm:text-base font-mono font-bold text-[#101828] dark:text-white">
                            {formatPaymentDay(card)}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => onEditCard(card)}
                              className="text-sm sm:text-base font-bold text-[#101828] dark:text-white hover:text-[#0047AB] dark:hover:text-[#5294e2] hover:underline cursor-pointer text-left"
                            >
                              {card.name}
                            </button>
                            {card.closingDay && (
                              <span className="text-[10px] text-[#475467] dark:text-[#98a2b3] bg-[#f4f6f8] dark:bg-[#222730] px-1.5 py-0.5 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e]">
                                {card.closingDay}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-[#475467] dark:text-[#98a2b3]">
                            <span>口座:</span>
                            {linkedAccount ? (
                              <button
                                type="button"
                                onClick={() => onEditAccount(linkedAccount)}
                                className="font-bold text-[#101828] dark:text-white hover:underline cursor-pointer inline-flex items-center gap-1"
                              >
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: linkedAccount.color || '#0047AB' }} />
                                <span>{linkedAccount.name}</span>
                              </button>
                            ) : (
                              <span className="text-[#d92d20] font-bold">口座未設定</span>
                            )}
                          </div>

                          {card.memo && (
                            <p className="text-[11px] text-[#667085] dark:text-[#8e98a8]">{card.memo}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#d0d5dd]/40 dark:border-[#2e3642]">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-xs font-mono ${
                          paymentInfo.isToday
                            ? 'bg-[#d92d20] text-white'
                            : paymentInfo.daysLeft <= 5
                            ? 'bg-[#b54708]/15 text-[#b54708] border border-[#b54708]/30'
                            : 'bg-[#f4f6f8] dark:bg-[#222730] text-[#344054] dark:text-[#cfd5e0] border border-[#d0d5dd] dark:border-[#363f4e]'
                        }`}>
                          {paymentInfo.isToday ? '本日' : paymentInfo.isTomorrow ? '明日' : `あと ${paymentInfo.daysLeft} 日`}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditCard(card)}
                            className="p-1.5 rounded-md hover:bg-[#f4f6f8] dark:hover:bg-[#222730] text-[#667085] hover:text-[#0047AB] dark:text-[#8e98a8] dark:hover:text-[#5294e2]"
                            title="編集"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteCard(card.id)}
                            className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 text-[#667085] hover:text-[#d92d20] dark:text-[#8e98a8] dark:hover:text-[#d92d20]"
                            title="削除"
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
        /* 口座別表示 */
        <div className="space-y-3">
          {cardsByAccount.map(({ account, cards: accCards }) => (
            <div
              key={account.id}
              className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] overflow-hidden shadow-xs border-l-4"
              style={{
                borderLeftColor: account.color || '#0047AB',
              }}
            >
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#f4f6f8] dark:bg-[#222730] border-b border-[#d0d5dd] dark:border-[#2e3642]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: account.color || '#0047AB' }} />
                  {account.id === '__unassigned__' ? (
                    <span className="text-xs sm:text-sm font-bold text-[#d92d20] flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{account.name}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onEditAccount(account)}
                      className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white hover:text-[#0047AB] dark:hover:text-[#5294e2] hover:underline cursor-pointer text-left"
                    >
                      {account.name}
                    </button>
                  )}
                </div>
                <span className="text-xs font-bold text-[#475467] dark:text-[#98a2b3]">
                  {accCards.length} 枚
                </span>
              </div>

              <div className="p-3 space-y-2">
                {accCards.length === 0 ? (
                  <p className="text-xs text-[#667085] dark:text-[#8e98a8] py-2 text-center">
                    この口座に紐づいているカードはありません。
                  </p>
                ) : (
                  accCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between p-2.5 rounded-md bg-[#fcfcfd] dark:bg-[#20252e] border border-[#d0d5dd]/60 dark:border-[#2e3642]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-xs bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#363f4e]">
                          {formatPaymentDay(card)}
                        </span>
                        <div>
                          <button
                            type="button"
                            onClick={() => onEditCard(card)}
                            className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white hover:text-[#0047AB] dark:hover:text-[#5294e2] hover:underline cursor-pointer text-left"
                          >
                            {card.name}
                          </button>
                          {card.closingDay && (
                            <p className="text-[10px] text-[#667085] dark:text-[#8e98a8]">{card.closingDay}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditCard(card)}
                          className="p-1 rounded-md text-[#667085] hover:text-[#0047AB]"
                          title="編集"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCard(card.id)}
                          className="p-1 rounded-md text-[#667085] hover:text-[#d92d20]"
                          title="削除"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
