import React, { useRef, useState } from 'react';
import { X, Download, Upload, Shield, CheckCircle, AlertTriangle, CalendarCheck, Palette } from 'lucide-react';
import { CreditCard, BankAccount, ThemeAccentColor } from '../types';
import { THEME_COLOR_PRESETS } from '../utils/themeColors';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: CreditCard[];
  accounts: BankAccount[];
  adjustForBankHolidays: boolean;
  onToggleBankHolidayAdjustment: (enabled: boolean) => void;
  onRestoreData: (newCards: CreditCard[], newAccounts: BankAccount[]) => void;
  themeAccentColor: ThemeAccentColor;
  onChangeThemeColor: (color: ThemeAccentColor) => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  cards,
  accounts,
  adjustForBankHolidays,
  onToggleBankHolidayAdjustment,
  onRestoreData,
  themeAccentColor,
  onChangeThemeColor,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreStatus, setRestoreStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });

  if (!isOpen) return null;

  // JSONエクスポート（ダウンロード）
  const handleExport = () => {
    try {
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}`;
      const exportData = {
        version: '2.0',
        exportedAt: now.toISOString(),
        cards,
        accounts,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `card_payment_backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setRestoreStatus({
        type: 'success',
        message: 'バックアップファイルをダウンロードしました。',
      });
    } catch (e) {
      console.error(e);
      setRestoreStatus({
        type: 'error',
        message: 'バックアップの作成に失敗しました。',
      });
    }
  };

  // JSONインポート（復元）
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed.cards) && Array.isArray(parsed.accounts)) {
          if (
            window.confirm(
              `カード ${parsed.cards.length}件、口座 ${parsed.accounts.length}件 のデータを復元しますか？（現在のデータは上書きされます）`
            )
          ) {
            onRestoreData(parsed.cards, parsed.accounts);
            setRestoreStatus({
              type: 'success',
              message: `復元完了: カード ${parsed.cards.length}件、口座 ${parsed.accounts.length}件 を読み込みました。`,
            });
            setTimeout(() => {
              onClose();
            }, 1200);
          }
        } else {
          throw new Error('無効なファイル形式です');
        }
      } catch (err) {
        console.error(err);
        setRestoreStatus({
          type: 'error',
          message: 'ファイルの読み込みに失敗しました。有効なバックアップJSONファイルを選択してください。',
        });
      }
    };
    reader.readAsText(file);
    // inputをリセット
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] shadow-xl p-4 sm:p-6 text-[#101828] dark:text-[#f0f2f5] animate-scaleIn">
        {/* ヘッダー */}
        <div className="flex items-center justify-between pb-3 border-b border-[#d0d5dd] dark:border-[#2e3642]">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[var(--color-primary)]" />
            <h2 className="text-base sm:text-lg font-bold">データ管理 ＆ 設定</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#667085] hover:text-[#101828] dark:hover:text-white hover:bg-[#eaecf0] dark:hover:bg-[#2c333f] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 本文 */}
        <div className="py-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* メッセージ */}
          {restoreStatus.type !== 'idle' && (
            <div
              className={`p-3 rounded-md text-xs font-bold flex items-start gap-2 ${
                restoreStatus.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300'
              }`}
            >
              {restoreStatus.type === 'success' ? (
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              <span>{restoreStatus.message}</span>
            </div>
          )}

          {/* テーマアクセントカラー設定 */}
          <div className="p-3.5 rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-[#f4f6f8] dark:bg-[#222730] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Palette className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
                  デザインテーマカラー
                </span>
              </div>
              <span className="text-[11px] font-bold text-[var(--color-primary)]">
                {THEME_COLOR_PRESETS[themeAccentColor]?.label || '公式ブルー'}
              </span>
            </div>

            <p className="text-[11px] text-[#475467] dark:text-[#98a2b3]">
              全体のアクセント色（ボタン、選択タブ、バッジ）をお好みの色に変更できます。
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {(Object.keys(THEME_COLOR_PRESETS) as ThemeAccentColor[]).map((key) => {
                const config = THEME_COLOR_PRESETS[key];
                const isSelected = themeAccentColor === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onChangeThemeColor(key)}
                    className={`flex items-center gap-2 p-2 rounded-md border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-white dark:bg-[#1a1f26] ring-1 ring-[var(--color-primary)] text-[#101828] dark:text-white shadow-xs'
                        : 'border-[#d0d5dd] dark:border-[#363f4e] bg-white/70 dark:bg-[#1a1f26]/70 hover:bg-white dark:hover:bg-[#1a1f26] text-[#475467] dark:text-[#8e98a8]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: config.primaryHex }}
                    />
                    <span className="truncate">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 金融機関営業日補正設定 */}
          <div className="p-3.5 rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-[#f4f6f8] dark:bg-[#222730] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
                  土日祝日の翌営業日補正（全体基本）
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adjustForBankHolidays}
                  onChange={(e) => onToggleBankHolidayAdjustment(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#d0d5dd] dark:bg-[#475467] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
            <p className="text-[11px] text-[#475467] dark:text-[#98a2b3] leading-relaxed">
              支払日が土日祝日等の金融機関休業日である場合、翌営業日に自動シフトします。※カード編集画面からカードごとに個別にON/OFFすることも可能です。
            </p>
          </div>

          {/* バックアップと復元 */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#344054] dark:text-[#cfd5e0]">
              データのバックアップ（保存・復元）
            </h3>

            {/* ダウンロードボタン */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md theme-bg-primary text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>バックアップをダウンロード (.json)</span>
              </button>
              <p className="text-[10px] text-[#667085] dark:text-[#8e98a8]">
                現在の登録データ（カード {cards.length}枚、口座 {accounts.length}件）を端末にファイル保存します。
              </p>
            </div>

            {/* アップロードボタン */}
            <div className="pt-2 space-y-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json,application/json"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] bg-white dark:bg-[#1a1f26] hover:bg-[#f4f6f8] dark:hover:bg-[#222730] text-[#101828] dark:text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <Upload className="h-4 w-4 text-[var(--color-primary)]" />
                <span>バックアップファイルから復元</span>
              </button>
              <p className="text-[10px] text-[#667085] dark:text-[#8e98a8]">
                保存済みのJSONファイルを選択して、データを端末に復元します。
              </p>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="pt-3 border-t border-[#d0d5dd] dark:border-[#2e3642] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-bold text-[#344054] dark:text-[#cfd5e0] hover:bg-[#f4f6f8] dark:hover:bg-[#222730] cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
