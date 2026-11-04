import React, { useState, useEffect } from 'react';
import { X, Landmark, Sparkles, Trash2 } from 'lucide-react';
import { BankAccount } from '../types';
import { suggestAccountColor } from '../utils/colorSuggester';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: Omit<BankAccount, 'id'>, accountId?: string) => void;
  editingAccount?: BankAccount | null;
  onDeleteAccount?: (accountId: string) => void;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] shadow-xl overflow-hidden text-[#101828] dark:text-[#f0f2f5] animate-scaleIn">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-[#d0d5dd] dark:border-[#2e3642] bg-[#f4f6f8] dark:bg-[#222730]">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-[var(--color-primary)]" />
            <h2 className="text-base sm:text-lg font-bold">
              {editingAccount ? '銀行口座情報の変更' : '銀行口座の新規登録'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#667085] hover:text-[#101828] dark:hover:text-white hover:bg-[#eaecf0] dark:hover:bg-[#2c333f] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-md bg-[#d92d20]/10 border border-[#d92d20]/30 text-[#d92d20] text-xs font-bold">
              {error}
            </div>
          )}

          {/* 銀行名 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
                銀行名 / 口座名
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
              placeholder="例: 三井住友銀行, 楽天銀行, 三菱UFJ銀行"
              className="w-full rounded-md bg-white dark:bg-[#12151a] border border-[#d0d5dd] dark:border-[#363f4e] px-3 py-2 text-sm text-[#101828] dark:text-white placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            {suggestion && (
              <div className="mt-1.5 flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md bg-[#b54708]/10 border border-[#b54708]/20 text-[#b54708]">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>おすすめ色: <strong>{suggestion.name}</strong></span>
                </span>
                {color !== suggestion.hex && (
                  <button
                    type="button"
                    onClick={() => setColor(suggestion.hex)}
                    className="font-bold underline ml-2"
                  >
                    適用
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 口座種別 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
                口座種別
              </label>
              <span className="bg-[#f2f4f7] dark:bg-[#222730] text-[#344054] dark:text-[#cfd5e0] text-[10px] px-1.5 py-0.2 rounded-xs">
                任意
              </span>
            </div>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full rounded-md bg-white dark:bg-[#12151a] border border-[#d0d5dd] dark:border-[#363f4e] px-3 py-2 text-sm text-[#101828] dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
              <label className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
                シンボルカラー
              </label>
              <label className="flex items-center gap-1 text-xs text-[#667085] cursor-pointer">
                <span>カスタム色:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-5 h-5 rounded-xs border-0 cursor-pointer p-0 bg-transparent"
                />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`flex items-center gap-1.5 p-2 rounded-md border text-xs text-left transition-all cursor-pointer ${
                    color === c.id
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] dark:bg-[var(--color-primary-subtle-dark)] text-[var(--color-primary)] font-bold'
                      : 'border-[#d0d5dd] dark:border-[#363f4e] text-[#475467] dark:text-[#8e98a8]'
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: c.id }} />
                  <span className="truncate text-[10px]">{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* メモ */}
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
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例: 給与受取口座、光熱費引き落とし兼用"
              className="w-full rounded-md bg-white dark:bg-[#12151a] border border-[#d0d5dd] dark:border-[#363f4e] px-3 py-2 text-sm text-[#101828] dark:text-white placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            />
          </div>

          {/* ボタン */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#d0d5dd] dark:border-[#2e3642]">
            <div>
              {editingAccount && onDeleteAccount && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteAccount(editingAccount.id);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-md border border-[#d92d20]/30 text-[#d92d20] hover:bg-rose-50 text-xs font-bold cursor-pointer"
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
                className="px-4 py-2 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-bold text-[#344054] dark:text-[#cfd5e0] hover:bg-[#f4f6f8] dark:hover:bg-[#222730] cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-md theme-bg-primary text-white text-xs font-bold shadow-xs cursor-pointer"
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
