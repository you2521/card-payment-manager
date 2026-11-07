import React, { useMemo } from 'react';
import { BankAccount, CreditCard } from '../types';
import { getDaysUntilNextPayment } from '../utils/paymentUtils';
import { getBrandColorConfig, getAccessibleColorHex } from '../utils/colors';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
      {/* DADS セクション見出し（左 4px ソリッドバー + 追加ボタン維持） */}
      <div className="flex items-center justify-between pb-0.5">
        <div className="dads-section-header">
          <div className="flex items-center gap-2">
            <h2 className="dads-section-title">引き落とし口座一覧</h2>
            <span className="dads-counter-badge">全 {accounts.length} 口座</span>
          </div>
        </div>

        <button
          onClick={onOpenAddAccount}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] theme-bg-primary text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0"
        >
          <Plus strokeWidth={2} className="h-4 w-4" />
          <span>口座を追加</span>
        </button>
      </div>

      {/* 口座0件のEmpty State */}
      {accounts.length === 0 ? (
        <div className="dads-card p-8 text-center space-y-3">
          <p className="text-sm sm:text-base text-[var(--dads-sumi-700)]">
            登録されている銀行口座はありません。
          </p>
          <button
            onClick={onOpenAddAccount}
            className="px-5 py-2.5 rounded-[8px] theme-bg-primary text-white text-sm font-bold cursor-pointer"
          >
            口座を登録する
          </button>
        </div>
      ) : (
        /* DADS フラットカードUI（外枠8px角丸、内側タグ・ボタン4px角丸） */
        <div className="space-y-2.5">
          {accountsWithDetails.map(({ account, linkedCards, nearestPayment }) => {
            const accColor = getAccessibleColorHex(account.color, isDark);

            return (
              <div
                key={account.id}
                className="dads-card p-3.5 sm:p-4 hover:border-[var(--color-primary)] transition-colors flex flex-col gap-3 group"
              >
                {/* カード上部：口座名・種別・アクション */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    {/* 口座カラーバッジ */}
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 mt-1"
                      style={{ backgroundColor: accColor }}
                    />
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => onEditAccount(account)}
                        className="text-base sm:text-lg font-bold text-[var(--dads-sumi-900)] hover:text-[var(--color-primary)] hover:underline cursor-pointer text-left block truncate w-full tracking-tight leading-snug"
                        title={`${account.name} を編集`}
                      >
                        {account.name}
                      </button>
                      <div className="flex items-center gap-2 text-xs text-[var(--dads-sumi-700)] mt-0.5">
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

                  {/* 連携カード数バッジ ＆ DADS 4px角丸アクションボタン */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="dads-counter-badge font-mono">
                      {linkedCards.length}枚連携
                    </span>

                    <button
                      type="button"
                      onClick={() => onEditAccount(account)}
                      title="口座情報を編集"
                      className="dads-action-btn hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                      <Pencil strokeWidth={1.75} className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">編集</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteAccount(account.id)}
                      title="口座を削除"
                      className="dads-action-btn hover:border-[var(--dads-danger)] hover:text-[var(--dads-danger)]"
                    >
                      <Trash2 strokeWidth={1.75} className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">削除</span>
                    </button>
                  </div>
                </div>

                {/* カード中央：紐づくクレジットカードタグ一覧 (DADS 4px角丸タグ) */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--dads-sumi-700)] flex-wrap">
                  <span className="text-xs font-bold text-[var(--dads-sumi-700)]">紐づくカード:</span>
                  {linkedCards.length === 0 ? (
                    <span className="text-xs text-[var(--dads-sumi-500)]">未設定（カード未紐付け）</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {linkedCards.map((c) => {
                        const brandCfg = getBrandColorConfig(c.brandColor, isDark);
                        return (
                          <span
                            key={c.id}
                            className="dads-tag px-2.5 py-1 text-xs sm:text-[13px]"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: brandCfg.hex }}
                            />
                            <span className="truncate max-w-[200px] sm:max-w-none">{c.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* カード下部：直近引き落とし予定情報（[次回]タグ化で見切れゼロ） */}
                {nearestPayment && (
                  <div className="pt-2.5 border-t border-[var(--dads-gray-200)] flex items-center justify-between gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="dads-counter-badge px-1.5 py-0.5 text-[11px] shrink-0">
                        次回
                      </span>
                      <span className="font-bold text-[var(--dads-sumi-900)] truncate">
                        {nearestPayment.cardName}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[var(--dads-sumi-900)] flex items-center gap-1 shrink-0">
                      <span>{nearestPayment.nextDateFormatted}</span>
                      <span className="text-xs text-[var(--color-primary)] font-bold">
                        ({nearestPayment.isToday ? '本日' : nearestPayment.isTomorrow ? '明日' : `あと${nearestPayment.daysLeft}日`})
                      </span>
                    </span>
                  </div>
                )}

                {account.note && (
                  <p className="text-xs text-[var(--dads-sumi-700)] border-t border-[var(--dads-gray-200)] pt-2">
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
