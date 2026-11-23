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
  ChevronDown,
  ChevronUp,
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
  const [showInstallSteps, setShowInstallSteps] = useState(false);

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
      {/* ステータスメッセージ */}
      {statusMessage.type !== 'idle' && (
        <div
          className={`p-3.5 rounded-[8px] border text-xs sm:text-sm font-bold flex items-start gap-2.5 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-[var(--dads-success-bg)] border-[var(--dads-success)] text-[var(--dads-success)]'
              : 'bg-[var(--dads-danger-bg)] border-[var(--dads-danger)] text-[var(--dads-danger)]'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle strokeWidth={1.75} className="h-4 w-4 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle strokeWidth={1.75} className="h-4 w-4 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-[var(--dads-sumi-900)]">
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage({ type: 'idle' })}
            className="text-xs underline font-bold text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)] cursor-pointer shrink-0"
          >
            閉じる
          </button>
        </div>
      )}

      {/* ========================================================
          1. 表示・計算設定
          ======================================================== */}
      <section aria-label="表示・計算設定" className="space-y-2.5">
        <div className="dads-section-header">
          <h2 className="dads-section-title">表示・計算設定</h2>
        </div>

        <div className="dads-card divide-y divide-[var(--dads-gray-200)]">
          {/* 行1: テーマカラー */}
          <div className="p-3.5 sm:p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Palette strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-[var(--dads-sumi-900)]">
                  テーマカラー
                </h3>
              </div>
              <span className="dads-counter-badge">
                {THEME_COLOR_PRESETS[themeAccentColor]?.label || 'ブルー'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(THEME_COLOR_PRESETS) as ThemeAccentColor[]).map((key) => {
                const config = THEME_COLOR_PRESETS[key];
                const isSelected = themeAccentColor === key;
                const dotHex = isDark ? config.swatchDarkHex : config.primaryHex;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onChangeThemeColor(key)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-[4px] text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary-subtle)] dark:bg-[var(--color-primary-subtle-dark)] text-[var(--dads-sumi-900)]'
                        : 'border border-[var(--dads-gray-300)] bg-[var(--dads-gray-100)] hover:bg-[var(--dads-white)] text-[var(--dads-sumi-900)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: dotHex }}
                      />
                      <span className="whitespace-nowrap">{config.label}</span>
                    </div>
                    {isSelected && <Check strokeWidth={2.5} className="h-4 w-4 text-[var(--color-primary)] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 行2: 土日祝日の翌営業日補正 */}
          <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <CalendarCheck strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-[var(--dads-sumi-900)]">
                  土日祝日の翌営業日補正
                </h3>
              </div>
              <p className="text-xs text-[var(--dads-sumi-700)] leading-snug">
                休日の支払日を翌営業日に自動シフト（カード個別設定も可）
              </p>
            </div>

            <label className="dads-switch" aria-label="土日祝日の翌営業日補正を切り替え">
              <input
                type="checkbox"
                checked={adjustForBankHolidays}
                onChange={(e) => onToggleBankHolidayAdjustment(e.target.checked)}
              />
              <span className="dads-switch-track">
                <span className="dads-switch-thumb" />
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. データ管理
          ======================================================== */}
      <section aria-label="データ管理" className="space-y-2.5">
        <div className="dads-section-header">
          <h2 className="dads-section-title">データ管理</h2>
          <span className="dads-tag font-mono">
            カード{cards.length}件 / 口座{accounts.length}件
          </span>
        </div>

        <div className="dads-card p-3.5 sm:p-4 space-y-3">
          <p className="text-xs sm:text-sm text-[var(--dads-sumi-700)]">
            JSON形式でバックアップの保存・復元ができます。
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] theme-bg-primary text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <Download strokeWidth={1.75} className="h-4 w-4" />
              <span>バックアップを保存</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] border border-[var(--color-primary)] bg-[var(--dads-white)] hover:bg-[var(--color-primary-subtle)] dark:hover:bg-[var(--color-primary-subtle-dark)] text-[var(--color-primary)] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <Upload strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)]" />
              <span>ファイルから復元</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. アプリ・その他
          ======================================================== */}
      <section aria-label="アプリ・その他" className="space-y-2.5">
        <div className="dads-section-header">
          <h2 className="dads-section-title">アプリ・その他</h2>
        </div>

        <div className="dads-card divide-y divide-[var(--dads-gray-200)]">
          {/* 行1: ホーム画面に追加（アプリ化） */}
          <div className="p-3.5 sm:p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Smartphone strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-[var(--dads-sumi-900)]">
                  ホーム画面に追加（アプリ化）
                </h3>
              </div>

              {isStandalone ? (
                <span className="text-xs font-bold text-[var(--dads-success)] bg-[var(--dads-success-bg)] px-2 py-0.5 rounded-[4px] border border-[var(--dads-success)] flex items-center gap-1 shrink-0">
                  <Check strokeWidth={2} className="h-3.5 w-3.5" />
                  稼働中
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowInstallSteps((prev) => !prev)}
                  className="dads-action-btn shrink-0"
                  aria-expanded={showInstallSteps}
                >
                  <span>{showInstallSteps ? '手順を閉じる' : '追加手順'}</span>
                  {showInstallSteps ? (
                    <ChevronUp strokeWidth={2} className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown strokeWidth={2} className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Android Chrome 等で利用可能な「ワンタップ追加」ボタン */}
            {deferredPrompt && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] theme-bg-primary text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <Smartphone strokeWidth={1.75} className="h-4 w-4" />
                <span>ホーム画面にアプリを追加</span>
              </button>
            )}

            {/* 折りたたみ式：手動追加手順 */}
            {showInstallSteps && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-[4px] border border-[var(--dads-gray-300)] bg-[var(--dads-gray-100)] space-y-1.5 text-xs">
                  <div className="font-bold text-[var(--dads-sumi-900)] flex items-center gap-1.5">
                    <Smartphone strokeWidth={1.75} className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    <span>iPhone / iPad（Safari）</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-[var(--dads-sumi-700)] leading-relaxed">
                    <li>
                      画面下の「<Share2 strokeWidth={1.75} className="inline h-3.5 w-3.5 text-[var(--color-primary)] mx-0.5" /> <strong>共有</strong>」をタップ
                    </li>
                    <li>
                      「<PlusSquare strokeWidth={1.75} className="inline h-3.5 w-3.5 text-[var(--color-primary)] mx-0.5" /> <strong>ホーム画面に追加</strong>」を選択
                    </li>
                    <li>右上の「追加」をタップして完了</li>
                  </ol>
                </div>

                <div className="p-3 rounded-[4px] border border-[var(--dads-gray-300)] bg-[var(--dads-gray-100)] space-y-1.5 text-xs">
                  <div className="font-bold text-[var(--dads-sumi-900)] flex items-center gap-1.5">
                    <Smartphone strokeWidth={1.75} className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                    <span>Android（Chrome）</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-[var(--dads-sumi-700)] leading-relaxed">
                    <li>
                      右上の「<MoreVertical strokeWidth={1.75} className="inline h-3.5 w-3.5 text-[var(--color-primary)] mx-0.5" /> <strong>メニュー</strong>」をタップ
                    </li>
                    <li>
                      「<strong>アプリをインストール</strong>」または「<strong>ホーム画面に追加</strong>」を選択
                    </li>
                    <li>「インストール」をタップして完了</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* 行2: プライバシーとデータ保存 */}
          <div className="p-3.5 sm:p-4 flex items-start gap-2.5">
            <Shield strokeWidth={1.75} className="h-4 w-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[var(--dads-sumi-900)]">
                プライバシーとデータ保存
              </h3>
              <p className="text-xs text-[var(--dads-sumi-700)] leading-relaxed">
                登録データは端末内（ブラウザ）のみに保存され、外部サーバーへ送信されません。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
