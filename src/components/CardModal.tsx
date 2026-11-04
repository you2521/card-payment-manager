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
      },
      editingCard?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] shadow-xl overflow-hidden text-[#101828] dark:text-[#f0f2f5] animate-scaleIn">
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[#d0d5dd] dark:border-[#2e3642] bg-[#f4f6f8] dark:bg-[#222730]">
          <div className="flex items-center gap-2">
            <CardIcon className="h-5 w-5 text-[#0047AB] dark:text-[#5294e2]" />
            <h2 className="text-base sm:text-lg font-bold">
              {editingCard ? 'クレジットカード情報の変更' : 'クレジットカード新規登録'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#667085] hover:text-[#101828] dark:hover:text-white hover:bg-[#eaecf0] dark:hover:bg-[#2c333f]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* フォーム本文 */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-md bg-[#d92d20]/10 border border-[#d92d20]/30 text-[#d92d20] text-xs font-bold">
              {error}
            </div>
          )}

          {/* カード名 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
                カード名
              </label>
              <span className="bg-[#d92d20] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-xs">
                必須
              </span>
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="例: 楽天カード, 三井住友カード, JALカード"
              className="w-full rounded-md bg-white dark:bg-[#12151a] border border-[#d0d5dd] dark:border-[#363f4e] px-3 py-2 text-sm text-[#101828] dark:text-white placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#0047AB]"
            />
            {suggestion && (
              <div className="mt-1.5 flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md bg-[#b54708]/10 border border-[#b54708]/20 text-[#b54708]">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>おすすめ色: <strong>{suggestion.label}</strong> ({suggestion.reason})</span>
                </span>
                {brandColor !== suggestion.colorId && (
                  <button
                    type="button"
                    onClick={() => setBrandColor(suggestion.colorId)}
                    className="font-bold underline ml-2"
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
              <label className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
                支払日（引き落とし日）
              </label>
              <span className="bg-[#d92d20] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-xs">
                必須
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentDayType('day')}
                className={`p-2.5 rounded-md border text-xs font-bold transition-all text-center cursor-pointer ${
                  paymentDayType === 'day'
                    ? 'border-[#0047AB] bg-[#0047AB]/10 text-[#0047AB] dark:text-[#5294e2] dark:border-[#5294e2]'
                    : 'border-[#d0d5dd] dark:border-[#363f4e] bg-white dark:bg-[#12151a] text-[#475467] dark:text-[#8e98a8]'
                }`}
              >
                毎月指定日（1〜31日）
              </button>
              <button
                type="button"
                onClick={() => setPaymentDayType('end_of_month')}
                className={`p-2.5 rounded-md border text-xs font-bold transition-all text-center cursor-pointer ${
                  paymentDayType === 'end_of_month'
                    ? 'border-[#0047AB] bg-[#0047AB]/10 text-[#0047AB] dark:text-[#5294e2] dark:border-[#5294e2]'
                    : 'border-[#d0d5dd] dark:border-[#363f4e] bg-white dark:bg-[#12151a] text-[#475467] dark:text-[#8e98a8]'
                }`}
              >
                毎月末日
              </button>
            </div>

            {paymentDayType === 'day' && (
              <div className="flex items-center gap-2 bg-[#f4f6f8] dark:bg-[#222730] p-2.5 rounded-md border border-[#d0d5dd] dark:border-[#363f4e]">
                <span className="text-xs text-[#475467] dark:text-[#98a2b3]">毎月</span>
                <select
                  value={paymentDayValue}
                  onChange={(e) => setPaymentDayValue(Number(e.target.value))}
                  className="rounded-md bg-white dark:bg-[#12151a] border border-[#d0d5dd] dark:border-[#363f4e] px-3 py-1.5 text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#0047AB]"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}日
                    </option>
                  ))}
                </select>
                <span className="text-xs text-[#475467] dark:text-[#98a2b3]">に引き落とし</span>
              </div>
            )}
          </div>

          {/* 引き落とし口座 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
                引き落とし銀行口座
              </label>
              <div className="flex items-center gap-2">
                {onOpenAddAccountModal && (
                  <button
                    type="button"
                    onClick={onOpenAddAccountModal}
                    className="text-[11px] text-[#0047AB] dark:text-[#5294e2] underline cursor-pointer"
                  >
                    + 口座を新規追加
                  </button>
                )}
                <span className="bg-[#d92d20] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-xs">
                  必須
                </span>
              </div>
            </div>

            {bankAccounts.length === 0 ? (
              <div className="p-3 rounded-md bg-[#b54708]/10 border border-[#b54708]/30 text-[#b54708] text-xs space-y-1.5">
                <p className="font-bold">引き落とし口座がまだ登録されていません。</p>
                <p>先に銀行口座を登録してください。</p>
                {onOpenAddAccountModal && (
                  <button
                    type="button"
                    onClick={onOpenAddAccountModal}
                    className="px-3 py-1 bg-[#0047AB] text-white text-xs font-bold rounded-md"
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
                className="w-full rounded-md bg-white dark:bg-[#12151a] border border-[#d0d5dd] dark:border-[#363f4e] px-3 py-2 text-sm text-[#101828] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]"
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
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
                締め日
              </label>
              <span className="bg-[#f2f4f7] dark:bg-[#222730] text-[#344054] dark:text-[#cfd5e0] text-[10px] px-1.5 py-0.2 rounded-xs">
                任意
              </span>
            </div>
            <input
              type="text"
              value={closingDay}
              onChange={(e) => setClosingDay(e.target.value)}
              placeholder="例: 前月15日締め, 当月末日締め"
              className="w-full rounded-md bg-white dark:bg-[#12151a] border border-[#d0d5dd] dark:border-[#363f4e] px-3 py-2 text-sm text-[#101828] dark:text-white placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#0047AB]"
            />
          </div>

          {/* カラー設定（任意） */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
                カードカラー
              </label>
              <label className="flex items-center gap-1 text-xs text-[#667085] cursor-pointer">
                <span>カスタム色:</span>
                <input
                  type="color"
                  value={brandColor.startsWith('#') ? brandColor : (BRAND_COLORS[brandColor]?.hex || '#0047AB')}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-5 h-5 rounded-xs border-0 cursor-pointer p-0 bg-transparent"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setBrandColor(c.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition-all ${
                    brandColor === c.id
                      ? 'border-[#0047AB] bg-[#0047AB]/10 text-[#0047AB] dark:text-[#5294e2] font-bold'
                      : 'border-[#d0d5dd] dark:border-[#363f4e] text-[#475467] dark:text-[#8e98a8]'
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${c.bg}`} />
                  <span>{c.label}</span>
                  {brandColor === c.id && <Check className="h-3 w-3 text-[#0047AB]" />}
                </button>
              ))}
            </div>
          </div>

          {/* メモ（任意） */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
                メモ・用途
              </label>
              <span className="bg-[#f2f4f7] dark:bg-[#222730] text-[#344054] dark:text-[#cfd5e0] text-[10px] px-1.5 py-0.2 rounded-xs">
                任意
              </span>
            </div>
            <textarea
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="例: 固定費引き落とし用、ポイント特約店用"
              className="w-full rounded-md bg-white dark:bg-[#12151a] border border-[#d0d5dd] dark:border-[#363f4e] px-3 py-2 text-sm text-[#101828] dark:text-white placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#0047AB] resize-none"
            />
          </div>

          {/* フッター操作ボタン */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#d0d5dd] dark:border-[#2e3642]">
            <div>
              {editingCard && onDeleteCard && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteCard(editingCard.id);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-md border border-[#d92d20]/30 text-[#d92d20] hover:bg-rose-50 text-xs font-bold"
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
                className="px-4 py-2 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-bold text-[#344054] dark:text-[#cfd5e0] hover:bg-[#f4f6f8] dark:hover:bg-[#222730]"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={bankAccounts.length === 0}
                className="px-5 py-2 rounded-md bg-[#0047AB] hover:bg-[#003882] disabled:bg-[#d0d5dd] text-white text-xs font-bold shadow-xs cursor-pointer"
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
