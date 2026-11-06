import React, { useRef, useState, useEffect } from 'react';
import {
  Download,
  Upload,
  Shield,
  CheckCircle,
  AlertTriangle,
  CalendarCheck,
  Palette,
  Check,
  Smartphone,
  Share2,
  MoreVertical,
  PlusSquare,
  Info,
} from 'lucide-react';
import { CreditCard, BankAccount, ThemeAccentColor } from '../types';
import { THEME_COLOR_PRESETS } from '../utils/themeColors';

interface SettingsViewProps {
  cards: CreditCard[];
  accounts: BankAccount[];
  isDark?: boolean;
  adjustForBankHolidays: boolean;
  onToggleBankHolidayAdjustment: (enabled: boolean) => void;
  onRestoreData: (newCards: CreditCard[], newAccounts: BankAccount[]) => void;
  themeAccentColor: ThemeAccentColor;
  onChangeThemeColor: (color: ThemeAccentColor) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  cards,
  accounts,
  isDark = false,
  adjustForBankHolidays,
  onToggleBankHolidayAdjustment,
  onRestoreData,
  themeAccentColor,
  onChangeThemeColor,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'idle' | 'success' | 'error';
    text?: string;
  }>({ type: 'idle' });

  // PWA インストール関連の状態
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // すでにスタンドアロンアプリとして起動しているか判定
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setStatusMessage({
        type: 'success',
        text: 'ホーム画面にアプリを追加しました。',
      });
      setDeferredPrompt(null);
    }
  };

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

      setStatusMessage({
        type: 'success',
        text: 'バックアップファイルを端末に保存しました。',
      });
    } catch (e) {
      console.error(e);
      setStatusMessage({
        type: 'error',
        text: 'バックアップの作成に失敗しました。',
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
              `カード ${parsed.cards.length}件、口座 ${parsed.accounts.length}件 のデータを復元しますか？（現在の登録内容は上書きされます）`
            )
          ) {
            onRestoreData(parsed.cards, parsed.accounts);
            setStatusMessage({
              type: 'success',
              text: `データを復元しました（カード ${parsed.cards.length}件、口座 ${parsed.accounts.length}件）。`,
            });
          }
        } else {
          throw new Error('無効なファイル形式です');
        }
      } catch (err) {
        console.error(err);
        setStatusMessage({
          type: 'error',
          text: 'ファイルの読み込みに失敗しました。有効なバックアップJSONファイルを選択してください。',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* DADS準拠の端正なセクション見出し */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-xs bg-[var(--color-primary)] shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">
            設定・データ保存
          </h2>
        </div>
      </div>

      {/* ステータスメッセージ */}
      {statusMessage.type !== 'idle' && (
        <div
          className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold flex items-start gap-2.5 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle strokeWidth={1.75} className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle strokeWidth={1.75} className="h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          )}
          <div className="flex-1">
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage({ type: 'idle' })}
            className="text-[11px] underline opacity-75 hover:opacity-100 cursor-pointer"
          >
            閉じる
          </button>
        </div>
      )}

      {/* 設定カードグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. デザインテーマカラー（6色すべてライト・ダーク双方で高視認性対応） */}
        <div className="rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#d0d5dd] dark:border-[#2e3642]">
            <div className="flex items-center gap-2">
              <Palette strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)]" />
              <h3 className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
                テーマカラー設定
              </h3>
            </div>
            <span className="text-xs font-bold text-[var(--color-primary)]">
              {THEME_COLOR_PRESETS[themeAccentColor]?.label || 'ブルー'}
            </span>
          </div>

          <p className="text-xs text-[#475467] dark:text-[#98a2b3] leading-relaxed">
            ボタンや選択タブ、アクセントバーの基調色を変更できます。ライト・ダークどちらのテーマでも高い視認性に自動調整されます。
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {(Object.keys(THEME_COLOR_PRESETS) as ThemeAccentColor[]).map((key) => {
              const config = THEME_COLOR_PRESETS[key];
              const isSelected = themeAccentColor === key;
              const dotHex = isDark ? config.swatchDarkHex : config.primaryHex;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onChangeThemeColor(key)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] dark:bg-[var(--color-primary-subtle-dark)] ring-1 ring-[var(--color-primary)] text-[#101828] dark:text-white'
                      : 'border-[#d0d5dd] dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 hover:bg-white dark:hover:bg-[#1a1f26] text-[#344054] dark:text-[#cfd5e0]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: dotHex }}
                    />
                    <span className="truncate">{config.label}</span>
                  </div>
                  {isSelected && <Check strokeWidth={2} className="h-3.5 w-3.5 text-[var(--color-primary)] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. 土日祝日営業日補正 */}
        <div className="rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#d0d5dd] dark:border-[#2e3642]">
              <div className="flex items-center gap-2">
                <CalendarCheck strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
                  土日祝日の翌営業日補正
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={adjustForBankHolidays}
                  onChange={(e) => onToggleBankHolidayAdjustment(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-[#d0d5dd] dark:bg-[#475467] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--color-btn-bg)]"></div>
              </label>
            </div>

            <p className="text-xs text-[#475467] dark:text-[#98a2b3] leading-relaxed">
              支払日が土日祝日等の金融機関休業日と重なった場合に、自動的に「翌営業日」に補正してスケジュールを計算します。
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#f4f6f8] dark:bg-[#222730] border border-[#d0d5dd]/70 dark:border-[#363f4e] text-[11px] text-[#475467] dark:text-[#98a2b3] flex items-start gap-2">
            <Info strokeWidth={1.75} className="h-3.5 w-3.5 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <span>カード編集画面からカードごとに個別にON/OFFを指定することも可能です。</span>
          </div>
        </div>

        {/* 3. データのバックアップ・保存 */}
        <div className="rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#d0d5dd] dark:border-[#2e3642]">
            <div className="flex items-center gap-2">
              <Download strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)]" />
              <h3 className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
                バックアップの保存
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#475467] dark:text-[#98a2b3]">
              カード{cards.length}件 / 口座{accounts.length}件
            </span>
          </div>

          <p className="text-xs text-[#475467] dark:text-[#98a2b3] leading-relaxed">
            登録済みのカードや口座情報をJSONファイルとしてダウンロードします。端末変更時や万が一の控えとして保管できます。
          </p>

          <button
            type="button"
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg theme-bg-primary text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <Download strokeWidth={1.75} className="h-4 w-4" />
            <span>バックアップをダウンロード (.json)</span>
          </button>
        </div>

        {/* 4. データの復元 */}
        <div className="rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#d0d5dd] dark:border-[#2e3642]">
            <div className="flex items-center gap-2">
              <Upload strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)]" />
              <h3 className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
                データの復元（読み込み）
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#475467] dark:text-[#98a2b3] leading-relaxed">
            過去にダウンロードしたバックアップJSONファイルを選択して、アプリ内に登録データを復元します。
          </p>

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
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#d0d5dd] dark:border-[#363f4e] bg-[#f4f6f8] dark:bg-[#222730] hover:bg-white dark:hover:bg-[#1a1f26] text-[#101828] dark:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <Upload strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)]" />
            <span>ファイルを選択して復元</span>
          </button>
        </div>
      </div>

      {/* 5. ホーム画面に追加してアプリとして使う（フラットデザイン・線アイコン統一） */}
      <div className="rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#d0d5dd] dark:border-[#2e3642]">
          <div className="flex items-center gap-2">
            <Smartphone strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)]" />
            <h3 className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
              ホーム画面への追加（アプリ化）
            </h3>
          </div>
          {isStandalone && (
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-xs border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <Check strokeWidth={1.75} className="h-3 w-3" />
              アプリモード稼働中
            </span>
          )}
        </div>

        <p className="text-xs text-[#475467] dark:text-[#98a2b3] leading-relaxed">
          スマートフォンのホーム画面に追加すると、ブラウザのアドレスバーが非表示になり、専用アプリとして全画面で起動できます。
        </p>

        {/* Android Chrome で利用可能な「ワンタップ追加」ボタン */}
        {deferredPrompt && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg theme-bg-primary text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <Smartphone strokeWidth={1.75} className="h-4 w-4" />
            <span>ホーム画面にアプリを追加</span>
          </button>
        )}

        {/* 手動追加のステップ案内（絵文字を排し線アイコンで統一） */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* iPhone / iPad (Safari) */}
          <div className="p-3 rounded-lg border border-[#d0d5dd]/80 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 space-y-1.5 text-xs">
            <div className="font-bold text-[#101828] dark:text-white flex items-center gap-1.5">
              <Smartphone strokeWidth={1.75} className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              <span>iPhone / iPad（Safari）</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#475467] dark:text-[#98a2b3] leading-relaxed">
              <li>
                画面下の「<Share2 strokeWidth={1.75} className="inline h-3.5 w-3.5 text-[var(--color-primary)] mx-0.5" /> <strong>共有</strong>」ボタンをタップ
              </li>
              <li>
                メニューから「<PlusSquare strokeWidth={1.75} className="inline h-3.5 w-3.5 text-[var(--color-primary)] mx-0.5" /> <strong>ホーム画面に追加</strong>」を選択
              </li>
              <li>右上の「追加」をタップして完了</li>
            </ol>
          </div>

          {/* Android (Chrome) */}
          <div className="p-3 rounded-lg border border-[#d0d5dd]/80 dark:border-[#363f4e] bg-[#f4f6f8]/60 dark:bg-[#222730]/60 space-y-1.5 text-xs">
            <div className="font-bold text-[#101828] dark:text-white flex items-center gap-1.5">
              <Smartphone strokeWidth={1.75} className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              <span>Android（Chrome）</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#475467] dark:text-[#98a2b3] leading-relaxed">
              <li>
                右上の「<MoreVertical strokeWidth={1.75} className="inline h-3.5 w-3.5 text-[var(--color-primary)] mx-0.5" /> <strong>メニュー</strong>」をタップ
              </li>
              <li>
                「<strong>アプリをインストール</strong>」または「<strong>ホーム画面に追加</strong>」を選択
              </li>
              <li>確認画面で「インストール」をタップして完了</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 6. プライバシーとデータ保護の安心カード */}
      <div className="rounded-xl border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] p-4 sm:p-5 space-y-2">
        <div className="flex items-center gap-2 text-[var(--color-primary)]">
          <Shield strokeWidth={1.75} className="h-4 w-4" />
          <h3 className="text-xs sm:text-sm font-bold text-[#101828] dark:text-white">
            プライバシー・データ保護について
          </h3>
        </div>
        <p className="text-xs text-[#475467] dark:text-[#98a2b3] leading-relaxed">
          本アプリは登録情報（クレジットカード名、口座名、支払日など）を外部サーバーへ送信することはありません。すべてのデータはお使いの端末（ブラウザのLocalStorage）内にのみ保存されます。
        </p>
      </div>
    </div>
  );
};
