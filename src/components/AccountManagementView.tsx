import React, { useMemo } from 'react';
import { BankAccount, CreditCard } from '../types';
import { getDaysUntilNextPayment } from '../utils/paymentUtils';
import { getBrandColorConfig } from '../utils/colors';
import { Plus, Pencil, Trash2, Landmark, CreditCard as CardIcon, Clock } from 'lucide-react';

interface AccountManagementViewProps {
  accounts: BankAccount[];
  cards: CreditCard[];
  onOpenAddAccount: () => void;
  onEditAccount: (account: BankAccount) => void;
  onDeleteAccount: (accountId: string) => void;
}

export const AccountManagementView: React.FC<AccountManagementViewProps> = ({
  accounts,
  cards,
  onOpenAddAccount,
  onEditAccount,
  onDeleteAccount,
}) => {
  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false;

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
    <div className="space-y-3.5 animate-fadeIn">
      {/* ページタイトルヘッダー（参考画像風の縦アクセントバーを採用） */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4.5 rounded-full theme-bg-primary shrink-0" />
          <div className="flex h-7 w-7 items-center justify-center rounded-md theme-bg-subtle text-[var(--color-primary)]">
            <Landmark className="h-4 w-4" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">
            引き落とし口座一覧
          </h2>
          <span className="text-xs font-mono font-bold text-[#475467] dark:text-[#98a2b3] bg-[#f4f6f8] dark:bg-[#222730] px-2 py-0.5 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e]">
            {accounts.length}件
          </span>
        </div>

        <button
          onClick={onOpenAddAccount}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg theme-bg-primary text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>口座を追加</span>
        </button>
      </div>

      {/* 口座0件のEmpty State */}
      {accounts.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-xl p-8 text-center space-y-3 shadow-xs">
          <p className="text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3]">
            登録されている銀行口座はありません。
          </p>
          <button
            onClick={onOpenAddAccount}
            className="px-4 py-2 rounded-lg theme-bg-primary text-white text-xs font-bold shadow-xs cursor-pointer hover:opacity-90"
          >
            口座を登録する
          </button>
        </div>
      ) : (
        /* 参考画像スタイルの「ひとつひとつ独立したアイランドカードUI」 */
        <div className="space-y-2.5">
          {accountsWithDetails.map(({ account, linkedCards, nearestPayment }) => (
            <div
              key={account.id}
              className="p-3.5 sm:p-4 rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] shadow-xs hover:border-[var(--color-primary)]/70 transition-all flex flex-col gap-3 group"
            >
              {/* カード上部：口座名・種別・アクション */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* 口座カラーバッジ */}
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: account.color || 'var(--color-primary)' }}
                  />
                  <div className="min-w-0 flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onEditAccount(account)}
                      className="text-sm sm:text-base font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] hover:underline cursor-pointer text-left truncate"
                      title={`${account.name} を編集`}
                    >
                      {account.name}
                    </button>
                    {account.branchName && (
                      <span className="text-[11px] text-[#667085] dark:text-[#8e98a8]">
                        {account.branchName}
                      </span>
                    )}
                    <span className="text-[10px] text-[#475467] dark:text-[#98a2b3] bg-[#f4f6f8] dark:bg-[#222730] px-1.5 py-0.2 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e]">
                      {account.accountType || '普通'}
                    </span>
                  </div>
                </div>

                {/* 連携カード数バッジ ＆ アクション */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] text-[#344054] dark:text-[#cfd5e0]">
                    {linkedCards.length}枚連携
                  </span>

                  <button
                    type="button"
                    onClick={() => onEditAccount(account)}
                    title="口座情報を編集"
                    className="p-1.5 rounded-lg border border-[#d0d5dd]/70 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-white dark:hover:bg-[#2c333f] text-[#667085] hover:text-[var(--color-primary)] transition-all cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteAccount(account.id)}
                    title="口座を削除"
                    className="p-1.5 rounded-lg border border-[#d0d5dd]/70 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[#667085] hover:text-[#d92d20] transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* カード中央：紐づくクレジットカードチップ一覧 */}
              <div className="flex items-center gap-1.5 text-xs text-[#475467] dark:text-[#98a2b3] flex-wrap">
                <span className="text-[11px] text-[#667085] dark:text-[#8e98a8]">紐づくカード:</span>
                {linkedCards.length === 0 ? (
                  <span className="text-[11px] text-[#98a2b3] italic">未設定（カード未紐付け）</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {linkedCards.map((c) => {
                      const brandCfg = getBrandColorConfig(c.brandColor, isDark);
                      return (
                        <span
                          key={c.id}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-[#f4f6f8] dark:bg-[#222730] text-[#101828] dark:text-[#f0f2f5] px-2 py-0.5 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] shadow-2xs"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: brandCfg.hex || 'var(--color-primary)' }}
                          />
                          <CardIcon className="h-3 w-3 text-[var(--color-primary)]" />
                          <span className="truncate max-w-[140px] sm:max-w-none">{c.name}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* カード下部：直近引き落とし予定情報（あれば表示） */}
              {nearestPayment && (
                <div className="pt-2 border-t border-[#d0d5dd]/40 dark:border-[#2e3642] flex items-center justify-between text-[11px] text-[#475467] dark:text-[#98a2b3]">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[var(--color-primary)]" />
                    <span>次回引き落とし:</span>
                    <span className="font-bold text-[#101828] dark:text-white">
                      {nearestPayment.cardName}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#101828] dark:text-white flex items-center gap-1">
                    <span>{nearestPayment.nextDateFormatted}</span>
                    <span className="text-[10px] text-[var(--color-primary)]">
                      ({nearestPayment.isToday ? '本日' : nearestPayment.isTomorrow ? '明日' : `あと${nearestPayment.daysLeft}日`})
                    </span>
                  </span>
                </div>
              )}

              {account.note && (
                <p className="text-[11px] text-[#667085] dark:text-[#8e98a8] border-t border-[#d0d5dd]/30 dark:border-[#2e3642]/60 pt-1.5">
                  {account.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};