export interface BrandColorConfig {
  id: string;
  label: string;
  hex: string;
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
    hex: '#6366f1',
    bgClass: 'bg-indigo-500',
    borderClass: 'border-indigo-500/40',
    textClass: 'text-indigo-400',
    badgeStyleDark: { backgroundColor: 'rgba(99, 102, 241, 0.18)', borderColor: 'rgba(99, 102, 241, 0.45)', color: '#a5b4fc' },
    badgeStyleLight: { backgroundColor: 'rgba(99, 102, 241, 0.10)', borderColor: 'rgba(99, 102, 241, 0.35)', color: '#3730a3' },
  },
  blue: {
    id: 'blue',
    label: 'ブルー',
    hex: '#3b82f6',
    bgClass: 'bg-blue-500',
    borderClass: 'border-blue-500/40',
    textClass: 'text-blue-400',
    badgeStyleDark: { backgroundColor: 'rgba(59, 130, 246, 0.18)', borderColor: 'rgba(59, 130, 246, 0.45)', color: '#93c5fd' },
    badgeStyleLight: { backgroundColor: 'rgba(59, 130, 246, 0.10)', borderColor: 'rgba(59, 130, 246, 0.35)', color: '#1e40af' },
  },
  cyan: {
    id: 'cyan',
    label: 'シアン',
    hex: '#06b6d4',
    bgClass: 'bg-cyan-500',
    borderClass: 'border-cyan-500/40',
    textClass: 'text-cyan-400',
    badgeStyleDark: { backgroundColor: 'rgba(6, 182, 212, 0.18)', borderColor: 'rgba(6, 182, 212, 0.45)', color: '#67e8f9' },
    badgeStyleLight: { backgroundColor: 'rgba(6, 182, 212, 0.10)', borderColor: 'rgba(6, 182, 212, 0.35)', color: '#0e7490' },
  },
  teal: {
    id: 'teal',
    label: 'ティール',
    hex: '#14b8a6',
    bgClass: 'bg-teal-500',
    borderClass: 'border-teal-500/40',
    textClass: 'text-teal-400',
    badgeStyleDark: { backgroundColor: 'rgba(20, 184, 166, 0.18)', borderColor: 'rgba(20, 184, 166, 0.45)', color: '#5eead4' },
    badgeStyleLight: { backgroundColor: 'rgba(20, 184, 166, 0.10)', borderColor: 'rgba(20, 184, 166, 0.35)', color: '#0f766e' },
  },
  emerald: {
    id: 'emerald',
    label: 'エメラルド',
    hex: '#10b981',
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-500/40',
    textClass: 'text-emerald-400',
    badgeStyleDark: { backgroundColor: 'rgba(16, 185, 129, 0.18)', borderColor: 'rgba(16, 185, 129, 0.45)', color: '#6ee7b7' },
    badgeStyleLight: { backgroundColor: 'rgba(16, 185, 129, 0.10)', borderColor: 'rgba(16, 185, 129, 0.35)', color: '#065f46' },
  },
  amber: {
    id: 'amber',
    label: 'アンバー',
    hex: '#f59e0b',
    bgClass: 'bg-amber-500',
    borderClass: 'border-amber-500/40',
    textClass: 'text-amber-400',
    badgeStyleDark: { backgroundColor: 'rgba(245, 158, 11, 0.18)', borderColor: 'rgba(245, 158, 11, 0.45)', color: '#fde047' },
    badgeStyleLight: { backgroundColor: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.40)', color: '#92400e' },
  },
  orange: {
    id: 'orange',
    label: 'オレンジ',
    hex: '#f97316',
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-500/40',
    textClass: 'text-orange-400',
    badgeStyleDark: { backgroundColor: 'rgba(249, 115, 22, 0.18)', borderColor: 'rgba(249, 115, 22, 0.45)', color: '#fdba74' },
    badgeStyleLight: { backgroundColor: 'rgba(249, 115, 22, 0.10)', borderColor: 'rgba(249, 115, 22, 0.35)', color: '#9a3412' },
  },
  rose: {
    id: 'rose',
    label: 'ローズ',
    hex: '#f43f5e',
    bgClass: 'bg-rose-500',
    borderClass: 'border-rose-500/40',
    textClass: 'text-rose-400',
    badgeStyleDark: { backgroundColor: 'rgba(244, 63, 94, 0.18)', borderColor: 'rgba(244, 63, 94, 0.45)', color: '#fda4af' },
    badgeStyleLight: { backgroundColor: 'rgba(244, 63, 94, 0.10)', borderColor: 'rgba(244, 63, 94, 0.35)', color: '#9f1239' },
  },
  purple: {
    id: 'purple',
    label: 'パープル',
    hex: '#a855f7',
    bgClass: 'bg-purple-500',
    borderClass: 'border-purple-500/40',
    textClass: 'text-purple-400',
    badgeStyleDark: { backgroundColor: 'rgba(168, 85, 247, 0.18)', borderColor: 'rgba(168, 85, 247, 0.45)', color: '#d8b4fe' },
    badgeStyleLight: { backgroundColor: 'rgba(168, 85, 247, 0.10)', borderColor: 'rgba(168, 85, 247, 0.35)', color: '#6b21a8' },
  },
  fuchsia: {
    id: 'fuchsia',
    label: 'ピンク',
    hex: '#d946ef',
    bgClass: 'bg-fuchsia-500',
    borderClass: 'border-fuchsia-500/40',
    textClass: 'text-fuchsia-400',
    badgeStyleDark: { backgroundColor: 'rgba(217, 70, 239, 0.18)', borderColor: 'rgba(217, 70, 239, 0.45)', color: '#f0abfc' },
    badgeStyleLight: { backgroundColor: 'rgba(217, 70, 239, 0.10)', borderColor: 'rgba(217, 70, 239, 0.35)', color: '#86198f' },
  },
  slate: {
    id: 'slate',
    label: 'スレート',
    hex: '#64748b',
    bgClass: 'bg-slate-500',
    borderClass: 'border-slate-500/40',
    textClass: 'text-slate-300',
    badgeStyleDark: { backgroundColor: 'rgba(100, 116, 139, 0.18)', borderColor: 'rgba(100, 116, 139, 0.45)', color: '#e2e8f0' },
    badgeStyleLight: { backgroundColor: 'rgba(100, 116, 139, 0.10)', borderColor: 'rgba(100, 116, 139, 0.35)', color: '#334155' },
  },
  gold: {
    id: 'gold',
    label: 'ゴールド',
    hex: '#eab308',
    bgClass: 'bg-yellow-500',
    borderClass: 'border-yellow-500/40',
    textClass: 'text-yellow-400',
    badgeStyleDark: { backgroundColor: 'rgba(234, 179, 8, 0.18)', borderColor: 'rgba(234, 179, 8, 0.45)', color: '#fef08a' },
    badgeStyleLight: { backgroundColor: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.40)', color: '#854d0e' },
  },
};

