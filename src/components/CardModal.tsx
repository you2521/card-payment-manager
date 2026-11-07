import React, { useState, useEffect } from 'react';
import { X, CreditCard as CardIcon, Calendar, Check, Info, Trash2 } from 'lucide-react';
import { CreditCard, BankAccount, PaymentDayType } from '../types';
import { suggestCardColor } from '../utils/colorSuggester';
import { BRAND_COLORS, getBrandColorConfig } from '../utils/colors';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: Omit<CreditCard, 'id'>, cardId?: string) => void;
  editingCard?: CreditCard | null;
  bankAccounts: BankAccount[];
  onOpenAddAccountModal?: () => void;
  onDeleteCard?: (cardId: string) => void;
  isDark?: boolean;
}

const COLOR_OPTIONS = [
  { id: 'indigo', label: 'インディゴ', bg: 'bg-indigo-600' },
  { id: 'blue', label: 'ブルー', bg: 'bg-blue-600' },
  { id: 'cyan', label: 'シアン', bg: 'bg-cyan-600' },
  { id: 'teal', label: 'ティール', bg: 'bg-teal-600' },
  { id: 'emerald', label: 'エメラルド', bg: 'bg-emerald-600' },
  { id: 'amber', label: 'アンバー', bg: 'bg-amber-600' },
  { id: 'orange', label: 'オレンジ', bg: 'bg-orange-600' },
  { id: 'rose', label: 'ローズ', bg: 'bg-rose-600' },
  { id: 'purple', label: 'パープル', bg: 'bg-purple-600' },
  { id: 'fuchsia', label: 'ピンク', bg: 'bg-fuchsia-600' },
  { id: 'slate', label: 'スレート', bg: 'bg-slate-600' },
  { id: 'gold', label: 'ゴールド', bg: 'bg-yellow-600' },
];

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCard,
  bankAccounts,
  onOpenAddAccountModal,
  onDeleteCard,
  isDark = false,
}) => {
  const [name, setName] = useState('');
  const [paymentDayType, setPaymentDayType] = useState<PaymentDayType>('day');
  const [paymentDayValue, setPaymentDayValue] = useState<number>(4);
  const [bankAccountId, setBankAccountId] = useState('');
  const [closingDay, setClosingDay] = useState('');
  const [brandColor, setBrandColor] = useState('indigo');
  const [memo, setMemo] = useState('');
  const [adjustForBankHolidays, setAdjustForBankHolidays] = useState<boolean>(true);
  const [error, setError] = useState('');

  const suggestion = suggestCardColor(name);

  const handleNameChange = (val: string) => {
    setName(val);
    const sugg = suggestCardColor(val);
    if (sugg && !editingCard) {
      setBrandColor(sugg.colorId);
    }
  };

  useEffect(() => {
    if (editingCard) {
      setName(editingCard.name);
      setPaymentDayType(editingCard.paymentDayType);
      setPaymentDayValue(editingCard.paymentDayValue ?? 10);
      setBankAccountId(editingCard.bankAccountId);
      setClosingDay(editingCard.closingDay || '');
      setBrandColor(editingCard.brandColor || 'indigo');
      setMemo(editingCard.memo || '');
      setAdjustForBankHolidays(editingCard.adjustForBankHolidays ?? true);
    } else {
      setName('');
      setPaymentDayType('day');
      setPaymentDayValue(4);
      setBankAccountId(bankAccounts[0]?.id || '');
      setClosingDay('');
      setBrandColor('indigo');
      setMemo('');
      setAdjustForBankHolidays(true);
    }
    setError('');
  }, [editingCard, isOpen, bankAccounts]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('カード名を入力してください。');
      return;
    }
    if (!bankAccountId) {
      setError('引き落とし口座を選択してください。口座が未登録の場合は先に口座を追加してください。');
      return;
    }

    onSave(
      {
        name: name.trim(),
        paymentDayType,
        paymentDayValue: paymentDayType === 'day' ? Number(paymentDayValue) : undefined,
        bankAccountId,
        closingDay: closingDay.trim() || undefined,
        brandColor,
        memo: memo.trim() || undefined,
        adjustForBankHolidays,
      },
      editingCard?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-[8px] border border-[var(--dads-gray-300)] bg-[var(--dads-white)] overflow-hidden text-[var(--dads-sumi-900)] animate-scaleIn">
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[var(--dads-gray-300)] bg-[var(--dads-gray-100)]">
          <div className="flex items-center gap-2">
            <CardIcon className="h-5 w-5 text-[var(--color-primary)]" />
            <h2 className="text-base sm:text-lg font-bold">
              {editingCard ? 'クレジットカード情報の変更' : 'クレジットカード新規登録'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="dads-action-btn px-2"
            title="閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* フォーム本文 */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-[4px] bg-[var(--dads-danger-bg)] border border-[var(--dads-danger)] text-[var(--dads-danger)] text-xs font-bold">
              {error}
            </div>
          )}

          {/* カード名 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[var(--dads-sumi-900)]">
                カード名
              </label>
              <span className="bg-[var(--dads-danger)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[3px]">
                必須
              </span>
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="例: 楽天カード, 三井住友カード, JALカード"
              className="w-full rounded-[4px] bg-[var(--dads-white)] border border-[var(--dads-gray-300)] px-3 py-2 text-sm text-[var(--dads-sumi-900)] placeholder-[var(--dads-sumi-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            {suggestion && (
              <div className="mt-1.5 flex items-center justify-between text-xs px-2.5 py-1.5 rounded-[4px] bg-[var(--dads-warning-bg)] border border-[var(--dads-warning-border)] text-[var(--dads-warning-text)]">
                <span className="flex items-center gap-1 font-medium">
                  <Info strokeWidth={1.75} className="h-3.5 w-3.5" />
                  <span>おすすめ色: <strong>{suggestion.label}</strong> ({suggestion.reason})</span>
                </span>
                {brandColor !== suggestion.colorId && (
                  <button
                    type="button"
                    onClick={() => setBrandColor(suggestion.colorId)}
                    className="font-bold underline ml-2 cursor-pointer"
                  >
                    適用
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 支払日設定 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-[var(--dads-sumi-900)]">
                支払日（引き落とし日）
              </label>
              <span className="bg-[var(--dads-danger)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[3px]">
                必須
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentDayType('day')}
                className={`p-2.5 rounded-[4px] border text-xs font-bold transition-all text-center cursor-pointer ${
                  paymentDayType === 'day'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] dark:bg-[var(--color-primary-subtle-dark)] text-[var(--color-primary)]'
                    : 'border-[var(--dads-gray-300)] bg-[var(--dads-white)] text-[var(--dads-sumi-700)]'
                }`}
              >
                毎月指定日（1〜31日）
              </button>
              <button
                type="button"
                onClick={() => setPaymentDayType('end_of_month')}
                className={`p-2.5 rounded-[4px] border text-xs font-bold transition-all text-center cursor-pointer ${
                  paymentDayType === 'end_of_month'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] dark:bg-[var(--color-primary-subtle-dark)] text-[var(--color-primary)]'
                    : 'border-[var(--dads-gray-300)] bg-[var(--dads-white)] text-[var(--dads-sumi-700)]'
                }`}
              >
                毎月末日
              </button>
            </div>

            {paymentDayType === 'day' && (
              <div className="flex items-center gap-2 bg-[var(--dads-gray-100)] p-2.5 rounded-[4px] border border-[var(--dads-gray-300)]">
                <span className="text-xs font-bold text-[var(--dads-sumi-700)]">毎月</span>
                <select
                  value={paymentDayValue}
                  onChange={(e) => setPaymentDayValue(Number(e.target.value))}
                  className="rounded-[4px] bg-[var(--dads-white)] border border-[var(--dads-gray-300)] px-3 py-1.5 text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}日
                    </option>
                  ))}
                </select>
                <span className="text-xs font-bold text-[var(--dads-sumi-700)]">に引き落とし</span>
              </div>
            )}

            {/* カード個別：土日祝日の営業日補正トグル (DADS Switch) */}
            <div className="flex items-center justify-between p-2.5 rounded-[4px] border border-[var(--dads-gray-300)] bg-[var(--dads-gray-100)]/60 transition-colors">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[var(--dads-sumi-900)] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                  <span>土日・祝日の引き落とし日補正</span>
                </div>
                <p className="text-[11px] text-[var(--dads-sumi-700)]">
                  {adjustForBankHolidays
                    ? '支払日が休日の場合は翌営業日に自動シフト'
                    : '休日でもシフトせず該当日付のまま表示'}
                </p>
              </div>
              <label className="dads-switch">
                <input
                  type="checkbox"
                  checked={adjustForBankHolidays}
                  onChange={(e) => setAdjustForBankHolidays(e.target.checked)}
                />
                <span className="dads-switch-track">
                  <span className="dads-switch-thumb" />
                </span>
              </label>
            </div>
          </div>

          {/* 引き落とし口座 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[var(--dads-sumi-900)]">
                引き落とし銀行口座
              </label>
              <div className="flex items-center gap-2">
                {onOpenAddAccountModal && (
                  <button
                    type="button"
                    onClick={onOpenAddAccountModal}
                    className="text-xs font-bold text-[var(--color-primary)] underline cursor-pointer"
                  >
                    + 口座を新規追加
                  </button>
                )}
                <span className="bg-[var(--dads-danger)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[3px]">
                  必須
                </span>
              </div>
            </div>

            {bankAccounts.length === 0 ? (
              <div className="p-3 rounded-[4px] bg-[var(--dads-warning-bg)] border border-[var(--dads-warning-border)] text-[var(--dads-warning-text)] text-xs space-y-1.5">
                <p className="font-bold">引き落とし口座がまだ登録されていません。</p>
                <p>先に銀行口座を登録してください。</p>
                {onOpenAddAccountModal && (
                  <button
                    type="button"
                    onClick={onOpenAddAccountModal}
                    className="px-3 py-1.5 theme-bg-primary text-white text-xs font-bold rounded-[4px] cursor-pointer"
                  >
                    銀行口座を登録する
                  </button>
                )}
              </div>
            ) : (
              <select
                required
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="w-full rounded-[4px] bg-[var(--dads-white)] border border-[var(--dads-gray-300)] px-3 py-2 text-sm text-[var(--dads-sumi-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="">選択してください</option>
                {bankAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} {acc.accountType ? `(${acc.accountType})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 締め日（任意） */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[var(--dads-sumi-900)]">
                締め日
              </label>
              <span className="dads-tag text-[10px] py-0.5">
                任意
              </span>
            </div>
            <input
              type="text"
              value={closingDay}
              onChange={(e) => setClosingDay(e.target.value)}
              placeholder="例: 前月15日締め, 当月末日締め"
              className="w-full rounded-[4px] bg-[var(--dads-white)] border border-[var(--dads-gray-300)] px-3 py-2 text-sm text-[var(--dads-sumi-900)] placeholder-[var(--dads-sumi-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* カラー設定（任意） */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[var(--dads-sumi-900)]">
                カードカラー
              </label>
              <label className="flex items-center gap-1 text-xs text-[var(--dads-sumi-700)] cursor-pointer">
                <span>カスタム色:</span>
                <input
                  type="color"
                  value={brandColor.startsWith('#') ? brandColor : (BRAND_COLORS[brandColor]?.hex || '#0047AB')}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-5 h-5 rounded-[3px] border-0 cursor-pointer p-0 bg-transparent"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setBrandColor(c.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border text-xs transition-all cursor-pointer ${
                    brandColor === c.id
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] dark:bg-[var(--color-primary-subtle-dark)] text-[var(--color-primary)] font-bold'
                      : 'border-[var(--dads-gray-300)] text-[var(--dads-sumi-900)]'
                  }`}
                >
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: getBrandColorConfig(c.id, isDark).hex }} />
                  <span>{c.label}</span>
                  {brandColor === c.id && <Check className="h-3 w-3 text-[var(--color-primary)]" />}
                </button>
              ))}
            </div>
          </div>

          {/* メモ（任意） */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[var(--dads-sumi-900)]">
                メモ・用途
              </label>
              <span className="dads-tag text-[10px] py-0.5">
                任意
              </span>
            </div>
            <textarea
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="例: 固定費引き落とし用、ポイント特約店用"
              className="w-full rounded-[4px] bg-[var(--dads-white)] border border-[var(--dads-gray-300)] px-3 py-2 text-sm text-[var(--dads-sumi-900)] placeholder-[var(--dads-sumi-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            />
          </div>

          {/* フッター操作ボタン */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--dads-gray-300)]">
            <div>
              {editingCard && onDeleteCard && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCard(editingCard.id);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-[4px] border border-[var(--dads-danger)] text-[var(--dads-danger)] hover:bg-[var(--dads-danger-bg)] text-xs font-bold cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>削除する</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-[4px] border border-[var(--dads-gray-300)] bg-[var(--dads-white)] text-xs font-bold text-[var(--dads-sumi-900)] hover:bg-[var(--dads-gray-100)] cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={bankAccounts.length === 0}
                className="px-5 py-2 rounded-[4px] theme-bg-primary text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {editingCard ? '更新する' : '登録する'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
