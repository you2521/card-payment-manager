export interface BrandColorConfig {
  id: string;
  label: string;
  /** ライトモード時の高視認性ドット・インジケーター色 */
  hex: string;
  /** ダークモード時の高視認性ドット・インジケーター色（暗い背景で沈まない明度） */
  darkHex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeStyleDark: {
    backgroundColor: string;
    borderColor: string;
    color: string;
  };
  badgeStyleLight: {
    backgroundColor: string;
    borderColor: string;
    color: string;
  };
}

export const BRAND_COLORS: Record<string, BrandColorConfig> = {
  indigo: {
    id: 'indigo',
    label: 'インディゴ',
    hex: '#4f46e5',
    darkHex: '#818cf8',
    bgClass: 'bg-indigo-500',
    borderClass: 'border-indigo-500/40',
    textClass: 'text-indigo-400',
    badgeStyleDark: { backgroundColor: 'rgba(99, 102, 241, 0.22)', borderColor: 'rgba(129, 140, 248, 0.5)', color: '#c7d2fe' },
    badgeStyleLight: { backgroundColor: 'rgba(79, 70, 229, 0.10)', borderColor: 'rgba(79, 70, 229, 0.35)', color: '#3730a3' },
  },
  blue: {
    id: 'blue',
    label: 'ブルー',
    hex: '#2563eb',
    darkHex: '#60a5fa',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-500/40',
    textClass: 'text-blue-400',
    badgeStyleDark: { backgroundColor: 'rgba(59, 130, 246, 0.22)', borderColor: 'rgba(96, 165, 250, 0.5)', color: '#bfdbfe' },
    badgeStyleLight: { backgroundColor: 'rgba(37, 99, 235, 0.10)', borderColor: 'rgba(37, 99, 235, 0.35)', color: '#1e40af' },
  },
  cyan: {
    id: 'cyan',
    label: 'シアン',
    hex: '#0891b2',
    darkHex: '#22d3ee',
    bgClass: 'bg-cyan-500',
    borderClass: 'border-cyan-500/40',
    textClass: 'text-cyan-400',
    badgeStyleDark: { backgroundColor: 'rgba(6, 182, 212, 0.22)', borderColor: 'rgba(34, 211, 238, 0.5)', color: '#a5f3fc' },
    badgeStyleLight: { backgroundColor: 'rgba(8, 145, 178, 0.10)', borderColor: 'rgba(8, 145, 178, 0.35)', color: '#0e7490' },
  },
  teal: {
    id: 'teal',
    label: 'ティール',
    hex: '#0d9488',
    darkHex: '#2dd4bf',
    bgClass: 'bg-teal-500',
    borderClass: 'border-teal-500/40',
    textClass: 'text-teal-400',
    badgeStyleDark: { backgroundColor: 'rgba(20, 184, 166, 0.22)', borderColor: 'rgba(45, 212, 191, 0.5)', color: '#99f6e4' },
    badgeStyleLight: { backgroundColor: 'rgba(13, 148, 136, 0.10)', borderColor: 'rgba(13, 148, 136, 0.35)', color: '#0f766e' },
  },
  emerald: {
    id: 'emerald',
    label: 'エメラルド',
    hex: '#059669',
    darkHex: '#34d399',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-500/40',
    textClass: 'text-emerald-400',
    badgeStyleDark: { backgroundColor: 'rgba(16, 185, 129, 0.22)', borderColor: 'rgba(52, 211, 153, 0.5)', color: '#a7f3d0' },
    badgeStyleLight: { backgroundColor: 'rgba(5, 150, 105, 0.10)', borderColor: 'rgba(5, 150, 105, 0.35)', color: '#065f46' },
  },
  amber: {
    id: 'amber',
    label: 'アンバー',
    hex: '#d97706',
    darkHex: '#fbbf24',
    bgClass: 'bg-amber-500',
    borderClass: 'border-amber-500/40',
    textClass: 'text-amber-400',
    badgeStyleDark: { backgroundColor: 'rgba(245, 158, 11, 0.22)', borderColor: 'rgba(251, 191, 36, 0.5)', color: '#fde68a' },
    badgeStyleLight: { backgroundColor: 'rgba(217, 119, 6, 0.12)', borderColor: 'rgba(217, 119, 6, 0.40)', color: '#92400e' },
  },
  orange: {
    id: 'orange',
    label: 'オレンジ',
    hex: '#ea580c',
    darkHex: '#fb923c',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-500/40',
    textClass: 'text-orange-400',
    badgeStyleDark: { backgroundColor: 'rgba(249, 115, 22, 0.22)', borderColor: 'rgba(251, 146, 60, 0.5)', color: '#fed7aa' },
    badgeStyleLight: { backgroundColor: 'rgba(234, 88, 12, 0.10)', borderColor: 'rgba(234, 88, 12, 0.35)', color: '#9a3412' },
  },
  rose: {
    id: 'rose',
    label: 'ローズ',
    hex: '#e11d48',
    darkHex: '#fb7185',
    bgClass: 'bg-rose-500',
    borderClass: 'border-rose-500/40',
    textClass: 'text-rose-400',
    badgeStyleDark: { backgroundColor: 'rgba(244, 63, 94, 0.22)', borderColor: 'rgba(251, 113, 133, 0.5)', color: '#fecdd3' },
    badgeStyleLight: { backgroundColor: 'rgba(225, 29, 72, 0.10)', borderColor: 'rgba(225, 29, 72, 0.35)', color: '#9f1239' },
  },
  purple: {
    id: 'purple',
    label: 'パープル',
    hex: '#9333ea',
    darkHex: '#c084fc',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-500/40',
    textClass: 'text-purple-400',
    badgeStyleDark: { backgroundColor: 'rgba(168, 85, 247, 0.22)', borderColor: 'rgba(192, 132, 252, 0.5)', color: '#e9d5ff' },
    badgeStyleLight: { backgroundColor: 'rgba(147, 51, 234, 0.10)', borderColor: 'rgba(147, 51, 234, 0.35)', color: '#6b21a8' },
  },
  fuchsia: {
    id: 'fuchsia',
    label: 'ピンク',
    hex: '#c026d3',
    darkHex: '#e879f9',
    bgClass: 'bg-fuchsia-500',
    borderClass: 'border-fuchsia-500/40',
    textClass: 'text-fuchsia-400',
    badgeStyleDark: { backgroundColor: 'rgba(217, 70, 239, 0.22)', borderColor: 'rgba(232, 121, 249, 0.5)', color: '#f5d0fe' },
    badgeStyleLight: { backgroundColor: 'rgba(192, 38, 211, 0.10)', borderColor: 'rgba(192, 38, 211, 0.35)', color: '#86198f' },
  },
  slate: {
    id: 'slate',
    label: 'スレート',
    hex: '#475569',
    darkHex: '#cbd5e1',
    bgClass: 'bg-slate-500',
    borderClass: 'border-slate-500/40',
    textClass: 'text-slate-300',
    badgeStyleDark: { backgroundColor: 'rgba(148, 163, 184, 0.22)', borderColor: 'rgba(203, 213, 225, 0.5)', color: '#f1f5f9' },
    badgeStyleLight: { backgroundColor: 'rgba(71, 85, 105, 0.12)', borderColor: 'rgba(71, 85, 105, 0.35)', color: '#334155' },
  },
  gold: {
    id: 'gold',
    label: 'ゴールド',
    hex: '#ca8a04',
    darkHex: '#facc15',
    bgClass: 'bg-yellow-500',
    borderClass: 'border-yellow-500/40',
    textClass: 'text-yellow-400',
    badgeStyleDark: { backgroundColor: 'rgba(234, 179, 8, 0.22)', borderColor: 'rgba(250, 204, 21, 0.5)', color: '#fef08a' },
    badgeStyleLight: { backgroundColor: 'rgba(202, 138, 4, 0.15)', borderColor: 'rgba(202, 138, 4, 0.40)', color: '#854d0e' },
  },
};

