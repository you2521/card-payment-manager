import { ThemeAccentColor, ThemeColorConfig } from '../types';

export interface ExtendedThemeColorConfig extends ThemeColorConfig {
  subtleDarkHex: string;
  lightTextHex: string; // ダークモード時に高い視認性を保つ明るいアクセントテキスト色
}

export const THEME_COLOR_PRESETS: Record<ThemeAccentColor, ExtendedThemeColorConfig> = {
  blue: {
    id: 'blue',
    label: 'ブルー',
    primaryHex: '#0047AB',
    hoverHex: '#003882',
    lightBgHex: '#eff6ff',
    subtleDarkHex: 'rgba(0, 71, 171, 0.25)',
    lightTextHex: '#60a5fa', // 明るい青
  },
  orange: {
    id: 'orange',
    label: 'オレンジ',
    primaryHex: '#ea580c',
    hoverHex: '#c2410c',
    lightBgHex: '#fff7ed',
    subtleDarkHex: 'rgba(234, 88, 12, 0.25)',
    lightTextHex: '#fb923c', // 明るいオレンジ
  },
  green: {
    id: 'green',
    label: 'グリーン',
    primaryHex: '#059669',
    hoverHex: '#047857',
    lightBgHex: '#ecfdf5',
    subtleDarkHex: 'rgba(5, 150, 105, 0.25)',
    lightTextHex: '#34d399', // 明るいグリーン
  },
  purple: {
    id: 'purple',
    label: 'パープル',
    primaryHex: '#7c3aed',
    hoverHex: '#6d28d9',
    lightBgHex: '#f5f3ff',
    subtleDarkHex: 'rgba(124, 58, 237, 0.25)',
    lightTextHex: '#c084fc', // 明るいパープル
  },
  red: {
    id: 'red',
    label: 'レッド',
    primaryHex: '#dc2626',
    hoverHex: '#b91c1c',
    lightBgHex: '#fef2f2',
    subtleDarkHex: 'rgba(220, 38, 38, 0.25)',
    lightTextHex: '#f87171', // 明るいレッド
  },
  slate: {
    id: 'slate',
    label: 'スレート',
    primaryHex: '#334155',
    hoverHex: '#1e293b',
    lightBgHex: '#f8fafc',
    subtleDarkHex: 'rgba(51, 65, 85, 0.35)',
    lightTextHex: '#94a3b8', // 明るいスレート
  },
};

export function getThemeColorConfig(themeColor: ThemeAccentColor = 'blue'): ExtendedThemeColorConfig {
  return THEME_COLOR_PRESETS[themeColor] || THEME_COLOR_PRESETS.blue;
}