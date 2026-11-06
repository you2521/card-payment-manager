import React, { useMemo } from 'react';
import { CreditCard, BankAccount, ActiveTab } from '../types';
import {
  getDaysUntilNextPayment,
  getBankAccount,
} from '../utils/paymentUtils';
import { getBrandColorConfig, getAccessibleColorHex } from '../utils/colors';
import {
  Landmark,
  Plus,
  ArrowRight,
  ChevronRight,
  CreditCard as CardIcon,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  cards: CreditCard[];
  accounts: BankAccount[];
  isDark?: boolean;
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
  isDark = false,
  adjustForBankHolidays = true,
  onEditCard,
  onEditAccount,
  onOpenAddCard,
  onOpenAddAccount,
  onNavigateToTab,
}) => {
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
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-xl p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-lg theme-bg-subtle text-[var(--color-primary)] flex items-center justify-center">
            <CardIcon strokeWidth={1.75} className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-[#101828] dark:text-white">
              引き落とし管理をはじめましょう
            </h2>
            <p className="text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3] leading-relaxed">
              登録したデータはお使いの端末（ブラウザ）にのみ安全に保存されます。まずは引き落とし口座を登録してみましょう。
            </p>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            <button
              onClick={onOpenAddAccount}
              className="flex items-center justify-between p-4 rounded-lg theme-bg-primary text-white font-bold text-xs sm:text-sm transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <Landmark strokeWidth={1.75} className="h-5 w-5 shrink-0" />
                <div>
                  <div className="text-[10px] opacity-85">ステップ 1</div>
                  <div>銀行口座を登録</div>
                </div>
              </div>
              <ArrowRight strokeWidth={1.75} className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenAddCard}
              className="flex items-center justify-between p-4 rounded-lg border border-[#d0d5dd] dark:border-[#363f4e] bg-white dark:bg-[#222730] hover:bg-[#f4f6f8] dark:hover:bg-[#2c333f] text-[#101828] dark:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <CardIcon strokeWidth={1.75} className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
                <div>
                  <div className="text-[10px] text-[#667085] dark:text-[#98a2b3]">ステップ 2</div>
                  <div>カードを登録</div>
                </div>
              </div>
              <Plus strokeWidth={1.75} className="h-4 w-4 text-[#667085] dark:text-[#98a2b3]" />
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
        <section aria-label="次回引き落とし予定" className="space-y-2.5">
          {/* 見出し（文字サイズ拡大） */}
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-5 rounded-xs bg-[var(--color-primary)] shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-[#101828] dark:text-white">
                次回引き落とし予定
              </h2>
            </div>
            {upcomingGroup.isAdjusted && (
              <span className="text-xs text-[#b54708] dark:text-amber-300 font-medium">
                ※{upcomingGroup.adjustmentReason}
              </span>
            )}
          </div>

          {/* 独立アイランドカードUI（文字拡大・高視認性） */}
          <div
            onClick={() => onEditCard(upcomingGroup.items[0].card)}
            className="p-3.5 sm:p-4 rounded-xl border border-[var(--color-primary)]/45 dark:border-[var(--color-primary)]/45 bg-white dark:bg-[#1a1f26] hover:border-[var(--color-primary)] transition-all flex items-center justify-between gap-3.5 cursor-pointer group shadow-xs"
          >
            {/* 左側：日付＆残り日数タイル（数字を大きく表示） */}
            <div className="flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px] h-[68px] sm:h-[76px] rounded-lg theme-bg-subtle border border-[var(--color-primary)]/25 text-center shrink-0 p-1.5">
              <span className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0] leading-none">
                {upcomingGroup.nextDateWithWeekday}
              </span>
              <span
                className={`text-base sm:text-lg font-mono font-black leading-tight mt-1.5 ${
                  upcomingGroup.isToday
                    ? 'text-[#d92d20] dark:text-[#f87171]'
                    : upcomingGroup.isTomorrow
                    ? 'text-[#c2410c] dark:text-[#fb923c]'
                    : 'text-[var(--color-primary)]'
                }`}
              >
                {upcomingGroup.isToday
                  ? '本日'
                  : upcomingGroup.isTomorrow
                  ? '明日'
                  : `あと${upcomingGroup.daysLeft}日`}
              </span>
              <span className="text-[10px] text-[#475467] dark:text-[#98a2b3] font-bold leading-none mt-1">
                {upcomingGroup.items.length}件の予定
              </span>
            </div>

            {/* 中央：カード名 & 口座名（文字拡大・はっきりした視認性） */}
            <div className="flex-1 min-w-0 space-y-2">
              {upcomingGroup.items.map(({ card }) => {
                const acc = getBankAccount(accounts, card.bankAccountId);
                const brandCfg = getBrandColorConfig(card.brandColor, isDark);
                const accColor = getAccessibleColorHex(acc?.color, isDark);

                return (
                  <div
                    key={card.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCard(card);
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: brandCfg.hex }}
                      />
                      <span className="text-base sm:text-lg font-bold text-[#101828] dark:text-white group-hover:text-[var(--color-primary)] truncate tracking-tight">
                        {card.name}
                      </span>
                    </div>

                    {/* 口座表示（文字サイズを大きく） */}
                    <div className="text-xs sm:text-sm text-[#344054] dark:text-[#f0f2f5] flex items-center gap-1.5 pl-5 sm:pl-0 shrink-0">
                      <Landmark
                        strokeWidth={1.75}
                        className="h-4 w-4 shrink-0"
                        style={{ color: acc ? accColor : 'var(--color-primary)' }}
                      />
                      {acc ? (
                        <span className="font-semibold text-[#101828] dark:text-white truncate max-w-[170px] sm:max-w-none">
                          {acc.name}
                        </span>
                      ) : (
                        <span className="text-[#d92d20] dark:text-[#f87171] font-bold">口座未設定</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 右側：シンプルな線シェブロン */}
            <ChevronRight
              strokeWidth={1.75}
              className="h-5 w-5 text-[#98a2b3] dark:text-[#667085] group-hover:text-[var(--color-primary)] transition-colors shrink-0"
            />
          </div>
        </section>
      )}

      {/* ========================================================
          2. 引き落としスケジュール（タイムライン）
          ======================================================== */}
      <section aria-label="引き落としスケジュール" className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 rounded-xs bg-[var(--color-primary)] shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-[#101828] dark:text-white">
              引き落としスケジュール
            </h2>
          </div>

          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('cards')}
              className="text-xs sm:text-sm font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>カード管理</span>
              <ChevronRight strokeWidth={1.75} className="h-4 w-4" />
            </button>
          )}
        </div>

        {futureScheduleGroups.length === 0 ? (
          <div className="rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 sm:p-5 text-center space-y-1.5">
            <p className="text-sm sm:text-base font-bold text-[#101828] dark:text-white flex items-center justify-center gap-2">
              <CheckCircle2 strokeWidth={1.75} className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span>すべての引き落とし予定が次回にまとまっています</span>
            </p>
            <p className="text-xs text-[#667085] dark:text-[#98a2b3]">
              次回引き落としが完了すると、翌月の予定が自動的にここに表示されます。
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {futureScheduleGroups.map((group) => (
              <div
                key={group.daysLeft}
                onClick={() => onEditCard(group.items[0].card)}
                className="p-3.5 sm:p-4 rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] hover:border-[var(--color-primary)]/70 transition-all flex items-center justify-between gap-3.5 cursor-pointer group shadow-xs"
              >
                {/* 左側：アイキャッチ角丸タイル（数字を大きく） */}
                <div className="flex flex-col items-center justify-center min-w-[68px] sm:min-w-[76px] h-[64px] sm:h-[72px] rounded-lg theme-bg-subtle border border-[var(--color-primary)]/20 text-center shrink-0 p-1.5">
                  <span className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0] leading-none">
                    {group.nextDateWithWeekday}
                  </span>
                  <span className="text-base sm:text-lg font-mono font-black text-[var(--color-primary)] leading-tight mt-1.5">
                    あと{group.daysLeft}日
                  </span>
                  {group.isAdjusted && (
                    <span className="text-[9px] text-[#b54708] dark:text-amber-300 font-bold leading-none mt-1">
                      翌営業日
                    </span>
                  )}
                </div>

                {/* 中央：カード名 & 引き落とし口座（文字拡大） */}
                <div className="flex-1 min-w-0 space-y-2">
                  {group.items.map(({ card }) => {
                    const acc = getBankAccount(accounts, card.bankAccountId);
                    const brandCfg = getBrandColorConfig(card.brandColor, isDark);
                    const accColor = getAccessibleColorHex(acc?.color, isDark);

                    return (
                      <div
                        key={card.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCard(card);
                        }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: brandCfg.hex }}
                          />
                          <span className="text-base sm:text-lg font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] truncate tracking-tight">
                            {card.name}
                          </span>
                        </div>

                        {/* 口座表示 */}
                        <div className="text-xs sm:text-sm text-[#344054] dark:text-[#f0f2f5] flex items-center gap-1.5 pl-5 sm:pl-0 shrink-0">
                          <Landmark
                            strokeWidth={1.75}
                            className="h-4 w-4 shrink-0"
                            style={{ color: acc ? accColor : 'var(--color-primary)' }}
                          />
                          {acc ? (
                            <span className="font-semibold text-[#101828] dark:text-white truncate max-w-[170px] sm:max-w-none">
                              {acc.name}
                            </span>
                          ) : (
                            <span className="text-[#d92d20] dark:text-[#f87171] font-bold">口座未設定</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 右側：シンプルな線シェブロン */}
                <ChevronRight
                  strokeWidth={1.75}
                  className="h-5 w-5 text-[#98a2b3] dark:text-[#667085] group-hover:text-[var(--color-primary)] transition-colors shrink-0"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          3. 引き落とし口座の状況（口座サマリー）
          ======================================================== */}
      {accounts.length > 0 && (
        <section aria-label="口座別サマリー" className="space-y-2.5">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-5 rounded-xs bg-[var(--color-primary)] shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-[#101828] dark:text-white">
                引き落とし口座の状況
              </h2>
              <span className="text-sm font-mono font-bold text-[#667085] dark:text-[#98a2b3]">
                ({accounts.length})
              </span>
            </div>

            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('accounts')}
                className="text-xs sm:text-sm font-bold text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>口座管理</span>
                <ChevronRight strokeWidth={1.75} className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 口座独立カード一覧（文字サイズ拡大） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {accountSummaries.map(({ account, cardCount, nextPaymentInfo }) => {
              const accColor = getAccessibleColorHex(account.color, isDark);
              return (
                <div
                  key={account.id}
                  onClick={() => onEditAccount(account)}
                  className="p-4 rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: accColor }}
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white truncate">
                          {account.name}
                        </h3>
                        <p className="text-xs text-[#667085] dark:text-[#98a2b3] mt-0.5">
                          {account.accountType || '普通'}預金
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-xs bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] text-[#344054] dark:text-[#cfd5e0] shrink-0">
                      {cardCount}枚
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-[#d0d5dd]/50 dark:border-[#2e3642] flex items-center justify-between text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3]">
                    <span>直近の予定</span>
                    {nextPaymentInfo ? (
                      <span className="font-mono font-bold text-[#101828] dark:text-white flex items-center gap-1.5">
                        <span>{nextPaymentInfo.nextDateFormatted}</span>
                        <span className="text-xs text-[var(--color-primary)] font-bold">
                          ({nextPaymentInfo.isToday ? '本日' : nextPaymentInfo.isTomorrow ? '明日' : `あと${nextPaymentInfo.daysLeft}日`})
                        </span>
                      </span>
                    ) : (
                      <span className="text-[#98a2b3] text-xs">予定なし</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================
          4. クイックアクション（ボタンの目立ち度＆押しやすさ維持）
          ======================================================== */}
      <div className="pt-1 flex items-center justify-between gap-2.5">
        <button
          onClick={onOpenAddCard}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg theme-bg-primary text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
        >
          <Plus strokeWidth={2} className="h-4 w-4" />
          <span>カードを登録する</span>
        </button>

        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('cards')}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#475467] dark:text-[#cfd5e0] hover:text-[var(--color-primary)] cursor-pointer"
          >
            <span>全カード一覧を見る</span>
            <ArrowRight strokeWidth={2} className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