/**
 * 銀行口座のプリセットカラー定義（ライト/ダーク双方で高視認性のペアを提供）
 */
export interface AccountColorPreset {
  id: string;
  name: string;
  lightHex: string;
  darkHex: string;
}

export const ACCOUNT_COLOR_PRESETS: AccountColorPreset[] = [
  { id: '#0047AB', name: 'ブルー', lightHex: '#0047AB', darkHex: '#60a5fa' },
  { id: '#004B23', name: 'グリーン (三井住友)', lightHex: '#15803d', darkHex: '#4ade80' },
  { id: '#BF0000', name: 'クリムゾン (三菱UFJ/楽天)', lightHex: '#dc2626', darkHex: '#f87171' },
  { id: '#003399', name: 'ネイビー (みずほ)', lightHex: '#1d4ed8', darkHex: '#818cf8' },
  { id: '#FF6600', name: 'オレンジ (ゆうちょ)', lightHex: '#ea580c', darkHex: '#fb923c' },
  { id: '#10B981', name: 'エメラルド (りそな)', lightHex: '#059669', darkHex: '#34d399' },
  { id: '#0284C7', name: 'スカイ (住信SBI)', lightHex: '#0284c7', darkHex: '#38bdf8' },
  { id: '#FF0033', name: 'レッド (PayPay)', lightHex: '#e11d48', darkHex: '#fb7185' },
  { id: '#0F766E', name: 'ティール (ソニー)', lightHex: '#0d9488', darkHex: '#2dd4bf' },
  { id: '#6B21A8', name: 'パープル', lightHex: '#7e22ce', darkHex: '#c084fc' },
  { id: '#475467', name: 'グレー', lightHex: '#475467', darkHex: '#cbd5e1' },
];

/**
 * 任意のHEXカラーについて、ダークモード時に暗すぎる場合やライトモード時に明るすぎる場合に
 * 視認性の高いHEXカラーに自動補正して返すヘルパー関数
 */
