import { ThemeAccentColor, ThemeColorConfig } from '../types';

export interface ExtendedThemeColorConfig extends ThemeColorConfig {
  /** ライトモード時の淡いタグ枠線色 (--dads-primary-100) */
  lightBorderHex: string;
  /** ダークモード時にテキスト・アイコン・枠線・アクティブ表示で高い視認性を保つアクセント色 */
  darkPrimaryHex: string;
  /** ダークモード時の白文字塗りつぶしボタン背景色 */
  darkBtnBgHex: string;
  /** ダークモード時のボタンホバー・アクティブ背景色 */
  darkBtnHoverHex: string;
  /** ダークモード時のタイル・タグ背景色 */
  subtleDarkHex: string;
  /** ダークモード時のタイル・タグ枠線色 */
  subtleDarkBorderHex: string;
  /** ダークモード時のパレット見本ドット色 */
  swatchDarkHex: string;
}

/**
 * デジタル庁デザインシステム (DADS) 準拠カラートークン
 */
export const THEME_COLOR_PRESETS: Record<ThemeAccentColor, ExtendedThemeColorConfig> = {
  blue: {
    id: 'blue',
    label: 'ブルー',
    primaryHex: '#0017C1',      // DADS Blue 800 (Primary)
    hoverHex: '#00118F',        // DADS Blue 900
    lightBgHex: '#F2F7FF',      // DADS Blue 50
    lightBorderHex: '#C5DDFB',  // DADS Blue 100/200
    darkPrimaryHex: '#70B0FF',  // DADS Dark Primary Text/Border
    darkBtnBgHex: '#0037D6',    // DADS Dark Primary Button Fill
    darkBtnHoverHex: '#2563EB',
    subtleDarkHex: 'rgba(59, 130, 246, 0.18)',
    subtleDarkBorderHex: 'rgba(112, 176, 255, 0.38)',
    swatchDarkHex: '#60A5FA',
  },
  orange: {
    id: 'orange',
    label: 'オレンジ',
    primaryHex: '#C2410C',      // DADS Orange 800
    hoverHex: '#9A3412',        // DADS Orange 900
    lightBgHex: '#FFF7ED',      // DADS Orange 50
    lightBorderHex: '#FED7AA',  // DADS Orange 200
    darkPrimaryHex: '#FB923C',
    darkBtnBgHex: '#D94E0F',
    darkBtnHoverHex: '#EA580C',
    subtleDarkHex: 'rgba(249, 115, 22, 0.18)',
    subtleDarkBorderHex: 'rgba(251, 146, 60, 0.38)',
    swatchDarkHex: '#FB923C',
  },
  green: {
    id: 'green',
    label: 'グリーン',
    primaryHex: '#197A4B',      // DADS Success/Forest Green 800
    hoverHex: '#115E38',        // DADS Green 900
    lightBgHex: '#E6F4EC',      // DADS Green 50
    lightBorderHex: '#B7E2C9',  // DADS Green 200
    darkPrimaryHex: '#4ADE80',
    darkBtnBgHex: '#197A4B',
    darkBtnHoverHex: '#22995E',
    subtleDarkHex: 'rgba(25, 122, 75, 0.24)',
    subtleDarkBorderHex: 'rgba(74, 222, 128, 0.38)',
    swatchDarkHex: '#34D399',
  },
  purple: {
    id: 'purple',
    label: 'パープル',
    primaryHex: '#5B21B6',      // DADS Purple 800
    hoverHex: '#4C1D95',        // DADS Purple 900
    lightBgHex: '#F5F3FF',      // DADS Purple 50
    lightBorderHex: '#DDD6FE',  // DADS Purple 200
    darkPrimaryHex: '#C4B5FD',
    darkBtnBgHex: '#6D28D9',
    darkBtnHoverHex: '#7C3AED',
    subtleDarkHex: 'rgba(139, 92, 246, 0.20)',
    subtleDarkBorderHex: 'rgba(196, 181, 253, 0.38)',
    swatchDarkHex: '#A78BFA',
  },
  red: {
    id: 'red',
    label: 'レッド',
    primaryHex: '#B91C1C',      // DADS Red 800
    hoverHex: '#991B1B',        // DADS Red 900
    lightBgHex: '#FEF2F2',      // DADS Red 50
    lightBorderHex: '#FECACA',  // DADS Red 200
    darkPrimaryHex: '#FCA5A5',
    darkBtnBgHex: '#C81E1E',
    darkBtnHoverHex: '#DC2626',
    subtleDarkHex: 'rgba(220, 38, 38, 0.20)',
    subtleDarkBorderHex: 'rgba(252, 165, 165, 0.38)',
    swatchDarkHex: '#F87171',
  },
  slate: {
    id: 'slate',
    label: 'スレート',
    primaryHex: '#334155',      // DADS Sumi/Slate 800
    hoverHex: '#1E293B',        // DADS Sumi/Slate 900
    lightBgHex: '#F1F5F9',      // DADS Slate 50
    lightBorderHex: '#CBD5E1',  // DADS Slate 200
    darkPrimaryHex: '#E2E8F0',
    darkBtnBgHex: '#475569',
    darkBtnHoverHex: '#64748B',
    subtleDarkHex: 'rgba(148, 163, 184, 0.20)',
    subtleDarkBorderHex: 'rgba(226, 232, 240, 0.38)',
    swatchDarkHex: '#94A3B8',
  },
};

export function getThemeColorConfig(themeColor: ThemeAccentColor = 'blue'): ExtendedThemeColorConfig {
  return THEME_COLOR_PRESETS[themeColor] || THEME_COLOR_PRESETS.blue;
}
