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
      {/* DADS セクション見出し（左 4px ソリッドバー + 追加ボタン維持） */}
      <div className="flex items-center justify-between pb-0.5">
        <div className="dads-section-header">
          <div className="flex items-center gap-2">
            <h2 className="dads-section-title">登録カード一覧</h2>
            <span className="dads-counter-badge">全 {cards.length} 枚</span>
          </div>
        </div>

        <button
          onClick={onOpenAddCard}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] theme-bg-primary text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0"
        >
          <Plus strokeWidth={2} className="h-4 w-4" />
          <span>カードを追加</span>
        </button>
      </div>

      {/* 登録カード0件のEmpty State */}
      {cards.length === 0 ? (
        <div className="dads-card p-8 text-center space-y-3">
          <p className="text-sm sm:text-base text-[var(--dads-sumi-700)]">
            登録されているクレジットカードはありません。
          </p>
          {accounts.length === 0 && onOpenAddAccount ? (
            <div className="space-y-2.5 max-w-sm mx-auto pt-2">
              <p className="text-xs text-[var(--dads-warning-text)] font-bold">
                ※ 先に引き落とし銀行口座を登録しておくと、カード登録時に口座を紐付けられます。
              </p>
              <button
                onClick={onOpenAddAccount}
                className="px-4 py-2 rounded-[4px] border border-[var(--dads-gray-300)] bg-[var(--dads-white)] text-xs sm:text-sm font-bold hover:bg-[var(--dads-gray-100)] cursor-pointer"
              >
                先に銀行口座を登録する
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAddCard}
              className="px-5 py-2.5 rounded-[8px] theme-bg-primary text-white text-sm font-bold cursor-pointer"
            >
              カードを登録する
            </button>
          )}
        </div>
      ) : (
        /* DADS カード一覧（oshi_remote の .video-item と同じ 2段レイアウトで見切れ・ドット改行を完全解消） */
        <div className="space-y-2.5">
          {sortedCards.map((card) => {
            const account = getBankAccount(accounts, card.bankAccountId);
            const brandCfg = getBrandColorConfig(card.brandColor, isDark);
            const accColor = getAccessibleColorHex(account?.color, isDark);

            return (
              <div
                key={card.id}
                className="dads-card p-3 sm:p-4 hover:border-[var(--color-primary)] transition-colors flex items-center gap-3 group"
              >
                {/* 左側：支払日タイル（DADS 4px 角丸、高視認性） */}
                <div
                  onClick={() => onEditCard(card)}
                  className="flex flex-col items-center justify-center min-w-[66px] sm:min-w-[74px] h-[60px] sm:h-[66px] rounded-[4px] theme-bg-subtle border text-center shrink-0 p-1.5 cursor-pointer"
                >
                  <span className="text-[11px] font-bold text-[var(--dads-sumi-700)] leading-none">
                    毎月
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-[var(--color-primary)] leading-tight mt-1">
                    {formatPaymentDay(card)}
                  </span>
                </div>

                {/* 右側コンテンツ（2段構成：上段=カード名に横幅100%を確保、下段=口座・タグ＋操作ボタン） */}
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                  {/* 上段：ドット + カード名（右端まで全幅を使えるため「ビックカメラSuicaカード」等も見切れゼロ） */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: brandCfg.hex }}
                    />
                    <button
                      type="button"
                      onClick={() => onEditCard(card)}
                      className="text-base sm:text-lg font-bold text-[var(--dads-sumi-900)] hover:text-[var(--color-primary)] hover:underline cursor-pointer text-left truncate tracking-tight leading-snug flex-1 min-w-0"
                      title={`${card.name} を編集`}
                    >
                      {card.name}
                    </button>
                  </div>

                  {/* 下段 (.bottom-bar)：左に口座名・締め日タグ、右にDADS 4px角丸アクションボタン */}
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      {account ? (
                        <div className="inline-flex items-center gap-1.5 min-w-0 text-xs sm:text-sm">
                          <Landmark
                            strokeWidth={1.75}
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: accColor }}
                          />
                          <span className="font-bold text-[var(--dads-sumi-900)] truncate max-w-[160px] sm:max-w-none">
                            {account.name}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[var(--dads-danger)] font-bold text-xs">
                          <AlertCircle strokeWidth={1.75} className="h-3.5 w-3.5 shrink-0" />
                          <span>口座未設定</span>
                        </span>
                      )}

                      {card.closingDay && (
                        <span className="dads-tag text-[11px] font-medium">
                          <Calendar strokeWidth={1.75} className="h-3 w-3 text-[var(--dads-sumi-700)]" />
                          <span>{card.closingDay}</span>
                        </span>
                      )}

                      {card.adjustForBankHolidays === false && (
                        <span className="dads-tag text-[11px] text-[var(--dads-sumi-700)]">
                          休日補正なし
                        </span>
                      )}

                      {card.memo && (
                        <span className="text-xs text-[var(--dads-sumi-700)] truncate">
                          · {card.memo}
                        </span>
                      )}
                    </div>

                    {/* 右端：DADS 4px角丸アクションボタン */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditCard(card)}
                        title="カード情報を編集"
                        className="dads-action-btn hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                      >
                        <Pencil strokeWidth={1.75} className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">編集</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCard(card.id)}
                        title="カードを削除"
                        className="dads-action-btn hover:border-[var(--dads-danger)] hover:text-[var(--dads-danger)]"
                      >
                        <Trash2 strokeWidth={1.75} className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">削除</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
