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
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#202124] p-3 sm:p-4 rounded-2xl border border-[#dadce0] dark:border-[#3c4043] shadow-sm smooth-card">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shrink-0">
            <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#e8eaed]">引き落とし銀行口座管理</h2>
            <p className="text-xs text-slate-500 dark:text-[#9aa0a6]">口座情報の登録・編集・カラー設定</p>
          </div>
        </div>

        <button
          onClick={onOpenAddAccount}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all duration-200 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>銀行口座を追加</span>
        </button>
      </div>

      {/* Wallet Summary Stats Box */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-white dark:bg-[#202124] p-3.5 sm:p-4 rounded-2xl border border-[#dadce0] dark:border-[#3c4043] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shrink-0">
            <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-[#9aa0a6] uppercase tracking-wider block">登録銀行口座</span>
            <span className="text-lg sm:text-2xl font-black font-mono text-slate-900 dark:text-white">{accounts.length} <span className="text-xs font-normal text-slate-500 dark:text-[#9aa0a6]">行</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shrink-0">
            <CardIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-[#9aa0a6] uppercase tracking-wider block">管理クレジットカード</span>
            <span className="text-lg sm:text-2xl font-black font-mono text-slate-900 dark:text-white">{cards.length} <span className="text-xs font-normal text-slate-500 dark:text-[#9aa0a6]">枚</span></span>
          </div>
        </div>
      </div>

      {/* Account List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {accounts.map((account) => {
          const linkedCards = cards.filter((c) => c.bankAccountId === account.id);

          return (
            <div
              key={account.id}
              className="rounded-2xl border bg-white dark:bg-[#202124] p-3 sm:p-4 flex flex-col justify-between shadow-sm hover:border-blue-400 dark:hover:border-[#5f6368] transition-all space-y-2.5 sm:space-y-3"
              style={{
                borderColor: account.color || undefined,
                borderWidth: account.color ? '1.5px' : undefined,
              }}
            >
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 rounded-xl text-white shadow-sm shrink-0"
                      style={{ backgroundColor: account.color || '#3b82f6' }}
                    >
                      <Landmark className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{account.name}</h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#9aa0a6]">
                        {account.accountType || '普通口座'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] sm:text-xs font-mono font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 dark:bg-[#303134] text-slate-700 dark:text-[#e8eaed] border border-slate-200 dark:border-[#3c4043] shrink-0">
                    {linkedCards.length} Cards
                  </span>
                </div>

                {account.note && (
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-[#9aa0a6] bg-slate-50 dark:bg-[#303134] p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-[#3c4043]">
                    {account.note}
                  </p>
                )}

                {/* Linked cards list preview */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#9aa0a6] block mb-1">
                    紐づくカード:
                  </span>
                  {linkedCards.length === 0 ? (
                    <span className="text-xs text-slate-400 dark:text-[#9aa0a6] italic">登録カードなし</span>
                  ) : (
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {linkedCards.map((c) => (
                        <span
                          key={c.id}
                          className="text-[11px] bg-slate-100 dark:bg-[#303134] text-slate-800 dark:text-[#e8eaed] px-2 py-0.5 rounded-lg border border-slate-200 dark:border-[#3c4043] flex items-center gap-1"
                        >
                          <CardIcon className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>{c.name}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1 pt-3 border-t border-slate-200 dark:border-[#3c4043]">
                <button
                  onClick={() => onEditAccount(account)}
                  title="編集"
                  className="p-2 rounded-full hover:bg-blue-500/10 text-slate-400 dark:text-[#9aa0a6] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteAccount(account.id)}
                  title="削除"
                  className="p-2 rounded-full hover:bg-rose-500/10 text-slate-400 dark:text-[#9aa0a6] hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
