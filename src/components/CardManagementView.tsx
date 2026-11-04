import React from 'react';
import { CreditCard, BankAccount } from '../types';
import { formatPaymentDay, getBankAccount } from '../utils/paymentUtils';
import { getBrandColorConfig } from '../utils/colors';
import { Plus, Pencil, Trash2, CreditCard as CardIcon, Landmark, Info, Calendar } from 'lucide-react';

interface CardManagementViewProps {
  cards: CreditCard[];
  accounts: BankAccount[];
  onOpenAddCard: () => void;
  onEditCard: (card: CreditCard) => void;
  onDeleteCard: (cardId: string) => void;
}

export const CardManagementView: React.FC<CardManagementViewProps> = ({
  cards,
  accounts,
  onOpenAddCard,
  onEditCard,
  onDeleteCard,
}) => {
  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#202124] p-3 sm:p-4 rounded-2xl border border-[#dadce0] dark:border-[#3c4043] shadow-sm smooth-card">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shrink-0">
            <CardIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#e8eaed]">クレジットカード管理</h2>
            <p className="text-xs text-slate-500 dark:text-[#9aa0a6]">カード情報の登録・編集・口座紐付け</p>
          </div>
        </div>

        <button
          onClick={onOpenAddCard}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all duration-200 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>クレジットカードを追加</span>
        </button>
      </div>

      {/* Wallet Summary Stats Box */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-white dark:bg-[#202124] p-3.5 sm:p-4 rounded-2xl border border-[#dadce0] dark:border-[#3c4043] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shrink-0">
            <CardIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-[#9aa0a6] uppercase tracking-wider block">管理クレジットカード</span>
            <span className="text-lg sm:text-2xl font-black font-mono text-slate-900 dark:text-white">{cards.length} <span className="text-xs font-normal text-slate-500 dark:text-[#9aa0a6]">枚</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shrink-0">
            <Landmark className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-[#9aa0a6] uppercase tracking-wider block">連携引き落とし口座</span>
            <span className="text-lg sm:text-2xl font-black font-mono text-slate-900 dark:text-white">{accounts.length} <span className="text-xs font-normal text-slate-500 dark:text-[#9aa0a6]">行</span></span>
          </div>
        </div>
      </div>

      {/* Cards Table / List */}
      <div className="rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] overflow-hidden shadow-sm">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[#dadce0] dark:border-[#3c4043] bg-slate-50 dark:bg-[#171717] flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-[#9aa0a6] uppercase tracking-wider">
            登録済みカード一覧 ({cards.length}件)
          </span>
        </div>

        {cards.length === 0 ? (
          <div className="p-6 sm:p-8 text-center space-y-3">
            <p className="text-sm text-slate-500 dark:text-[#9aa0a6]">登録されたクレジットカードはありません。</p>
            <button
              onClick={onOpenAddCard}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              カードを追加する
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#dadce0] dark:divide-[#3c4043]">
            {cards.map((card) => {
              const account = getBankAccount(accounts, card.bankAccountId);
              const brandCfg = getBrandColorConfig(card.brandColor, isDark);
              return (
                <div
                  key={card.id}
                  className="relative overflow-hidden p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50 dark:hover:bg-[#282a2d] transition-colors pl-5 sm:pl-6 border-b border-[#dadce0] dark:border-[#3c4043] last:border-b-0"
                  style={{
                    borderLeftColor: brandCfg.hex,
                    borderLeftWidth: '6px',
                  }}
                >
                  {/* Left brand color strip */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-2 transition-colors"
                    style={{ backgroundColor: brandCfg.hex }}
                  />

                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Payment Badge */}
                    <div
                      className="flex flex-col items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-xl border shrink-0 font-bold"
                      style={{
                        backgroundColor: `${brandCfg.hex}18`,
                        borderColor: `${brandCfg.hex}50`,
                        color: brandCfg.hex,
                      }}
                    >
                      <span className="text-[8px] text-slate-500 dark:text-[#9aa0a6] uppercase font-bold">毎月</span>
                      <span className="text-xs sm:text-sm font-mono font-bold">{formatPaymentDay(card)}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{card.name}</h3>

                        {/* Brand Color Tag */}
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm shrink-0"
                          style={brandCfg.badgeStyle}
                        >
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: brandCfg.hex }} />
                          <span>{brandCfg.label}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700 dark:text-[#e8eaed]">
                        <span
                          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold shadow-sm transition-colors"
                          style={{
                            backgroundColor: isDark ? '#2a2d32' : '#f1f5f9',
                            borderColor: account && account.color ? account.color : (isDark ? '#4b5563' : '#cbd5e1'),
                            color: isDark ? '#ffffff' : '#0f172a',
                          }}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: account?.color || '#3b82f6' }}
                          />
                          <span>口座:</span>
                          <strong className="text-slate-900 dark:text-white">{account ? account.name : '未登録'}</strong>
                        </span>

                        {card.closingDay && (
                          <span className="flex items-center gap-1 text-slate-500 dark:text-[#9aa0a6] text-[11px] bg-slate-100 dark:bg-[#303134] px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#3c4043]">
                            <Calendar className="h-3 w-3 text-slate-400 dark:text-[#9aa0a6]" />
                            <span>締め日: {card.closingDay}</span>
                          </span>
                        )}
                      </div>

                      {card.memo && (
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#9aa0a6] pt-0.5 flex items-center gap-1">
                          <Info className="h-3 w-3 text-slate-400 dark:text-[#9aa0a6] shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-none">{card.memo}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Edit / Delete Buttons */}
                  <div className="flex items-center justify-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-[#3c4043]">
                    <button
                      onClick={() => onEditCard(card)}
                      title="編集"
                      className="p-2 rounded-full hover:bg-blue-500/10 text-slate-400 dark:text-[#9aa0a6] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCard(card.id)}
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
        )}
      </div>
    </div>
  );
};

