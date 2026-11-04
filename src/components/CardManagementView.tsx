import React from 'react';
import { CreditCard, BankAccount } from '../types';
import { formatPaymentDay, getBankAccount } from '../utils/paymentUtils';
import { getBrandColorConfig } from '../utils/colors';
import { Plus, Pencil, Trash2, CreditCard as CardIcon, Landmark, Calendar } from 'lucide-react';

interface CardManagementViewProps {
  cards: CreditCard[];
  accounts: BankAccount[];
  onOpenAddCard: () => void;
  onEditCard: (card: CreditCard) => void;
  onDeleteCard: (cardId: string) => void;
  onOpenAddAccount?: () => void;
}

export const CardManagementView: React.FC<CardManagementViewProps> = ({
  cards,
  accounts,
  onOpenAddCard,
  onEditCard,
  onDeleteCard,
  onOpenAddAccount,
}) => {
  const isDark = typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 画面見出し & プライマリアクション */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1a1f26] p-4 rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#101828] dark:text-white flex items-center gap-2">
            <CardIcon className="h-5 w-5 text-[#0047AB] dark:text-[#5294e2]" />
            <span>クレジットカード管理</span>
          </h2>
          <p className="text-xs text-[#475467] dark:text-[#98a2b3] mt-0.5">
            保有しているクレジットカードの支払日や引き落とし口座を管理します
          </p>
        </div>

        <button
          onClick={onOpenAddCard}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-[#0047AB] hover:bg-[#003882] text-white text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>クレジットカードを追加</span>
        </button>
      </div>

      {/* 登録状況の統計ボックス */}
      <div className="grid grid-cols-2 gap-3 bg-white dark:bg-[#1a1f26] p-4 rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] shadow-xs">
        <div>
          <span className="text-[11px] font-bold text-[#475467] dark:text-[#98a2b3] block">登録カード数</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-[#101828] dark:text-white">
            {cards.length} <span className="text-xs font-normal text-[#667085]">枚</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-[#475467] dark:text-[#98a2b3] block">連携可能な口座</span>
          <span className="text-xl sm:text-2xl font-black font-mono text-[#101828] dark:text-white">
            {accounts.length} <span className="text-xs font-normal text-[#667085]">口座</span>
          </span>
        </div>
      </div>

      {/* 登録カード一覧 */}
      <div className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-[#d0d5dd] dark:border-[#2e3642] bg-[#f4f6f8] dark:bg-[#222730] flex items-center justify-between">
          <span className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
            登録済みカード一覧 ({cards.length}件)
          </span>
        </div>

        {cards.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3]">
              登録されているクレジットカードはありません。
            </p>
            {accounts.length === 0 && onOpenAddAccount ? (
              <div className="space-y-2 max-w-sm mx-auto pt-2">
                <p className="text-[11px] text-[#b54708]">
                  ※ 先に引き落とし銀行口座を登録しておくと、カード登録時に口座を紐付けられます。
                </p>
                <button
                  onClick={onOpenAddAccount}
                  className="px-4 py-2 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-bold hover:bg-[#f4f6f8] dark:hover:bg-[#222730]"
                >
                  先に銀行口座を登録する
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAddCard}
                className="px-4 py-2 rounded-md bg-[#0047AB] hover:bg-[#003882] text-white text-xs font-bold shadow-xs"
              >
                カードを登録する
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#d0d5dd]/60 dark:divide-[#2e3642]">
            {cards.map((card) => {
              const account = getBankAccount(accounts, card.bankAccountId);
              const brandCfg = getBrandColorConfig(card.brandColor, isDark);

              return (
                <div
                  key={card.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fcfcfd] dark:hover:bg-[#20252e] transition-colors border-l-4"
                  style={{
                    borderLeftColor: brandCfg.hex || '#0047AB',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* 支払日バッジ */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-md bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] shrink-0 font-bold">
                      <span className="text-[8px] text-[#667085] dark:text-[#8e98a8]">毎月</span>
                      <span className="text-xs sm:text-sm font-mono font-bold text-[#101828] dark:text-white">
                        {formatPaymentDay(card)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">
                          {card.name}
                        </h3>
                        <span className="text-[10px] text-[#475467] dark:text-[#98a2b3] bg-[#f4f6f8] dark:bg-[#222730] px-1.5 py-0.5 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e]">
                          {brandCfg.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#475467] dark:text-[#98a2b3]">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <span>引き落とし口座:</span>
                          {account ? (
                            <strong className="text-[#101828] dark:text-white inline-flex items-center gap-1 font-bold">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: account.color || '#0047AB' }} />
                              <span>{account.name}</span>
                            </strong>
                          ) : (
                            <strong className="text-[#d92d20] font-bold">口座未設定</strong>
                          )}
                        </span>

                        {card.closingDay && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#667085] dark:text-[#8e98a8]">
                            <Calendar className="h-3 w-3" />
                            <span>締め日: {card.closingDay}</span>
                          </span>
                        )}
                      </div>

                      {card.memo && (
                        <p className="text-[11px] text-[#667085] dark:text-[#8e98a8] pt-0.5">{card.memo}</p>
                      )}
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#d0d5dd]/40 dark:border-[#2e3642]">
                    <button
                      onClick={() => onEditCard(card)}
                      title="編集"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-medium text-[#344054] dark:text-[#cfd5e0] hover:bg-[#f4f6f8] dark:hover:bg-[#222730]"
                    >
                      <Pencil className="h-3.5 w-3.5 text-[#0047AB] dark:text-[#5294e2]" />
                      <span>編集</span>
                    </button>
                    <button
                      onClick={() => onDeleteCard(card.id)}
                      title="削除"
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
    </div>
  );
};
