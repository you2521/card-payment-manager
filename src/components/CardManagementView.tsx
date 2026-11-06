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
    <div className="space-y-3.5 animate-fadeIn">
      {/* DADS準拠の端正なセクション見出し（過剰な枠付きアイコンやバッジを排除） */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-xs bg-[var(--color-primary)] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">
            登録カード一覧
          </h2>
          <span className="text-xs font-mono text-[#667085] dark:text-[#98a2b3]">
            ({cards.length})
          </span>
        </div>

        <button
          onClick={onOpenAddCard}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg theme-bg-primary text-white text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          <Plus strokeWidth={1.75} className="h-3.5 w-3.5" />
          <span>カードを追加</span>
        </button>
      </div>

      {/* 登録カード0件のEmpty State */}
      {cards.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1f26] border border-[#d0d5dd] dark:border-[#2e3642] rounded-xl p-8 text-center space-y-3">
          <p className="text-xs sm:text-sm text-[#475467] dark:text-[#98a2b3]">
            登録されているクレジットカードはありません。
          </p>
          {accounts.length === 0 && onOpenAddAccount ? (
            <div className="space-y-2 max-w-sm mx-auto pt-2">
              <p className="text-[11px] text-[#b54708] dark:text-amber-300">
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
              className="px-4 py-2 rounded-lg theme-bg-primary text-white text-xs font-bold cursor-pointer"
            >
              カードを登録する
            </button>
          )}
        </div>
      ) : (
        /* 独立アイランドカードUI */
        <div className="space-y-2.5">
          {sortedCards.map((card) => {
            const account = getBankAccount(accounts, card.bankAccountId);
            const brandCfg = getBrandColorConfig(card.brandColor, isDark);
            const accColor = getAccessibleColorHex(account?.color, isDark);

            return (
              <div
                key={card.id}
                className="p-3 sm:p-4 rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] hover:border-[var(--color-primary)]/70 transition-all flex items-center justify-between gap-3 group"
              >
                {/* 左側：支払日アイキャッチ角丸タイル（高コントラストな2段構造に整理） */}
                <div className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[66px] h-[58px] sm:h-[64px] rounded-lg theme-bg-subtle border border-[var(--color-primary)]/20 text-center shrink-0 p-1">
                  <span className="text-[10px] font-bold text-[#475467] dark:text-[#cfd5e0] leading-none">
                    毎月
                  </span>
                  <span className="text-sm sm:text-base font-mono font-extrabold text-[var(--color-primary)] leading-tight mt-1.5">
                    {formatPaymentDay(card)}
                  </span>
                </div>

                {/* 中央：カード名 & 口座・締め日情報 */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: brandCfg.hex }}
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
                      <span className="text-[10px] text-[#475467] dark:text-[#cfd5e0] bg-[#f4f6f8] dark:bg-[#222730] px-1.5 py-0.5 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e] inline-flex items-center gap-1">
                        <Calendar strokeWidth={1.75} className="h-2.5 w-2.5 text-[#667085] dark:text-[#98a2b3]" />
                        <span>{card.closingDay}</span>
                      </span>
                    )}

                    {/* 例外的に休日補正をOFFにしているカードのみ控えめにタグ表示 */}
                    {card.adjustForBankHolidays === false && (
                      <span className="text-[10px] text-[#667085] dark:text-[#98a2b3] bg-[#f4f6f8] dark:bg-[#222730] px-1.5 py-0.5 rounded-xs border border-[#d0d5dd] dark:border-[#363f4e]">
                        休日補正なし
                      </span>
                    )}
                  </div>

                  {/* 口座名 ＆ メモ（「口座:」ラベルを撤廃して縦割れを防止し、線アイコン＋口座名で1行表示） */}
                  <div className="flex items-center gap-2 text-xs text-[#475467] dark:text-[#cfd5e0] min-w-0">
                    {account ? (
                      <div className="inline-flex items-center gap-1.5 min-w-0">
                        <Landmark
                          strokeWidth={1.75}
                          className="h-3.5 w-3.5 shrink-0"
                          style={{ color: accColor }}
                        />
                        <span className="font-medium text-[#344054] dark:text-[#cfd5e0] truncate">
                          {account.name}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#d92d20] dark:text-[#f87171] font-bold text-[11px]">
                        <AlertCircle strokeWidth={1.75} className="h-3.5 w-3.5 shrink-0" />
                        <span>口座未設定</span>
                      </span>
                    )}

                    {card.memo && (
                      <span className="text-[11px] text-[#667085] dark:text-[#98a2b3] truncate">
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
                    className="p-2 rounded-lg border border-[#d0d5dd]/80 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-white dark:hover:bg-[#2c333f] text-[#475467] dark:text-[#cfd5e0] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 transition-all cursor-pointer"
                  >
                    <Pencil strokeWidth={1.75} className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCard(card.id)}
                    title="カードを削除"
                    className="p-2 rounded-lg border border-[#d0d5dd]/80 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[#475467] dark:text-[#cfd5e0] hover:text-[#d92d20] dark:hover:text-[#f87171] hover:border-rose-300 transition-all cursor-pointer"
                  >
                    <Trash2 strokeWidth={1.75} className="h-4 w-4" />
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
