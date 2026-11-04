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
    <div className="space-y-4 animate-fadeIn">
      {/* 画面見出し & プライマリアクション */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1a1f26] p-4 rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#101828] dark:text-white flex items-center gap-2">
            <Landmark className="h-5 w-5 text-[#0047AB] dark:text-[#5294e2]" />
            <span>引き落とし銀行口座管理</span>
          </h2>
          <p className="text-xs text-[#475467] dark:text-[#98a2b3] mt-0.5">
            クレジットカードの引き落とし先となる銀行口座を管理します
          </p>
        </div>

        <button
          onClick={onOpenAddAccount}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-[#0047AB] hover:bg-[#003882] text-white text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>銀行口座を追加</span>
        </button>
      </div>

      {/* 登録状況の統計ボックス */}
      <div className="grid grid-cols-2 gap-3 bg-white dark:bg-[#1a1f26] p-4 rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#475467] dark:text-[#98a2b3] block">登録口座数</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-[#101828] dark:text-white">
            {accounts.length} <span className="text-xs font-normal text-[#667085]">口座</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-[#475467] dark:text-[#98a2b3] block">連携中のカード</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-[#101828] dark:text-white">
            {cards.length} <span className="text-xs font-normal text-[#667085]">枚</span>
          </span>
        </div>
      </div>

      {/* 口座一覧グリッド */}
      {accounts.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-lg p-8 text-center space-y-3">
          <p className="text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3]">
            登録されている銀行口座はありません。
          </p>
          <button
            onClick={onOpenAddAccount}
            className="px-4 py-2 rounded-md bg-[#0047AB] hover:bg-[#003882] text-white text-xs font-bold shadow-xs"
          >
            口座を登録する
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {accounts.map((account) => {
            const linkedCards = cards.filter((c) => c.bankAccountId === account.id);

            return (
              <div
                key={account.id}
                className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 flex flex-col justify-between shadow-xs border-l-4"
                style={{
                  borderLeftColor: account.color || '#0047AB',
                }}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: account.color || '#0047AB' }}
                      />
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">
                          {account.name}
                        </h3>
                        <p className="text-[11px] text-[#667085] dark:text-[#8e98a8]">
                          {account.accountType || '普通口座'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-xs bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] text-[#344054] dark:text-[#cfd5e0]">
                      {linkedCards.length} 枚
                    </span>
                  </div>

                  {account.note && (
                    <p className="text-xs text-[#475467] dark:text-[#98a2b3] bg-[#f4f6f8] dark:bg-[#222730] p-2 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e]">
                      {account.note}
                    </p>
                  )}

                  {/* 紐づくカード */}
                  <div>
                    <span className="text-[10px] font-bold text-[#667085] dark:text-[#8e98a8] block mb-1">
                      引き落とし対象カード:
                    </span>
                    {linkedCards.length === 0 ? (
                      <span className="text-xs text-[#98a2b3] italic">紐づくカードなし</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {linkedCards.map((c) => (
                          <span
                            key={c.id}
                            className="text-[11px] bg-[#f4f6f8] dark:bg-[#222730] text-[#344054] dark:text-[#cfd5e0] px-2 py-0.5 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e] flex items-center gap-1"
                          >
                            <CardIcon className="h-3 w-3 text-[#0047AB] dark:text-[#5294e2]" />
                            <span>{c.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* アクション */}
                <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-[#d0d5dd]/40 dark:border-[#2e3642]">
                  <button
                    onClick={() => onEditAccount(account)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-medium text-[#344054] dark:text-[#cfd5e0] hover:bg-[#f4f6f8] dark:hover:bg-[#222730]"
                  >
                    <Pencil className="h-3.5 w-3.5 text-[#0047AB] dark:text-[#5294e2]" />
                    <span>編集</span>
                  </button>
                  <button
                    onClick={() => onDeleteAccount(account.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-medium text-[#d92d20] hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-[#d92d20]" />
                    <span>削除</span>
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
