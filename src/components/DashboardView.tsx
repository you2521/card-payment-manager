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

  // 3. 次回以降の引き落としスケジュール（タイムライン）
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

  // 4. 口座ごとの状況サマリー
  const accountSummaries = useMemo(() => {
    return accounts.map((account) => {
      const linkedCards = cards.filter((c) => c.bankAccountId === account.id);
      const linkedWithSchedule = cardsWithSchedule.filter((c) => c.card.bankAccountId === account.id);
      const nextPayment = linkedWithSchedule[0];

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
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
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
              className="flex items-center justify-between p-4 rounded-lg border-2 border-[var(--color-primary)] theme-bg-primary text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer text-left"
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
              className="flex items-center justify-between p-4 rounded-lg border border-[#d0d5dd] dark:border-[#363f4e] bg-white dark:bg-[#222730] hover:bg-[#f4f6f8] dark:hover:bg-[#2c333f] text-[#101828] dark:text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer text-left"
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
          1. 次回引き落とし予定（Hero Attention Card）
          ======================================================== */}
      {upcomingGroup && (
        <section aria-label="次回引き落とし予定" className="space-y-2">
          {/* 参考画像スタイルのセクション見出し（太い縦アクセントバー付き） */}
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4.5 rounded-full theme-bg-primary shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">
                次回引き落とし予定
              </h2>
            </div>
            {upcomingGroup.isAdjusted && (
              <span className="text-[10px] text-[#b54708] dark:text-amber-400 bg-[#b54708]/10 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-xs border border-[#b54708]/20 font-medium">
                ※{upcomingGroup.adjustmentReason}
              </span>
            )}
          </div>

          {/* 下のスケジュールと完全に統一されたアイランドカードUI（左寄せタイル＋右側カード情報） */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-[var(--color-primary)]/50 dark:border-[var(--color-primary)]/40 bg-white dark:bg-[#1a1f26] shadow-xs hover:border-[var(--color-primary)]/80 transition-all flex items-center justify-between gap-3 group">
            {/* 左側：アイキャッチ角丸タイル（日付 ＆ オレンジ「あと○日」を左寄せで配置し、下のスケジュールと統一） */}
            <div className="flex flex-col items-center justify-center min-w-[66px] sm:min-w-[74px] h-[66px] sm:h-[74px] rounded-lg theme-bg-subtle border border-[var(--color-primary)]/30 text-center shrink-0 p-1">
              <span className="text-[10px] font-bold text-[#475467] dark:text-[#98a2b3] leading-none">
                {upcomingGroup.nextDateWithWeekday}
              </span>
              <span
                className={`text-sm sm:text-base font-mono font-extrabold leading-tight mt-1 ${
                  upcomingGroup.isToday
                    ? 'text-[#d92d20] animate-pulse'
                    : upcomingGroup.isTomorrow
                    ? 'text-[#ea580c]'
                    : 'theme-text-accent'
                }`}
              >
                {upcomingGroup.isToday
                  ? '本日'
                  : upcomingGroup.isTomorrow
                  ? '明日'
                  : `あと${upcomingGroup.daysLeft}日`}
              </span>
              <span className="text-[8.5px] text-[#667085] dark:text-[#8e98a8] font-bold leading-none mt-1">
                {upcomingGroup.items.length}件の予定
              </span>
            </div>

            {/* 中央：カード名 & 口座名（「毎月n日」と「paypay銀行下の薄い線」を撤廃して軽量化） */}
            <div className="flex-1 min-w-0 space-y-2">
              {upcomingGroup.items.map(({ card }) => {
                const acc = getBankAccount(accounts, card.bankAccountId);
                const brandCfg = getBrandColorConfig(card.brandColor, isDark);
                return (
                  <div
                    key={card.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: brandCfg.hex || 'var(--color-primary)' }}
                      />
                      <button
                        type="button"
                        onClick={() => onEditCard(card)}
                        className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] hover:underline cursor-pointer truncate text-left"
                        title={`${card.name} を編集`}
                      >
                        {card.name}
                      </button>
                    </div>

                    {/* 口座表示 */}
                    <div className="text-[11px] text-[#475467] dark:text-[#98a2b3] flex items-center gap-1 pl-4.5 sm:pl-0 shrink-0">
                      <Landmark className="h-3 w-3 shrink-0 text-[var(--color-primary)]" />
                      {acc ? (
                        <span className="font-medium text-[#101828] dark:text-white inline-flex items-center gap-1">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: acc.color || 'var(--color-primary)' }}
                          />
                          <span className="truncate max-w-[140px] sm:max-w-none">{acc.name}</span>
                        </span>
                      ) : (
                        <span className="text-[#d92d20] font-bold">口座未設定</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 右側：編集アクション */}
            <button
              type="button"
              onClick={() => onEditCard(upcomingGroup.items[0].card)}
              className="p-1.5 rounded-lg border border-[#d0d5dd]/70 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-white dark:hover:bg-[#2c333f] text-[#667085] hover:text-[var(--color-primary)] transition-all shrink-0 cursor-pointer"
              title="編集"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* ========================================================
          2. 引き落としスケジュール（タイムライン）★2番目に配置！
          ======================================================== */}
      <section aria-label="引き落としスケジュール" className="space-y-2.5">
        {/* 参考画像スタイルのセクション見出し（太い縦アクセントバー付き） */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4.5 rounded-full theme-bg-primary shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">
              引き落としスケジュール
            </h2>
          </div>

          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('cards')}
              className="text-[11px] font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>カード管理</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {futureScheduleGroups.length === 0 ? (
          <div className="rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 sm:p-5 text-center space-y-1.5 shadow-xs">
            <p className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white flex items-center justify-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>すべての引き落とし予定が次回にまとまっています</span>
            </p>
            <p className="text-[11px] text-[#667085] dark:text-[#8e98a8]">
              次回引き落としが完了すると、翌月の予定が自動的にここに表示されます。
            </p>
          </div>
        ) : (
          /* 参考画像の動画リストのような「ひとつひとつ独立したアイランドカード」 */
          <div className="space-y-2.5">
            {futureScheduleGroups.map((group) => (
              <div
                key={group.daysLeft}
                className="p-3 sm:p-3.5 rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] shadow-xs hover:border-[var(--color-primary)]/70 transition-all flex items-center justify-between gap-3 group"
              >
                {/* 左側：アイキャッチ角丸タイル（参考画像のサムネイル枠のような明確なビジュアルブロック） */}
                <div className="flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] h-[62px] sm:h-[70px] rounded-lg theme-bg-subtle border border-[var(--color-primary)]/20 text-center shrink-0 p-1">
                  <span className="text-[10px] font-bold text-[#475467] dark:text-[#98a2b3] leading-none">
                    {group.nextDateWithWeekday}
                  </span>
                  <span className="text-sm sm:text-base font-mono font-extrabold theme-text-accent leading-tight mt-1">
                    あと{group.daysLeft}日
                  </span>
                  {group.isAdjusted && (
                    <span className="text-[8px] text-[#b54708] dark:text-amber-400 font-bold leading-none mt-0.5">
                      翌営業日
                    </span>
                  )}
                </div>

                {/* 中央：カード名 & 引き落とし口座（重複していた右横の日付バッジを削除して情報量を軽量化） */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {group.items.map(({ card }) => {
                    const acc = getBankAccount(accounts, card.bankAccountId);
                    const brandCfg = getBrandColorConfig(card.brandColor, isDark);
                    return (
                      <div
                        key={card.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                            style={{ backgroundColor: brandCfg.hex || 'var(--color-primary)' }}
                          />
                          <button
                            type="button"
                            onClick={() => onEditCard(card)}
                            className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] hover:underline cursor-pointer truncate text-left"
                          >
                            {card.name}
                          </button>
                        </div>

                        {/* 口座表示 */}
                        <div className="text-[11px] text-[#475467] dark:text-[#98a2b3] flex items-center gap-1 pl-4 sm:pl-0 shrink-0">
                          <Landmark className="h-3 w-3 shrink-0 text-[var(--color-primary)]" />
                          {acc ? (
                            <span className="font-medium text-[#101828] dark:text-white inline-flex items-center gap-1">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: acc.color || 'var(--color-primary)' }}
                              />
                              <span className="truncate max-w-[130px] sm:max-w-none">{acc.name}</span>
                            </span>
                          ) : (
                            <span className="text-[#d92d20] font-bold">口座未設定</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 右側：編集アクション（参考画像風のアクション誘導矢印） */}
                <button
                  type="button"
                  onClick={() => onEditCard(group.items[0].card)}
                  className="p-1.5 rounded-lg border border-[#d0d5dd]/70 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-white dark:hover:bg-[#2c333f] text-[#667085] hover:text-[var(--color-primary)] transition-all shrink-0 cursor-pointer"
                  title="編集"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          3. 引き落とし口座の状況（口座サマリー）★3番目に配置！
          ======================================================== */}
      {accounts.length > 0 && (
        <section aria-label="口座別サマリー" className="space-y-2.5">
          {/* 参考画像スタイルのセクション見出し（太い縦アクセントバー付き） */}
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4.5 rounded-full theme-bg-primary shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">
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
                <span>口座管理</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* 口座独立カード一覧 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {accountSummaries.map(({ account, cardCount, nextPaymentInfo }) => (
              <div
                key={account.id}
                onClick={() => onEditAccount(account)}
                className="p-3.5 rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] shadow-xs hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
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

                <div className="pt-2 border-t border-[#d0d5dd]/40 dark:border-[#2e3642] flex items-center justify-between text-[11px] text-[#475467] dark:text-[#98a2b3]">
                  <span>直近の予定:</span>
                  {nextPaymentInfo ? (
                    <span className="font-mono font-bold text-[#101828] dark:text-white flex items-center gap-1">
                      <span>{nextPaymentInfo.nextDateFormatted}</span>
                      <span className="text-[10px] theme-text-accent font-bold">
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
          4. クイックアクション
          ======================================================== */}
      <div className="pt-1 flex items-center justify-between gap-2">
        <button
          onClick={onOpenAddCard}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg theme-bg-primary text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
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
