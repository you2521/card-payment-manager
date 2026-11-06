import React from 'react';
import { CreditCard, Landmark, LayoutDashboard, Calendar, Sun, Moon, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cardCount: number;
  accountCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAddCard: () => void;
  onOpenAddAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cardCount,
  accountCount,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-30 border-b transition-colors backdrop-blur-md pt-[env(safe-area-inset-top)] ${
      isDark 
        ? 'border-[#262c36] bg-[#161a20]/95 text-[#f0f2f5]' 
        : 'border-[#d0d5dd] bg-white/95 text-[#101828]'
    }`}>
      <div className="mx-auto max-w-6xl px-3.5 sm:px-6">
        <div className="flex items-center justify-between py-2.5 sm:py-3">
          
          {/* Service Title & Line Icon (サイト内は端正な線アイコンで統一) */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <CreditCard
              strokeWidth={1.75}
              className="h-5 w-5 text-[var(--color-primary)] shrink-0"
            />
            <div className="min-w-0">
              <h1 className={`text-sm sm:text-base font-bold tracking-tight whitespace-nowrap ${
                isDark ? 'text-white' : 'text-[#101828]'
              }`}>
                カード＆口座引き落とし管理
              </h1>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* テーマ切替ボタン（線アイコン） */}
            <button
              onClick={onToggleTheme}
              title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-md transition-colors border flex items-center gap-1.5 text-xs cursor-pointer ${
                isDark
                  ? 'bg-[#222730] text-[#f0f2f5] hover:bg-[#2c333f] border-[#363f4e]'
                  : 'bg-[#f4f6f8] text-[#344054] hover:bg-[#eaecf0] border-[#d0d5dd]'
              }`}
            >
              {isDark ? (
                <Sun strokeWidth={1.75} className="h-4 w-4 text-amber-300" />
              ) : (
                <Moon strokeWidth={1.75} className="h-4 w-4 text-[#475467]" />
              )}
              <span className="hidden sm:inline font-medium">{isDark ? 'ライト' : 'ダーク'}</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs (PCでのみ表示) */}
        <nav className="hidden md:flex items-center space-x-6 border-t border-[#d0d5dd]/40 dark:border-[#262c36] -mb-[1px]">
          {/* 1. 概要 */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[#667085] dark:text-[#98a2b3] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <LayoutDashboard strokeWidth={1.75} className="h-4 w-4 shrink-0" />
            <span>概要</span>
          </button>

          {/* 2. カード管理 */}
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[#667085] dark:text-[#98a2b3] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <CreditCard strokeWidth={1.75} className="h-4 w-4 shrink-0" />
            <span>カード管理</span>
            {cardCount > 0 && (
              <span className="text-xs font-mono text-[#667085] dark:text-[#98a2b3] font-normal">
                ({cardCount})
              </span>
            )}
          </button>

          {/* 3. 引き落とし口座 */}
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[#667085] dark:text-[#98a2b3] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <Landmark strokeWidth={1.75} className="h-4 w-4 shrink-0" />
            <span>引き落とし口座</span>
            {accountCount > 0 && (
              <span className="text-xs font-mono text-[#667085] dark:text-[#98a2b3] font-normal">
                ({accountCount})
              </span>
            )}
          </button>

          {/* 4. カレンダー */}
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[#667085] dark:text-[#98a2b3] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <Calendar strokeWidth={1.75} className="h-4 w-4 shrink-0" />
            <span>カレンダー</span>
          </button>

          {/* 5. 設定・保存 */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[#667085] dark:text-[#98a2b3] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <Settings strokeWidth={1.75} className="h-4 w-4 shrink-0" />
            <span>設定・保存</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
