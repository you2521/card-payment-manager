import React from 'react';
import { BankAccount, CreditCard } from '../types';
import { Plus, Pencil, Trash2, Landmark, CreditCard as CardIcon } from 'lucide-react';

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
  return (
    <div className="space-y-3 animate-fadeIn">
      {/* スマートヘッダー（見出しと追加ボタンを1行に集約し、一覧性を最大化） */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
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
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md theme-bg-primary text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>口座を追加</span>
        </button>
      </div>

      {/* 高一覧性スマートリスト（左の太いカラーバーを廃止し、端正なDADSリスト形式） */}
      {accounts.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-lg p-8 text-center space-y-3 shadow-xs">
          <p className="text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3]">
            登録されている銀行口座はありません。
          </p>
          <button
            onClick={onOpenAddAccount}
            className="px-4 py-2 rounded-md theme-bg-primary text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            口座を登録する
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] overflow-hidden shadow-xs divide-y divide-[#d0d5dd]/60 dark:divide-[#2e3642]">
          {accounts.map((account) => {
            const linkedCards = cards.filter((c) => c.bankAccountId === account.id);

            return (
              <div
                key={account.id}
                className="p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 hover:bg-[#f9fafb] dark:hover:bg-[#20252e] transition-colors"
              >
                {/* 口座情報（左側） */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: account.color || 'var(--color-primary)' }}
                    />
                    <button
                      type="button"
                      onClick={() => onEditAccount(account)}
                      className="text-sm font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] hover:underline cursor-pointer text-left truncate"
                    >
                      {account.name}
                    </button>
                    <span className="text-[10px] text-[#667085] dark:text-[#8e98a8] bg-[#f4f6f8] dark:bg-[#222730] px-1.5 py-0.2 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e]">
                      {account.accountType || '普通'}
                    </span>
                  </div>

                  {/* 連携カード（インライン表示で縦幅を節約） */}
                  <div className="flex items-center gap-1.5 text-xs text-[#475467] dark:text-[#98a2b3] flex-wrap">
                    <span className="text-[11px] text-[#667085] dark:text-[#8e98a8]">紐づくカード:</span>
                    {linkedCards.length === 0 ? (
                      <span className="text-[11px] text-[#98a2b3] italic">未設定</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {linkedCards.map((c) => (
                          <span
                            key={c.id}
                            className="inline-flex items-center gap-1 text-[11px] bg-[#f4f6f8] dark:bg-[#222730] text-[#344054] dark:text-[#cfd5e0] px-1.5 py-0.2 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e]"
                          >
                            <CardIcon className="h-3 w-3 text-[var(--color-primary)]" />
                            <span className="truncate max-w-[130px] sm:max-w-none">{c.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {account.note && (
                    <p className="text-[11px] text-[#667085] dark:text-[#8e98a8] truncate max-w-md">
                      {account.note}
                    </p>
                  )}
                </div>

                {/* 右側アクション（コンパクトなアイコンボタンで横幅・縦幅を最適化） */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditAccount(account)}
                    title="口座情報を編集"
                    className="p-2 rounded-md hover:bg-[#f4f6f8] dark:hover:bg-[#2c333f] text-[#667085] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteAccount(account.id)}
                    title="口座を削除"
                    className="p-2 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[#667085] hover:text-[#d92d20] transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
