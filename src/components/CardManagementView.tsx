import React, { useMemo } from 'react';
import { CreditCard, BankAccount } from '../types';
import { formatPaymentDay, getBankAccount, sortCardsByPaymentDay } from '../utils/paymentUtils';
import { getBrandColorConfig } from '../utils/colors';
import { Plus, Pencil, Trash2, CreditCard as CardIcon, Calendar, Landmark, AlertCircle } from 'lucide-react';

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

  // 支払日順に安定ソート（4日 -> 10日 -> 27日 -> 月末）
  const sortedCards = useMemo(() => {
    return sortCardsByPaymentDay(cards);
  }, [cards]);

  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* ページタイトルヘッダー（参考画像風の縦アクセントバーを採用） */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4.5 rounded-full theme-bg-primary shrink-0" />
          <div className="flex h-7 w-7 items-center justify-center rounded-md theme-bg-subtle text-[var(--color-primary)]">
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
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg theme-bg-primary text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>カードを追加</span>
        </button>
      </div>

      {/* 登録カード0件のEmpty State */}
      {cards.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-xl p-8 text-center space-y-3 shadow-xs">
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
                className="px-4 py-2 rounded-lg border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-bold hover:bg-[#f4f6f8] dark:hover:bg-[#222730] cursor-pointer"
              >
                先に銀行口座を登録する
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAddCard}
              className="px-4 py-2 rounded-lg theme-bg-primary text-white text-xs font-bold shadow-xs cursor-pointer hover:opacity-90"
            >
              カードを登録する
            </button>
          )}
        </div>
      ) : (
        /* 参考画像スタイルの「ひとつひとつ独立したアイランドカードUI」 */
        <div className="space-y-2.5">
          {sortedCards.map((card) => {
            const account = getBankAccount(accounts, card.bankAccountId);
            const brandCfg = getBrandColorConfig(card.brandColor, isDark);

            return (
              <div
                key={card.id}
                className="p-3 sm:p-4 rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] shadow-xs hover:border-[var(--color-primary)]/70 transition-all flex items-center justify-between gap-3 group"
              >
                {/* 左側：支払日アイキャッチ角丸タイル（視線のアンカー） */}
                <div className="flex flex-col items-center justify-center min-w-[62px] sm:min-w-[68px] h-[62px] sm:h-[68px] rounded-lg theme-bg-subtle border border-[var(--color-primary)]/20 text-center shrink-0 p-1">
                  <span className="text-[9px] font-bold text-[#667085] dark:text-[#8e98a8] leading-none">
                    毎月
                  </span>
                  <span className="text-sm sm:text-base font-mono font-extrabold text-[var(--color-primary)] leading-tight mt-1">
                    {formatPaymentDay(card)}
                  </span>
                  {card.adjustForBankHolidays === false ? (
                    <span className="text-[7.5px] text-[#667085] dark:text-[#8e98a8] font-bold leading-none mt-0.5">
                      補正なし
                    </span>
                  ) : (
                    <span className="text-[7.5px] text-amber-700 dark:text-amber-400 font-bold leading-none mt-0.5">
                      休業日補正
                    </span>
                  )}
                </div>

                {/* 中央：カード名 & 口座・締め日情報 */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: brandCfg.hex || 'var(--color-primary)' }}
                    />
                    <button
                      type="button"
                      onClick={() => onEditCard(card)}
                      className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] hover:underline cursor-pointer text-left truncate"
                      title={`${card.name} を編集`}
                    >
                      {card.name}
                    </button>

                    {card.closingDay && (
                      <span className="text-[10px] text-[#667085] dark:text-[#8e98a8] bg-[#f4f6f8] dark:bg-[#222730] px-1.5 py-0.2 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e] inline-flex items-center gap-0.5">
                        <Calendar className="h-2.5 w-2.5 text-[#667085] dark:text-[#8e98a8]" />
                        <span>{card.closingDay}</span>
                      </span>
                    )}
                  </div>

                  {/* 口座名 ＆ メモ */}
                  <div className="flex items-center gap-2 text-xs text-[#475467] dark:text-[#98a2b3] flex-wrap">
                    <div className="inline-flex items-center gap-1">
                      <Landmark className="h-3 w-3 text-[var(--color-primary)] shrink-0" />
                      <span className="text-[11px] text-[#667085] dark:text-[#8e98a8]">口座:</span>
                      {account ? (
                        <span className="font-bold text-[#101828] dark:text-white inline-flex items-center gap-1">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: account.color || 'var(--color-primary)' }}
                          />
                          <span className="truncate max-w-[140px] sm:max-w-none">{account.name}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[#d92d20] font-bold text-[11px]">
                          <AlertCircle className="h-3 w-3" />
                          <span>口座未設定</span>
                        </span>
                      )}
                    </div>

                    {card.memo && (
                      <span className="text-[11px] text-[#667085] dark:text-[#8e98a8] truncate max-w-[160px] sm:max-w-none">
                        / {card.memo}
                      </span>
                    )}
                  </div>
                </div>

                {/* 右側アクション（押しやすい独立アイコンボタン） */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEditCard(card)}
                    title="カード情報を編集"
                    className="p-2 rounded-lg border border-[#d0d5dd]/70 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-white dark:hover:bg-[#2c333f] text-[#667085] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-all cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCard(card.id)}
                    title="カードを削除"
                    className="p-2 rounded-lg border border-[#d0d5dd]/70 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[#667085] hover:text-[#d92d20] hover:border-rose-300 transition-all cursor-pointer"
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