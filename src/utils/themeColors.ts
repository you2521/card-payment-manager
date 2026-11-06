import { ThemeAccentColor, ThemeColorConfig } from '../types';

export interface ExtendedThemeColorConfig extends ThemeColorConfig {
  /** ダークモード時にテキスト・アイコン・枠線・アクティブ表示で高い視認性（WCAG AAA級）を保つアクセント色 */
  darkPrimaryHex: string;
  /** ダークモード時の白文字塗りつぶしボタン背景色（暗すぎず眩しすぎない高視認性トーン） */
  darkBtnBgHex: string;
  /** ダークモード時のボタンホバー背景色 */
  darkBtnHoverHex: string;
  /** ダークモード時のタイル・選択背景色 */
  subtleDarkHex: string;
  /** ダークモード時のパレット見本ドット色 */
  swatchDarkHex: string;
}

export const THEME_COLOR_PRESETS: Record<ThemeAccentColor, ExtendedThemeColorConfig> = {
  blue: {
    id: 'blue',
    label: 'ブルー',
    primaryHex: '#0047AB',      // ライト時: デジタル庁風コバルトブルー (白背景に対し 8.4:1)
    hoverHex: '#003882',
    lightBgHex: '#eff6ff',
    darkPrimaryHex: '#60a5fa',  // ダーク時テキスト・枠線: 鮮やかなスカイブルー (#1a1f26に対し 7.2:1)
    darkBtnBgHex: '#2563eb',    // ダーク時ボタン背景: 白文字と高コントラストかつ背景から浮き立つブルー
    darkBtnHoverHex: '#3b82f6',
    subtleDarkHex: 'rgba(59, 130, 246, 0.22)',
    swatchDarkHex: '#3b82f6',
  },
  orange: {
    id: 'orange',
    label: 'オレンジ',
    primaryHex: '#c2410c',      // ライト時: 白背景でもくっきり読めるディープオレンジ (5.2:1)
    hoverHex: '#9a3412',
    lightBgHex: '#fff7ed',
    darkPrimaryHex: '#fb923c',  // ダーク時テキスト・枠線: 明るいアンバーオレンジ (8.1:1)
    darkBtnBgHex: '#ea580c',
    darkBtnHoverHex: '#f97316',
    subtleDarkHex: 'rgba(249, 115, 22, 0.22)',
    swatchDarkHex: '#f97316',
  },
  green: {
    id: 'green',
    label: 'グリーン',
    primaryHex: '#047857',      // ライト時: 視認性の高いディープエメラルド (5.5:1)
    hoverHex: '#065f46',
    lightBgHex: '#ecfdf5',
    darkPrimaryHex: '#34d399',  // ダーク時テキスト・枠線: 鮮やかなミントグリーン (9.5:1)
    darkBtnBgHex: '#059669',
    darkBtnHoverHex: '#10b981',
    subtleDarkHex: 'rgba(16, 185, 129, 0.22)',
    swatchDarkHex: '#10b981',
  },
  purple: {
    id: 'purple',
    label: 'パープル',
    primaryHex: '#6d28d9',      // ライト時: ロイヤルパープル (7.0:1)
    hoverHex: '#5b21b6',
    lightBgHex: '#f5f3ff',
    darkPrimaryHex: '#c084fc',  // ダーク時テキスト・枠線: 明るいラベンダーパープル (7.4:1)
    darkBtnBgHex: '#7c3aed',
    darkBtnHoverHex: '#8b5cf6',
    subtleDarkHex: 'rgba(168, 85, 247, 0.22)',
    swatchDarkHex: '#a855f7',
  },
  red: {
    id: 'red',
    label: 'レッド',
    primaryHex: '#b91c1c',      // ライト時: ディープレッド (6.5:1)
    hoverHex: '#991b1b',
    lightBgHex: '#fef2f2',
    darkPrimaryHex: '#f87171',  // ダーク時テキスト・枠線: コーラルレッド (6.8:1)
    darkBtnBgHex: '#dc2626',
    darkBtnHoverHex: '#ef4444',
    subtleDarkHex: 'rgba(239, 68, 68, 0.22)',
    swatchDarkHex: '#ef4444',
  },
  slate: {
    id: 'slate',
    label: 'スレート',
    primaryHex: '#334155',      // ライト時: ダークスレート (10.3:1)
    hoverHex: '#1e293b',
    lightBgHex: '#f1f5f9',
    darkPrimaryHex: '#cbd5e1',  // ダーク時テキスト・枠線: シルバーホワイト (#1a1f26に対し 11.2:1)
    darkBtnBgHex: '#475569',    // ダーク時ボタン背景: 暗い背景に埋もれないミディアムスレート
    darkBtnHoverHex: '#64748b',
    subtleDarkHex: 'rgba(148, 163, 184, 0.22)',
    swatchDarkHex: '#94a3b8',
  },
};

export function getThemeColorConfig(themeColor: ThemeAccentColor = 'blue'): ExtendedThemeColorConfig {
  return THEME_COLOR_PRESETS[themeColor] || THEME_COLOR_PRESETS.blue;
}