export function getBrandColorConfig(brandColor?: string, isDark: boolean = true): BrandColorConfig & { badgeStyle: { backgroundColor: string; borderColor: string; color: string } } {
  if (brandColor && BRAND_COLORS[brandColor]) {
    const config = BRAND_COLORS[brandColor];
    return {
      ...config,
      badgeStyle: isDark ? config.badgeStyleDark : config.badgeStyleLight,
    };
  }

  // Handle custom hex or rgb color string (e.g., "#10b981")
  if (brandColor && (brandColor.startsWith('#') || brandColor.startsWith('rgb'))) {
    const hex = brandColor.startsWith('#') ? brandColor : '#6366f1';
    return {
      id: hex,
      label: 'カスタム',
      hex: hex,
      bgClass: '',
      borderClass: '',
      textClass: '',
      badgeStyleDark: {
        backgroundColor: `${hex}2e`,
        borderColor: `${hex}73`,
        color: '#ffffff',
      },
      badgeStyleLight: {
        backgroundColor: `${hex}1a`,
        borderColor: `${hex}4d`,
        color: hex,
      },
      badgeStyle: isDark
        ? { backgroundColor: `${hex}2e`, borderColor: `${hex}73`, color: '#ffffff' }
        : { backgroundColor: `${hex}1a`, borderColor: `${hex}4d`, color: hex },
    };
  }

  const config = BRAND_COLORS.indigo;
  return {
    ...config,
    badgeStyle: isDark ? config.badgeStyleDark : config.badgeStyleLight,
  };
}
