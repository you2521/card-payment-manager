import React, { useState, useEffect } from 'react';
import { X, Landmark, FileText, Sparkles, Trash2 } from 'lucide-react';
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
  { id: '#FF0033', name: 'レッド (PayPay風)' },
  { id: '#BF0000', name: 'クリムゾン (楽天風)' },
  { id: '#004B23', name: 'グリーン (三井住友風)' },
  { id: '#10B981', name: 'エメラルド (りそな風)' },
  { id: '#003399', name: 'ブルー (みずほ/UFJ風)' },
  { id: '#0284C7', name: 'スカイブルー (住信SBI風)' },
  { id: '#0F766E', name: 'ティール (ソニー銀行風)' },
  { id: '#FF6600', name: 'オレンジ (ゆうちょ風)' },
  { id: '#D97706', name: 'アンバー (SBI新生風)' },
  { id: '#6B21A8', name: 'パープル (メルペイ風)' },
  { id: '#EC4899', name: 'ピンク (イオン風)' },
  { id: '#334155', name: 'スレート (ネット銀行風)' },
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
  const [color, setColor] = useState('#003399');
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
      setColor(editingAccount.color || '#003399');
      setNote(editingAccount.note || '');
    } else {
      setName('');
      setAccountType('普通');
      setColor('#003399');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] shadow-2xl overflow-hidden text-slate-900 dark:text-[#e8eaed] animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[#dadce0] dark:border-[#3c4043] bg-slate-50 dark:bg-[#171717]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              <Landmark className="h-5 w-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {editingAccount ? '銀行口座情報変更' : '銀行口座新規登録'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:text-[#9aa0a6] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#303134] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[85vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Account Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
              銀行名 / 口座名 <span className="text-rose-500 dark:text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="例: 楽天銀行, 三井住友銀行, 住信SBIネット銀行"
              className="w-full rounded-xl bg-slate-50 dark:bg-[#0a0c10] border border-slate-200 dark:border-gray-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
            {suggestion && (
              <div className="mt-1.5 flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>おすすめカラー: <strong>{suggestion.name}</strong> ({suggestion.reason})</span>
                </span>
                {color !== suggestion.hex && (
                  <button
                    type="button"
                    onClick={() => setColor(suggestion.hex)}
                    className="ml-2 font-bold underline hover:text-amber-600 dark:hover:text-amber-200"
                  >
                    適用
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5">
              口座種別
            </label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-[#0a0c10] border border-slate-200 dark:border-gray-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="普通">普通口座</option>
              <option value="当座">当座口座</option>
              <option value="貯蓄">貯蓄口座</option>
              <option value="その他">その他</option>
            </select>
          </div>

          {/* Color Badge Theme */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                シンボルカラー
              </label>
              <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                <span>カスタム色:</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent p-0"
                />
              </label>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`flex items-center gap-1.5 p-2 rounded-lg border text-xs text-left transition-all ${
                    color === c.id
                      ? 'border-indigo-500 bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white font-semibold ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#0a0c10] text-slate-600 dark:text-gray-400 hover:border-slate-300 dark:hover:border-gray-700'
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: c.id }}
                  />
                  <span className="truncate text-[10px]">{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-slate-500 dark:text-gray-400" />
              メモ (任意)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例: 給与受取口座、公共料金引き落とし用など"
              className="w-full rounded-xl bg-slate-50 dark:bg-[#0a0c10] border border-slate-200 dark:border-gray-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-gray-800">
            <div>
              {editingAccount && onDeleteAccount && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteAccount(editingAccount.id);
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
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
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
