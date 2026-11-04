import React, { useState, useEffect } from 'react';
import { X, CreditCard as CardIcon, Landmark, Calendar, FileText, Check, Sparkles, Trash2 } from 'lucide-react';
import { CreditCard, BankAccount, PaymentDayType } from '../types';
import { suggestCardColor } from '../utils/colorSuggester';
import { BRAND_COLORS } from '../utils/colors';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: Omit<CreditCard, 'id'>, cardId?: string) => void;
  editingCard?: CreditCard | null;
  bankAccounts: BankAccount[];
  onOpenAddAccountModal?: () => void;
  onDeleteCard?: (cardId: string) => void;
}

const COLOR_OPTIONS = [
  { id: 'indigo', label: 'インディゴ', bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-400' },
  { id: 'blue', label: 'ブルー', bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-400' },
  { id: 'cyan', label: 'シアン', bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-400' },
  { id: 'teal', label: 'ティール', bg: 'bg-teal-500', border: 'border-teal-500', text: 'text-teal-400' },
  { id: 'emerald', label: 'エメラルド', bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-400' },
  { id: 'amber', label: 'アンバー', bg: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-400' },
  { id: 'orange', label: 'オレンジ', bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-400' },
  { id: 'rose', label: 'ローズ', bg: 'bg-rose-500', border: 'border-rose-500', text: 'text-rose-400' },
  { id: 'purple', label: 'パープル', bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-400' },
  { id: 'fuchsia', label: 'ピンク', bg: 'bg-fuchsia-500', border: 'border-fuchsia-500', text: 'text-fuchsia-400' },
  { id: 'slate', label: 'スレート', bg: 'bg-slate-500', border: 'border-slate-500', text: 'text-slate-400' },
  { id: 'gold', label: 'ゴールド', bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-400' },
];

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCard,
  bankAccounts,
  onOpenAddAccountModal,
  onDeleteCard,
}) => {
  const [name, setName] = useState('');
  const [paymentDayType, setPaymentDayType] = useState<PaymentDayType>('day');
  const [paymentDayValue, setPaymentDayValue] = useState<number>(4);
  const [bankAccountId, setBankAccountId] = useState('');
  const [closingDay, setClosingDay] = useState('');
  const [brandColor, setBrandColor] = useState('indigo');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');

  const suggestion = suggestCardColor(name);

  // Auto-apply suggested color if name matches and user hasn't typed much else or on new card
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
    } else {
      // Defaults for new card
      setName('');
      setPaymentDayType('day');
      setPaymentDayValue(4);
      setBankAccountId(bankAccounts[0]?.id || '');
      setClosingDay('');
      setBrandColor('indigo');
      setMemo('');
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
      setError('引き落とし口座を選択してください。');
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
      },
      editingCard?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] shadow-2xl overflow-hidden text-slate-900 dark:text-[#e8eaed] animate-scaleIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[#dadce0] dark:border-[#3c4043] bg-slate-50 dark:bg-[#171717]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              <CardIcon className="h-5 w-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {editingCard ? 'クレジットカード情報変更' : 'クレジットカード新規登録'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-[#9aa0a6] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#303134] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Card Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
              カード名 <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="例: ビックカメラSuicaカード, 楽天ゴールドカード"
              className="w-full rounded-xl bg-slate-50 dark:bg-[#0a0c10] border border-slate-200 dark:border-gray-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            {suggestion && (
              <div className="mt-1.5 flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>おすすめカラー: <strong>{suggestion.label}</strong> ({suggestion.reason})</span>
                </span>
                {brandColor !== suggestion.colorId && (
                  <button
                    type="button"
                    onClick={() => setBrandColor(suggestion.colorId)}
                    className="ml-2 font-bold underline hover:text-amber-600 dark:hover:text-amber-200"
                  >
                    適用
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Payment Date Logic (毎月◯日 or 月末) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300">
              支払日設定 <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentDayType('day')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  paymentDayType === 'day'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-gray-800 dark:bg-[#0a0c10] dark:text-gray-400 dark:hover:border-gray-700'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>毎月指定日 (例: 4日)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentDayType('end_of_month')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  paymentDayType === 'end_of_month'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-gray-800 dark:bg-[#0a0c10] dark:text-gray-400 dark:hover:border-gray-700'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>月末 (毎月末日)</span>
              </button>
            </div>

            {paymentDayType === 'day' && (
              <div className="mt-2 flex items-center gap-3 bg-slate-50 dark:bg-[#0a0c10] p-3 rounded-xl border border-slate-200 dark:border-gray-800">
                <span className="text-xs text-slate-500 dark:text-gray-400 font-medium whitespace-nowrap">毎月</span>
                <select
                  value={paymentDayValue}
                  onChange={(e) => setPaymentDayValue(Number(e.target.value))}
                  className="rounded-lg bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-gray-700 px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}日
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-500 dark:text-gray-400">に引き落とし</span>
              </div>
            )}
          </div>

          {/* Linked Bank Account */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 flex items-center gap-1">
                <Landmark className="h-3.5 w-3.5 text-slate-500 dark:text-gray-400" />
                引き落とし銀行口座 <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              {onOpenAddAccountModal && (
                <button
                  type="button"
                  onClick={onOpenAddAccountModal}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  + 新しい口座を登録
                </button>
              )}
            </div>
            {bankAccounts.length === 0 ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
                銀行口座が登録されていません。先に口座を登録してください。
              </div>
            ) : (
              <select
                required
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-[#0a0c10] border border-slate-200 dark:border-gray-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                {bankAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} {acc.accountType ? `(${acc.accountType})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Closing Day (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
              締め日 (任意)
            </label>
            <input
              type="text"
              value={closingDay}
              onChange={(e) => setClosingDay(e.target.value)}
              placeholder="例: 前月10日締め, 当月15日締め"
              className="w-full rounded-xl bg-slate-50 dark:bg-[#0a0c10] border border-slate-200 dark:border-gray-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Brand/Theme Accent Color */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                カードカラーアクセント
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                <span>カスタム色:</span>
                <input
                  type="color"
                  value={brandColor.startsWith('#') ? brandColor : (BRAND_COLORS[brandColor]?.hex || '#6366f1')}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent p-0"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setBrandColor(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    brandColor === c.id
                      ? `${c.border} bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white font-semibold ring-1 ring-indigo-500`
                      : 'border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#0a0c10] text-slate-600 dark:text-gray-400 hover:border-slate-300 dark:hover:border-gray-700'
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${c.bg}`} />
                  <span>{c.label}</span>
                  {brandColor === c.id && <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400 ml-0.5" />}
                </button>
              ))}

              {/* Display chip if custom hex color selected */}
              {brandColor.startsWith('#') && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500 bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white text-xs font-semibold ring-1 ring-indigo-500">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: brandColor }}
                  />
                  <span>カスタム色 ({brandColor})</span>
                  <Check className="h-3 w-3 text-indigo-600 dark:text-indigo-400 ml-0.5" />
                </div>
              )}
            </div>
          </div>

          {/* Memo / Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-slate-500 dark:text-gray-400" />
              メモ・用途 (任意)
            </label>
            <textarea
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="例: 主に交通費・ICチャージ用、Vポイント特約店用など"
              className="w-full rounded-xl bg-slate-50 dark:bg-[#0a0c10] border border-slate-200 dark:border-gray-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Submit / Cancel / Delete Footer */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-gray-800">
            <div>
              {editingCard && onDeleteCard && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCard(editingCard.id);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer"
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
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={bankAccounts.length === 0}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-gray-800 disabled:text-slate-400 dark:disabled:text-gray-600 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
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
