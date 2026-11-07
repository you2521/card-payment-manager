import React, { useState, useEffect } from 'react';
import { X, Landmark, Info, Trash2 } from 'lucide-react';
import { BankAccount } from '../types';
import { suggestAccountColor } from '../utils/colorSuggester';
import { getAccessibleColorHex } from '../utils/colors';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: Omit<BankAccount, 'id'>, accountId?: string) => void;
  editingAccount?: BankAccount | null;
  onDeleteAccount?: (accountId: string) => void;
  isDark?: boolean;
}

const PRESET_COLORS = [
  { id: '#0047AB', name: 'ブルー' },
  { id: '#004B23', name: 'グリーン (三井住友)' },
  { id: '#BF0000', name: 'クリムゾン (三菱UFJ/楽天)' },
  { id: '#003399', name: 'ネイビー (みずほ)' },
  { id: '#FF6600', name: 'オレンジ (ゆうちょ)' },
  { id: '#10B981', name: 'エメラルド (りそな)' },
  { id: '#0284C7', name: 'スカイ (住信SBI)' },
  { id: '#FF0033', name: 'レッド (PayPay)' },
  { id: '#0F766E', name: 'ティール (ソニー)' },
  { id: '#6B21A8', name: 'パープル' },
  { id: '#475467', name: 'グレー' },
];

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAccount,
  onDeleteAccount,
  isDark = false,
}) => {
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState('普通');
  const [color, setColor] = useState('#0047AB');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const suggestion = suggestAccountColor(name);

  const handleNameChange = (val: string) => {
    setName(val);
    const sugg = suggestAccountColor(val);
    if (sugg && !editingAccount) {
      setColor(sugg.hex);
    }
  };

  useEffect(() => {
    if (editingAccount) {
      setName(editingAccount.name);
      setAccountType(editingAccount.accountType || '普通');
      setColor(editingAccount.color || '#0047AB');
      setNote(editingAccount.note || '');
    } else {
      setName('');
      setAccountType('普通');
      setColor('#0047AB');
      setNote('');
    }
    setError('');
  }, [editingAccount, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('銀行口座名を入力してください。');
      return;
    }

    onSave(
      {
        name: name.trim(),
        accountType: accountType.trim() || undefined,
        color,
        note: note.trim() || undefined,
      },
      editingAccount?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 animate-fadeIn">
      <div className="relative w-full max-w-md rounded-[8px] border border-[var(--dads-gray-300)] bg-[var(--dads-white)] overflow-hidden text-[var(--dads-sumi-900)] animate-scaleIn">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[var(--dads-gray-300)] bg-[var(--dads-gray-100)]">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-[var(--color-primary)]" />
            <h2 className="text-base sm:text-lg font-bold">
              {editingAccount ? '銀行口座情報の変更' : '銀行口座の新規登録'}
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

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-[4px] bg-[var(--dads-danger-bg)] border border-[var(--dads-danger)] text-[var(--dads-danger)] text-xs font-bold">
              {error}
            </div>
          )}

          {/* 銀行名 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[var(--dads-sumi-900)]">
                銀行名 / 口座名
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
              placeholder="例: 三井住友銀行, 楽天銀行, 三菱UFJ銀行"
              className="w-full rounded-[4px] bg-[var(--dads-white)] border border-[var(--dads-gray-300)] px-3 py-2 text-sm text-[var(--dads-sumi-900)] placeholder-[var(--dads-sumi-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            {suggestion && (
              <div className="mt-1.5 flex items-center justify-between text-xs px-2.5 py-1.5 rounded-[4px] bg-[var(--dads-warning-bg)] border border-[var(--dads-warning-border)] text-[var(--dads-warning-text)]">
                <span className="flex items-center gap-1 font-medium">
                  <Info strokeWidth={1.75} className="h-3.5 w-3.5" />
                  <span>おすすめ色: <strong>{suggestion.name}</strong></span>
                </span>
                {color !== suggestion.hex && (
                  <button
                    type="button"
                    onClick={() => setColor(suggestion.hex)}
                    className="font-bold underline ml-2 cursor-pointer"
                  >
                    適用
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 口座種別 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[var(--dads-sumi-900)]">
                口座種別
              </label>
              <span className="dads-tag text-[10px] py-0.5">
                任意
              </span>
            </div>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full rounded-[4px] bg-[var(--dads-white)] border border-[var(--dads-gray-300)] px-3 py-2 text-sm text-[var(--dads-sumi-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="普通">普通預金</option>
              <option value="当座">当座預金</option>
              <option value="貯蓄">貯蓄預金</option>
              <option value="その他">その他</option>
            </select>
          </div>

          {/* シンボルカラー */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-[var(--dads-sumi-900)]">
                シンボルカラー
              </label>
              <label className="flex items-center gap-1 text-xs text-[var(--dads-sumi-700)] cursor-pointer">
                <span>カスタム色:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-5 h-5 rounded-[3px] border-0 cursor-pointer p-0 bg-transparent"
                />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`flex items-center gap-1.5 p-2 rounded-[4px] border text-xs text-left transition-all cursor-pointer ${
                    color === c.id
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] dark:bg-[var(--color-primary-subtle-dark)] text-[var(--color-primary)] font-bold'
                      : 'border-[var(--dads-gray-300)] text-[var(--dads-sumi-900)]'
                  }`}
                >
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: getAccessibleColorHex(c.id, isDark) }} />
                  <span className="truncate text-[11px]">{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* メモ */}
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
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例: 給与受取口座、光熱費引き落とし兼用"
              className="w-full rounded-[4px] bg-[var(--dads-white)] border border-[var(--dads-gray-300)] px-3 py-2 text-sm text-[var(--dads-sumi-900)] placeholder-[var(--dads-sumi-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            />
          </div>

          {/* ボタン */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--dads-gray-300)]">
            <div>
              {editingAccount && onDeleteAccount && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteAccount(editingAccount.id);
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
                className="px-5 py-2 rounded-[4px] theme-bg-primary text-white text-xs font-bold cursor-pointer"
              >
                {editingAccount ? '更新する' : '登録する'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
