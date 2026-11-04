import React, { useMemo } from 'react';
import { CreditCard, BankAccount, ActiveTab } from '../types';
import {
  formatPaymentDay,
  getDaysUntilNextPayment,
  getBankAccount,
} from '../utils/paymentUtils';
import { getBrandColorConfig } from '../utils/colors';
import {
  Calendar,
  Landmark,
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  CreditCard as CardIcon,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  cards: CreditCard[];
  accounts: BankAccount[];
  adjustForBankHolidays?: boolean;
  onEditCard: (card: CreditCard) => void;
  onDeleteCard: (cardId: string) => void;
  onEditAccount: (account: BankAccount) => void;
  onOpenAddCard: () => void;
  onOpenAddAccount: () => void;
  onNavigateToTab?: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cards,
  accounts,
  adjustForBankHolidays = true,
  onEditCard,
  onEditAccount,
  onOpenAddCard,
  onOpenAddAccount,
  onNavigateToTab,
}) => {
  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false;

  // 1. 全カードの次回引き落とし予定を計算し、直近（日数順）で安定ソート
  const cardsWithSchedule = useMemo(() => {
    return cards
      .map((card) => ({
        card,
        info: getDaysUntilNextPayment(card, new Date(), adjustForBankHolidays),
      }))
      .sort((a, b) => {
        if (a.info.daysLeft !== b.info.daysLeft) {
          return a.info.daysLeft - b.info.daysLeft;
        }
        return a.card.name.localeCompare(b.card.name, 'ja');
      });
  }, [cards, adjustForBankHolidays]);

  // 2. 直近（最も早い支払日）の引き落としグループ（同日複数カードを網羅）
  const upcomingGroup = useMemo(() => {
    if (cardsWithSchedule.length === 0) return null;
    const minDaysLeft = cardsWithSchedule[0].info.daysLeft;
    const items = cardsWithSchedule.filter((c) => c.info.daysLeft === minDaysLeft);
    const first = items[0];

    return {
      daysLeft: minDaysLeft,
      nextDateWithWeekday: first.info.nextDateWithWeekday,
      isToday: first.info.isToday,
      isTomorrow: first.info.isTomorrow,
      isAdjusted: items.some((m) => m.info.isAdjusted),
      adjustmentReason: items.find((m) => m.info.isAdjusted)?.info.adjustmentReason,
      items,
    };
  }, [cardsWithSchedule]);

  // 3. 次回以降（直近グループの次）の引き落としスケジュールを時系列（タイムライン）で集約
  const futureScheduleGroups = useMemo(() => {
    if (!upcomingGroup) return [];
    const futureCards = cardsWithSchedule.filter((c) => c.info.daysLeft > upcomingGroup.daysLeft);

    const map = new Map<
      number,
      {
        daysLeft: number;
        nextDateWithWeekday: string;
        isAdjusted: boolean;
        adjustmentReason?: string;
        items: typeof futureCards;
      }
    >();

    futureCards.forEach((item) => {
      if (!map.has(item.info.daysLeft)) {
        map.set(item.info.daysLeft, {
          daysLeft: item.info.daysLeft,
          nextDateWithWeekday: item.info.nextDateWithWeekday,
          isAdjusted: item.info.isAdjusted,
          adjustmentReason: item.info.adjustmentReason,
          items: [],
        });
      }
      const g = map.get(item.info.daysLeft)!;
      g.items.push(item);
      if (item.info.isAdjusted) {
        g.isAdjusted = true;
        g.adjustmentReason = item.info.adjustmentReason;
      }
    });

    return Array.from(map.values()).sort((a, b) => a.daysLeft - b.daysLeft);
  }, [cardsWithSchedule, upcomingGroup]);

  // 4. 口座ごとの状況サマリー（紐づくカード数・直近の引き落とし予定）
  const accountSummaries = useMemo(() => {
    return accounts.map((account) => {
      const linkedCards = cards.filter((c) => c.bankAccountId === account.id);
      const linkedWithSchedule = cardsWithSchedule.filter((c) => c.card.bankAccountId === account.id);
      const nextPayment = linkedWithSchedule[0]; // 最も直近のもの

      return {
        account,
        cardCount: linkedCards.length,
        nextPaymentInfo: nextPayment ? nextPayment.info : null,
        nextCardName: nextPayment ? nextPayment.card.name : null,
      };
    });
  }, [accounts, cards, cardsWithSchedule]);

  // データが0件の場合のEmpty State
  if (cards.length === 0 && accounts.length === 0) {
    return (
      <div className="space-y-6 py-4 animate-fadeIn">
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-lg p-6 sm:p-8 text-center space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-lg theme-bg-subtle text-[var(--color-primary)] flex items-center justify-center">
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
              className="flex items-center justify-between p-4 rounded-md border-2 border-[var(--color-primary)] theme-bg-primary text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <Landmark className="h-5 w-5 shrink-0" />
                <div>
                  <div className="text-[10px] opacity-80">ステップ 1</div>
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
                <CardIcon className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
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
      {/* ========================================================
          1. 直近の引き落とし予定（Hero Attention Banner）
          ======================================================== */}
      {upcomingGroup ? (
        <section
          aria-label="次回引き落とし予定"
          className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-3.5 sm:p-5 shadow-xs relative overflow-hidden"
        >
          <div className="space-y-3">
            {/* 上段：次回予定ラベル ＆ カウントダウンバッジ */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider theme-bg-subtle text-[var(--color-primary)] px-2 py-0.5 rounded-xs">
                  次回引き落とし予定
                </span>
                <span className="text-sm sm:text-base font-mono font-bold text-[#101828] dark:text-white">
                  {upcomingGroup.nextDateWithWeekday}
                </span>
                {upcomingGroup.isAdjusted && (
                  <span className="text-[10px] text-[#b54708] bg-[#b54708]/10 px-1.5 py-0.2 rounded-xs border border-[#b54708]/20 font-medium">
                    ※{upcomingGroup.adjustmentReason}のため翌営業日
                  </span>
                )}
              </div>

              {/* カウントダウン表示 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-sm font-bold ${
                    upcomingGroup.isToday
                      ? 'bg-[#d92d20] text-white shadow-xs'
                      : upcomingGroup.isTomorrow
                      ? 'bg-[#b54708] text-white shadow-xs'
                      : 'bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] text-[var(--color-primary)]'
                  }`}
                >
                  {upcomingGroup.isToday
                    ? '本日引き落とし'
                    : upcomingGroup.isTomorrow
                    ? '明日引き落とし'
                    : `あと ${upcomingGroup.daysLeft} 日`}
                </span>
                {upcomingGroup.items.length > 1 && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-xs bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] text-[#475467] dark:text-[#cfd5e0]">
                    {upcomingGroup.items.length}件
                  </span>
                )}
              </div>
            </div>

            {/* 中段・下段：引き落としカード一覧（同日全件表示） */}
            {upcomingGroup.items.length === 1 ? (
              /* 1件の場合 */
              (() => {
                const { card } = upcomingGroup.items[0];
                const acc = getBankAccount(accounts, card.bankAccountId);
                const brandCfg = getBrandColorConfig(card.brandColor, isDark);
                return (
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: brandCfg.hex || 'var(--color-primary)' }}
                      />
                      <button
                        type="button"
                        onClick={() => onEditCard(card)}
                        className="text-base sm:text-lg font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] hover:underline cursor-pointer text-left truncate max-w-full"
                        title={`${card.name} を編集`}
                      >
                        {card.name}
                      </button>
                      <span className="text-xs px-2 py-0.5 rounded-xs bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] font-mono font-bold text-[#344054] dark:text-[#cfd5e0]">
                        {formatPaymentDay(card, true)}
                      </span>
                    </div>

                    <div className="text-xs text-[#475467] dark:text-[#98a2b3] flex items-center gap-1.5 pt-0.5">
                      <Landmark className="h-3.5 w-3.5 shrink-0" />
                      <span>引き落とし口座:</span>
                      {acc ? (
                        <button
                          type="button"
                          onClick={() => onEditAccount(acc)}
                          className="font-bold text-[#101828] dark:text-white hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: acc.color || 'var(--color-primary)' }}
                          />
                          <span>{acc.name}</span>
                        </button>
                      ) : (
                        <span className="text-[#d92d20] font-bold">未登録</span>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              /* 複数件ある場合：同日引き落としカードを端正なリスト表示 */
              <div className="divide-y divide-[#d0d5dd]/50 dark:divide-[#2e3642] pt-1">
                {upcomingGroup.items.map(({ card, info }, idx) => {
                  const acc = getBankAccount(accounts, card.bankAccountId);
                  const brandCfg = getBrandColorConfig(card.brandColor, isDark);
                  return (
                    <div
                      key={card.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-2 ${
                        idx === 0 ? 'pt-0.5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: brandCfg.hex || 'var(--color-primary)' }}
                        />
                        <button
                          type="button"
                          onClick={() => onEditCard(card)}
                          className="text-sm sm:text-base font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] hover:underline cursor-pointer text-left truncate"
                          title={`${card.name} を編集`}
                        >
                          {card.name}
                        </button>
                        <span className="text-[11px] px-1.5 py-0.2 rounded-xs bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] font-mono font-bold text-[#344054] dark:text-[#cfd5e0]">
                          {formatPaymentDay(card, true)}
                        </span>
                        {info.isAdjusted && (
                          <span className="text-[9px] text-[#b54708] bg-[#b54708]/10 px-1 py-0.2 rounded-xs border border-[#b54708]/20 font-medium">
                            翌営業日
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#475467] dark:text-[#98a2b3] flex items-center gap-1.5 pl-4.5 sm:pl-0 shrink-0">
                        <Landmark className="h-3 w-3 shrink-0" />
                        <span>口座:</span>
                        {acc ? (
                          <button
                            type="button"
                            onClick={() => onEditAccount(acc)}
                            className="font-bold text-[#101828] dark:text-white hover:underline cursor-pointer inline-flex items-center gap-1 max-w-[140px] sm:max-w-none truncate"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: acc.color || 'var(--color-primary)' }}
                            />
                            <span className="truncate">{acc.name}</span>
                          </button>
                        ) : (
                          <span className="text-[#d92d20] font-bold">未登録</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* ========================================================
          2. 口座別引き落としサマリー（Bank Accounts Status）
          ======================================================== */}
      {accounts.length > 0 && (
        <section aria-label="口座別サマリー" className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-[var(--color-primary)]" />
              <h2 className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
                引き落とし口座の状況
              </h2>
              <span className="text-[11px] font-mono font-bold text-[#667085] dark:text-[#8e98a8]">
                ({accounts.length}口座)
              </span>
            </div>

            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('accounts')}
                className="text-[11px] font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>口座一覧</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {accountSummaries.map(({ account, cardCount, nextPaymentInfo, nextCardName }) => (
              <div
                key={account.id}
                onClick={() => onEditAccount(account)}
                className="p-3 rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] shadow-2xs hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: account.color || 'var(--color-primary)' }}
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white truncate">
                        {account.name}
                      </h3>
                      <p className="text-[10px] text-[#667085] dark:text-[#8e98a8]">
                        {account.accountType || '普通預金'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-xs bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] text-[#344054] dark:text-[#cfd5e0] shrink-0">
                    {cardCount}枚
                  </span>
                </div>

                <div className="pt-1.5 border-t border-[#d0d5dd]/40 dark:border-[#2e3642] flex items-center justify-between text-[11px] text-[#475467] dark:text-[#98a2b3]">
                  <span>直近予定:</span>
                  {nextPaymentInfo ? (
                    <span className="font-mono font-bold text-[#101828] dark:text-white flex items-center gap-1">
                      <span>{nextPaymentInfo.nextDateFormatted}</span>
                      <span className="text-[10px] text-[var(--color-primary)]">
                        ({nextPaymentInfo.isToday ? '本日' : nextPaymentInfo.isTomorrow ? '明日' : `あと${nextPaymentInfo.daysLeft}日`})
                      </span>
                    </span>
                  ) : (
                    <span className="text-[#98a2b3] italic text-[10px]">紐づくカードなし</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================
          3. 今後の引き落としタイムライン（時系列スケジュール）
          ======================================================== */}
      <section aria-label="今後の引き落とし予定" className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[var(--color-primary)]" />
            <h2 className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
              今後の引き落としスケジュール
            </h2>
          </div>

          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('cards')}
              className="text-[11px] font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>カード一覧・追加</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {futureScheduleGroups.length === 0 ? (
          <div className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 text-center space-y-1 shadow-xs">
            <p className="text-xs font-bold text-[#101828] dark:text-white flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>直近の引き落とし予定はすべて次回にまとまっています</span>
            </p>
            <p className="text-[11px] text-[#667085] dark:text-[#8e98a8]">
              次回引き落としが完了すると、翌月のサイクルがここにタイムライン表示されます。
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] overflow-hidden shadow-xs divide-y divide-[#d0d5dd]/60 dark:divide-[#2e3642]">
            {futureScheduleGroups.map((group) => (
              <div
                key={group.daysLeft}
                className="p-3 sm:px-4 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#f9fafb] dark:hover:bg-[#20252e] transition-colors"
              >
                {/* 日付・カウントダウン（左側） */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-mono font-bold text-[#101828] dark:text-white">
                    <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-mono font-bold text-[#101828] dark:text-white">
                        {group.nextDateWithWeekday}
                      </span>
                      {group.isAdjusted && (
                        <span className="text-[9px] text-[#b54708] bg-[#b54708]/10 px-1 py-0.2 rounded-xs border border-[#b54708]/20 font-medium">
                          翌営業日
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[var(--color-primary)] font-bold">
                      あと {group.daysLeft} 日
                    </span>
                  </div>
                </div>

                {/* 該当カード一覧（右側） */}
                <div className="flex-1 min-w-0 sm:pl-4 sm:border-l border-[#d0d5dd]/40 dark:border-[#2e3642] space-y-1">
                  {group.items.map(({ card }) => {
                    const acc = getBankAccount(accounts, card.bankAccountId);
                    const brandCfg = getBrandColorConfig(card.brandColor, isDark);
                    return (
                      <div
                        key={card.id}
                        className="flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="w-2 h-2 rounded-full shrink-0 shadow-2xs"
                            style={{ backgroundColor: brandCfg.hex || 'var(--color-primary)' }}
                          />
                          <button
                            type="button"
                            onClick={() => onEditCard(card)}
                            className="font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] hover:underline cursor-pointer truncate text-left"
                          >
                            {card.name}
                          </button>
                          <span className="text-[10px] text-[#667085] dark:text-[#8e98a8]">
                            ({formatPaymentDay(card)})
                          </span>
                        </div>

                        <div className="shrink-0 text-[11px] text-[#667085] dark:text-[#8e98a8]">
                          {acc ? (
                            <span className="inline-flex items-center gap-1 font-medium">
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: acc.color || 'var(--color-primary)' }}
                              />
                              <span className="truncate max-w-[120px] sm:max-w-none">{acc.name}</span>
                            </span>
                          ) : (
                            <span className="text-[#d92d20] font-bold">口座未設定</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          4. フッター付近のクイックアクション
          ======================================================== */}
      <div className="pt-1 flex items-center justify-between gap-2">
        <button
          onClick={onOpenAddCard}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md theme-bg-primary text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>カードを登録する</span>
        </button>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('cards')}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#475467] dark:text-[#98a2b3] hover:text-[var(--color-primary)] cursor-pointer"
          >
            <span>全カード一覧を見る</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
