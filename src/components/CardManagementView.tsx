import React, { useMemo } from 'react';
import { CreditCard, BankAccount } from '../types';
import { formatPaymentDay, getBankAccount, sortCardsByPaymentDay } from '../utils/paymentUtils';
import { getBrandColorConfig, getAccessibleColorHex } from '../utils/colors';
import { Plus, Pencil, Trash2, Calendar, Landmark, AlertCircle } from 'lucide-react';

interface CardManagementViewProps {
  cards: CreditCard[];
  accounts: BankAccount[];
  isDark?: boolean;
  onOpenAddCard: () => void;
  onEditCard: (card: CreditCard) => void;
  onDeleteCard: (cardId: string) => void;
  onOpenAddAccount?: () => void;
}

export const CardManagementView: React.FC<CardManagementViewProps> = ({
  cards,
  accounts,
  isDark = false,
  onOpenAddCard,
  onEditCard,
  onDeleteCard,
  onOpenAddAccount,
}) => {
  // 支払日順に安定ソート（4日 -> 10日 -> 27日 -> 月末）
  const sortedCards = useMemo(() => {
    return sortCardsByPaymentDay(cards);
  }, [cards]);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* セクション見出し（文字サイズ拡大＆追加ボタン維持） */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 rounded-xs bg-[var(--color-primary)] shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-[#101828] dark:text-white">
            登録カード一覧
          </h2>
          <span className="text-sm font-mono font-bold text-[#475467] dark:text-[#98a2b3]">
            ({cards.length})
          </span>
        </div>

        <button
          onClick={onOpenAddCard}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg theme-bg-primary text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0"
        >
          <Plus strokeWidth={2} className="h-4 w-4" />
          <span>カードを追加</span>
        </button>
      </div>

      {/* 登録カード0件のEmpty State */}
      {cards.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-xl p-8 text-center space-y-3">
          <p className="text-sm sm:text-base text-[#475467] dark:text-[#98a2b3]">
            登録されているクレジットカードはありません。
          </p>
          {accounts.length === 0 && onOpenAddAccount ? (
            <div className="space-y-2.5 max-w-sm mx-auto pt-2">
              <p className="text-xs text-[#b54708] dark:text-amber-300 font-medium">
                ※ 先に引き落とし銀行口座を登録しておくと、カード登録時に口座を紐付けられます。
              </p>
              <button
                onClick={onOpenAddAccount}
                className="px-4 py-2 rounded-lg border border-[#d0d5dd] dark:border-[#363f4e] text-xs sm:text-sm font-bold hover:bg-[#f4f6f8] dark:hover:bg-[#222730] cursor-pointer"
              >
                先に銀行口座を登録する
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAddCard}
              className="px-5 py-2.5 rounded-lg theme-bg-primary text-white text-sm font-bold cursor-pointer"
            >
              カードを登録する
            </button>
          )}
        </div>
      ) : (
        /* 独立アイランドカードUI（文字サイズ拡大・高視認性） */
        <div className="space-y-3">
          {sortedCards.map((card) => {
            const account = getBankAccount(accounts, card.bankAccountId);
            const brandCfg = getBrandColorConfig(card.brandColor, isDark);
            const accColor = getAccessibleColorHex(account?.color, isDark);

            return (
              <div
                key={card.id}
                className="p-3.5 sm:p-4 rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] hover:border-[var(--color-primary)]/70 transition-all flex items-center justify-between gap-3.5 group shadow-xs"
              >
                {/* 左側：支払日タイル（大きな数字で一目でわかる視認性） */}
                <div className="flex flex-col items-center justify-center min-w-[68px] sm:min-w-[76px] h-[64px] sm:h-[72px] rounded-lg theme-bg-subtle border border-[var(--color-primary)]/20 text-center shrink-0 p-1.5">
                  <span className="text-[11px] sm:text-xs font-bold text-[#475467] dark:text-[#cfd5e0] leading-none">
                    毎月
                  </span>
                  <span className="text-base sm:text-lg font-mono font-black text-[var(--color-primary)] leading-tight mt-1.5">
                    {formatPaymentDay(card)}
                  </span>
                </div>

                {/* 中央：カード名 & 口座・締め日情報（文字拡大・濃淡のメリハリ） */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: brandCfg.hex }}
                    />
                    <button
                      type="button"
                      onClick={() => onEditCard(card)}
                      className="text-base sm:text-lg font-bold text-[#101828] dark:text-white hover:text-[var(--color-primary)] hover:underline cursor-pointer text-left truncate tracking-tight"
                      title={`${card.name} を編集`}
                    >
                      {card.name}
                    </button>

                    {card.closingDay && (
                      <span className="text-[11px] text-[#475467] dark:text-[#cfd5e0] bg-[#f4f6f8] dark:bg-[#222730] px-2 py-0.5 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e] inline-flex items-center gap-1 font-medium">
                        <Calendar strokeWidth={1.75} className="h-3 w-3 text-[#667085] dark:text-[#98a2b3]" />
                        <span>{card.closingDay}</span>
                      </span>
                    )}

                    {/* 休日補正OFFのカードのみ控えめにタグ表示 */}
                    {card.adjustForBankHolidays === false && (
                      <span className="text-[11px] text-[#667085] dark:text-[#98a2b3] bg-[#f4f6f8] dark:bg-[#222730] px-2 py-0.5 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e]">
                        休日補正なし
                      </span>
                    )}
                  </div>

                  {/* 口座名 ＆ メモ（文字を大きくハッキリと表示） */}
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#344054] dark:text-[#f0f2f5] min-w-0 flex-wrap">
                    {account ? (
                      <div className="inline-flex items-center gap-1.5 min-w-0">
                        <Landmark
                          strokeWidth={1.75}
                          className="h-4 w-4 shrink-0"
                          style={{ color: accColor }}
                        />
                        <span className="font-semibold text-[#101828] dark:text-white truncate">
                          {account.name}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#d92d20] dark:text-[#f87171] font-bold text-xs">
                        <AlertCircle strokeWidth={1.75} className="h-4 w-4 shrink-0" />
                        <span>口座未設定</span>
                      </span>
                    )}

                    {card.memo && (
                      <span className="text-xs text-[#667085] dark:text-[#98a2b3] truncate">
                        · {card.memo}
                      </span>
                    )}
                  </div>
                </div>

                {/* 右側アクション（押しやすい線アイコンボタン） */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEditCard(card)}
                    title="カード情報を編集"
                    className="p-2 sm:p-2.5 rounded-lg border border-[#d0d5dd]/80 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-white dark:hover:bg-[#2c333f] text-[#475467] dark:text-[#cfd5e0] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-all cursor-pointer"
                  >
                    <Pencil strokeWidth={1.75} className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCard(card.id)}
                    title="カードを削除"
                    className="p-2 sm:p-2.5 rounded-lg border border-[#d0d5dd]/80 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[#475467] dark:text-[#cfd5e0] hover:text-[#d92d20] dark:hover:text-[#f87171] hover:border-rose-300 transition-all cursor-pointer"
                  >
                    <Trash2 strokeWidth={1.75} className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
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
