import React from 'react';
import { CreditCard, BankAccount } from '../types';
import { formatPaymentDay, getBankAccount } from '../utils/paymentUtils';
import { getBrandColorConfig } from '../utils/colors';
import { Plus, Pencil, Trash2, CreditCard as CardIcon, Calendar } from 'lucide-react';

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
    <div className="space-y-3 animate-fadeIn">
      {/* スマートヘッダー（見出しと追加ボタンを1行に集約し、一覧性を最大化） */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0047AB]/10 text-[#0047AB] dark:bg-[#5294e2]/20 dark:text-[#5294e2]">
            <CardIcon className="h-4 w-4" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">
            登録カード一覧
          </h2>
          <span className="text-xs font-mono font-bold text-[#475467] dark:text-[#98a2b3] bg-[#f4f6f8] dark:bg-[#222730] px-2 py-0.5 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e]">
            {cards.length}枚
          </span>
        </div>

        <button
          onClick={onOpenAddCard}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#0047AB] hover:bg-[#003882] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>カードを追加</span>
        </button>
      </div>

      {/* 高一覧性スマートリスト（左の太いカラーバーを廃止し、端正なDADSリスト形式） */}
      {cards.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-lg p-8 text-center space-y-3 shadow-xs">
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
        <div className="rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] overflow-hidden shadow-xs divide-y divide-[#d0d5dd]/60 dark:divide-[#2e3642]">
          {cards.map((card) => {
            const account = getBankAccount(accounts, card.bankAccountId);
            const brandCfg = getBrandColorConfig(card.brandColor, isDark);

            return (
              <div
                key={card.id}
                className="p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-3 hover:bg-[#f9fafb] dark:hover:bg-[#20252e] transition-colors"
              >
                {/* 支払日バッジ（左端） */}
                <div className="flex flex-col items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-md bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd] dark:border-[#363f4e] shrink-0 font-bold">
                  <span className="text-[8px] text-[#667085] dark:text-[#8e98a8]">毎月</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#101828] dark:text-white leading-tight">
                    {formatPaymentDay(card)}
                  </span>
                </div>

                {/* カード情報（中央） */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: brandCfg.hex || '#0047AB' }}
                    />
                    <button
                      type="button"
                      onClick={() => onEditCard(card)}
                      className="text-sm font-bold text-[#101828] dark:text-white hover:text-[#0047AB] dark:hover:text-[#5294e2] hover:underline cursor-pointer text-left truncate"
                    >
                      {card.name}
                    </button>
                    {card.closingDay && (
                      <span className="text-[10px] text-[#667085] dark:text-[#8e98a8] bg-[#f4f6f8] dark:bg-[#222730] px-1.5 py-0.2 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e] inline-flex items-center gap-0.5">
                        <Calendar className="h-2.5 w-2.5" />
                        <span>{card.closingDay}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#475467] dark:text-[#98a2b3] flex-wrap">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <span className="text-[11px] text-[#667085] dark:text-[#8e98a8]">口座:</span>
                      {account ? (
                        <span className="text-[#101828] dark:text-white inline-flex items-center gap-1 font-bold">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: account.color || '#0047AB' }}
                          />
                          <span className="truncate max-w-[150px] sm:max-w-none">{account.name}</span>
                        </span>
                      ) : (
                        <span className="text-[#d92d20] font-bold">口座未設定</span>
                      )}
                    </span>

                    {card.memo && (
                      <span className="text-[11px] text-[#667085] dark:text-[#8e98a8] truncate max-w-[180px] sm:max-w-none">
                        / {card.memo}
                      </span>
                    )}
                  </div>
                </div>

                {/* 右側アクション（コンパクトなアイコンボタン） */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditCard(card)}
                    title="カード情報を編集"
                    className="p-2 rounded-md hover:bg-[#f4f6f8] dark:hover:bg-[#2c333f] text-[#667085] hover:text-[#0047AB] dark:text-[#8e98a8] dark:hover:text-[#5294e2] transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCard(card.id)}
                    title="カードを削除"
                    className="p-2 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[#667085] hover:text-[#d92d20] dark:text-[#8e98a8] dark:hover:text-[#d92d20] transition-colors"
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
