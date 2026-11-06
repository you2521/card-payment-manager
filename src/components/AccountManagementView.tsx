import React, { useMemo } from 'react';
import { BankAccount, CreditCard } from '../types';
import { getDaysUntilNextPayment } from '../utils/paymentUtils';
import { getBrandColorConfig, getAccessibleColorHex } from '../utils/colors';
import { Plus, Pencil, Trash2, Clock } from 'lucide-react';

interface AccountManagementViewProps {
  accounts: BankAccount[];
  cards: CreditCard[];
  isDark?: boolean;
  onOpenAddAccount: () => void;
  onEditAccount: (account: BankAccount) => void;
  onDeleteAccount: (accountId: string) => void;
}

export const AccountManagementView: React.FC<AccountManagementViewProps> = ({
  accounts,
  cards,
  isDark = false,
  onOpenAddAccount,
  onEditAccount,
  onDeleteAccount,
}) => {
  // 口座ごとに紐づくカードと、その口座の直近引き落とし予定を計算
  const accountsWithDetails = useMemo(() => {
    return accounts.map((account) => {
      const linkedCards = cards.filter((c) => c.bankAccountId === account.id);

      // 紐づくカードの中で直近の支払予定を算出
      let nearestPayment: {
        cardName: string;
        daysLeft: number;
        nextDateFormatted: string;
        isToday: boolean;
        isTomorrow: boolean;
      } | null = null;

      if (linkedCards.length > 0) {
        const schedules = linkedCards.map((c) => {
          const info = getDaysUntilNextPayment(c, new Date());
          return { cardName: c.name, ...info };
        });

        schedules.sort((a, b) => a.daysLeft - b.daysLeft);
        const top = schedules[0];
        nearestPayment = {
          cardName: top.cardName,
          daysLeft: top.daysLeft,
          nextDateFormatted: top.nextDateFormatted,
          isToday: top.isToday,
          isTomorrow: top.isTomorrow,
        };
      }

      return {
        account,
        linkedCards,
        nearestPayment,
      };
    });
  }, [accounts, cards]);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* セクション見出し（文字サイズ拡大＆追加ボタン維持） */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 rounded-xs bg-[var(--color-primary)] shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-[#101828] dark:text-white">
            引き落とし口座一覧
          </h2>
          <span className="text-sm font-mono font-bold text-[#667085] dark:text-[#98a2b3]">
            ({accounts.length})
          </span>
        </div>

        <button
          onClick={onOpenAddAccount}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg theme-bg-primary text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0"
        >
          <Plus strokeWidth={2} className="h-4 w-4" />
          <span>口座を追加</span>
        </button>
      </div>

      {/* 口座0件のEmpty State */}
      {accounts.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-xl p-8 text-center space-y-3">
          <p className="text-sm sm:text-base text-[#475467] dark:text-[#98a2b3]">
            登録されている銀行口座はありません。
          </p>
          <button
            onClick={onOpenAddAccount}
            className="px-5 py-2.5 rounded-lg theme-bg-primary text-white text-sm font-bold cursor-pointer"
          >
            口座を登録する
          </button>
        </div>
      ) : (
        /* 独立アイランドカードUI（文字拡大・高視認性） */
        <div className="space-y-3">
          {accountsWithDetails.map(({ account, linkedCards, nearestPayment }) => {
            const accColor = getAccessibleColorHex(account.color, isDark);

            return (
              <div
                key={account.id}
                className="p-4 rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] hover:border-[var(--color-primary)]/70 transition-all flex flex-col gap-3.5 group shadow-xs"
              >
                {/* カード上部：口座名・種別・アクション */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* 口座カラーバッジ */}
                    <span
                      className="w-4 h-4 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: accColor }}
                    />
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => onEditAccount(account)}
                        className="text-base sm:text-lg font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] hover:underline cursor-pointer text-left block truncate w-full tracking-tight"
                        title={`${account.name} を編集`}
                      >
                        {account.name}
                      </button>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#667085] dark:text-[#98a2b3] mt-0.5">
                        <span>{account.accountType || '普通'}預金</span>
                        {account.branchName && (
                          <>
                            <span>·</span>
                            <span className="truncate">{account.branchName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 連携カード数バッジ ＆ アクション */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs sm:text-sm font-mono font-bold px-2.5 py-1 rounded-md bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] text-[#344054] dark:text-[#cfd5e0]">
                      {linkedCards.length}枚連携
                    </span>

                    <button
                      type="button"
                      onClick={() => onEditAccount(account)}
                      title="口座情報を編集"
                      className="p-2 rounded-lg border border-[#d0d5dd]/80 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-white dark:hover:bg-[#2c333f] text-[#475467] dark:text-[#cfd5e0] hover:text-[var(--color-primary)] transition-all cursor-pointer"
                    >
                      <Pencil strokeWidth={1.75} className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAccount(account.id)}
                      title="口座を削除"
                      className="p-2 rounded-lg border border-[#d0d5dd]/80 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[#475467] dark:text-[#cfd5e0] hover:text-[#d92d20] dark:hover:text-[#f87171] transition-all cursor-pointer"
                    >
                      <Trash2 strokeWidth={1.75} className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* カード中央：紐づくクレジットカードチップ一覧 */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3] flex-wrap">
                  <span className="text-xs sm:text-sm font-medium text-[#667085] dark:text-[#98a2b3]">紐づくカード:</span>
                  {linkedCards.length === 0 ? (
                    <span className="text-xs sm:text-sm text-[#98a2b3] italic">未設定（カード未紐付け）</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {linkedCards.map((c) => {
                        const brandCfg = getBrandColorConfig(c.brandColor, isDark);
                        return (
                          <span
                            key={c.id}
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-[#f4f6f8] dark:bg-[#222730] text-[#101828] dark:text-[#f0f2f5] px-3 py-1 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] shadow-2xs"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: brandCfg.hex }}
                            />
                            <span className="truncate max-w-[170px] sm:max-w-none">{c.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* カード下部：直近引き落とし予定情報 */}
                {nearestPayment && (
                  <div className="pt-2.5 border-t border-[#d0d5dd]/50 dark:border-[#2e3642] flex items-center justify-between text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Clock strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                      <span className="shrink-0 font-medium">次回引き落とし:</span>
                      <span className="font-bold text-[#101828] dark:text-white truncate">
                        {nearestPayment.cardName}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#101828] dark:text-white flex items-center gap-1.5 shrink-0">
                      <span>{nearestPayment.nextDateFormatted}</span>
                      <span className="text-xs text-[var(--color-primary)] font-bold">
                        ({nearestPayment.isToday ? '本日' : nearestPayment.isTomorrow ? '明日' : `あと${nearestPayment.daysLeft}日`})
                      </span>
                    </span>
                  </div>
                )}

                {account.note && (
                  <p className="text-xs text-[#667085] dark:text-[#98a2b3] border-t border-[#d0d5dd]/40 dark:border-[#2e3642]/60 pt-2">
                    {account.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