export function getAccessibleColorHex(rawHex: string | undefined, isDark: boolean): string {
  if (!rawHex) return isDark ? '#60a5fa' : '#0047AB';

  const normalized = rawHex.trim().toUpperCase();

  // プリセットおよびサジェスト色の直接マッピング
  const presetMap: Record<string, { light: string; dark: string }> = {
    '#0047AB': { light: '#0047AB', dark: '#60a5fa' },
    '#004B23': { light: '#15803d', dark: '#4ade80' }, // 三井住友グリーン: ダーク時は明るいグリーン、ライト時は鮮やかなフォレストグリーン
    '#16A34A': { light: '#16a34a', dark: '#4ade80' },
    '#BF0000': { light: '#dc2626', dark: '#f87171' }, // 三菱UFJ/楽天クリムゾン
    '#003399': { light: '#1d4ed8', dark: '#818cf8' }, // みずほネイビー
    '#FF6600': { light: '#ea580c', dark: '#fb923c' }, // オレンジ
    '#D97706': { light: '#d97706', dark: '#fbbf24' }, // アンバー
    '#10B981': { light: '#059669', dark: '#34d399' }, // エメラルド
    '#0284C7': { light: '#0284c7', dark: '#38bdf8' }, // スカイ
    '#0EA5E9': { light: '#0284c7', dark: '#38bdf8' },
    '#FF0033': { light: '#e11d48', dark: '#fb7185' }, // PayPayレッド
    '#0F766E': { light: '#0d9488', dark: '#2dd4bf' }, // ソニーティール
    '#6B21A8': { light: '#7e22ce', dark: '#c084fc' }, // パープル
    '#EC4899': { light: '#db2777', dark: '#f472b6' }, // ピンク
    '#475467': { light: '#475467', dark: '#cbd5e1' }, // グレー
  };

  if (presetMap[normalized]) {
    return isDark ? presetMap[normalized].dark : presetMap[normalized].light;
  }

  // カスタムHEX色の場合は相対輝度を計算し、ダークモードで暗すぎる場合は明るく、ライトモードで白すぎる場合は引き締める
  if (/^#[0-9A-F]{6}$/i.test(normalized)) {
    const r = parseInt(normalized.slice(1, 3), 16);
    const g = parseInt(normalized.slice(3, 5), 16);
    const b = parseInt(normalized.slice(5, 7), 16);
    // 知覚輝度 (0 - 255)
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (isDark && lum < 115) {
      // ダークモードで暗いカスタム色が選ばれた場合、白方向に45%ブレンドして発光させる
      const lift = (c: number) => Math.min(255, Math.round(c + (255 - c) * 0.48));
      return `#${lift(r).toString(16).padStart(2, '0')}${lift(g).toString(16).padStart(2, '0')}${lift(b).toString(16).padStart(2, '0')}`;
    }
    if (!isDark && lum > 205) {
      // ライトモードで白に近いカスタム色が選ばれた場合、暗方向に35%引き締める
      const darken = (c: number) => Math.max(0, Math.round(c * 0.65));
      return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
    }
  }

  return rawHex;
}

export function getBrandColorConfig(
  brandColor?: string,
  isDark: boolean = false
): BrandColorConfig & {
  badgeStyle: { backgroundColor: string; borderColor: string; color: string };
} {
  if (brandColor && BRAND_COLORS[brandColor]) {
    const config = BRAND_COLORS[brandColor];
    return {
      ...config,
      // テーマに合わせて高視認性のHEXを返す
      hex: isDark ? config.darkHex : config.hex,
      badgeStyle: isDark ? config.badgeStyleDark : config.badgeStyleLight,
    };
  }

  // カスタムHEX色またはRGB文字列の場合
  if (brandColor && (brandColor.startsWith('#') || brandColor.startsWith('rgb'))) {
    const rawHex = brandColor.startsWith('#') ? brandColor : '#4f46e5';
    const accessibleHex = getAccessibleColorHex(rawHex, isDark);
    return {
      id: rawHex,
      label: 'カスタム',
      hex: accessibleHex,
      darkHex: accessibleHex,
      bgClass: '',
      borderClass: '',
      textClass: '',
      badgeStyleDark: {
        backgroundColor: `${accessibleHex}2e`,
        borderColor: `${accessibleHex}73`,
        color: '#ffffff',
      },
      badgeStyleLight: {
        backgroundColor: `${accessibleHex}1a`,
        borderColor: `${accessibleHex}4d`,
        color: accessibleHex,
      },
      badgeStyle: isDark
        ? { backgroundColor: `${accessibleHex}2e`, borderColor: `${accessibleHex}73`, color: '#ffffff' }
        : { backgroundColor: `${accessibleHex}1a`, borderColor: `${accessibleHex}4d`, color: accessibleHex },
    };
  }

  const config = BRAND_COLORS.indigo;
  return {
    ...config,
    hex: isDark ? config.darkHex : config.hex,
    badgeStyle: isDark ? config.badgeStyleDark : config.badgeStyleLight,
  };
}
