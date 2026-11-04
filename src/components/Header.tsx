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
        : 'border-[#d0d5dd] bg-white/95 text-[#101828] shadow-xs'
    }`}>
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className="flex items-center justify-between py-2.5 sm:py-3">
          
          {/* Service Title & Logo (スマホでも絶対に省略されない1行フル表示) */}
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <img
              src="./icons/icon-192.png"
              alt="アプリロゴ"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg shrink-0 shadow-xs object-cover"
            />
            <div className="min-w-0">
              <h1 className={`text-sm sm:text-base font-bold tracking-tight whitespace-nowrap ${
                isDark ? 'text-white' : 'text-[#101828]'
              }`}>
                カード＆口座引き落とし管理
              </h1>
              <p className={`text-[10px] hidden md:block ${
                isDark ? 'text-[#8e98a8]' : 'text-[#667085]'
              }`}>
                支払日・引き落とし口座の一元管理ツール
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* テーマ切替ボタン */}
            <button
              onClick={onToggleTheme}
              title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-md transition-colors border flex items-center gap-1 text-xs cursor-pointer ${
                isDark
                  ? 'bg-[#222730] text-amber-300 hover:bg-[#2c333f] border-[#363f4e]'
                  : 'bg-[#f4f6f8] text-[#344054] hover:bg-[#eaecf0] border-[#d0d5dd]'
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">{isDark ? 'ライト' : 'ダーク'}</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs (PCでのみ表示、5つのタブを網羅) */}
        <nav className="hidden md:flex items-center space-x-6 border-t border-[#d0d5dd]/40 dark:border-[#262c36] -mb-[1px]">
          {/* 1. 概要 */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>概要</span>
            {cardCount > 0 && (
              <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-xs ${
                activeTab === 'dashboard'
                  ? 'theme-bg-subtle text-[var(--color-primary)] font-bold'
                  : 'bg-[#f0f2f5] dark:bg-[#222730] text-[#667085] dark:text-[#8e98a8]'
              }`}>
                {cardCount}
              </span>
            )}
          </button>

          {/* 2. カード管理 */}
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <CreditCard className="h-4 w-4 shrink-0" />
            <span>カード管理</span>
            {cardCount > 0 && (
              <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-xs ${
                activeTab === 'cards'
                  ? 'theme-bg-subtle text-[var(--color-primary)] font-bold'
                  : 'bg-[#f0f2f5] dark:bg-[#222730] text-[#667085] dark:text-[#8e98a8]'
              }`}>
                {cardCount}
              </span>
            )}
          </button>

          {/* 3. 引き落とし口座 */}
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <Landmark className="h-4 w-4 shrink-0" />
            <span>引き落とし口座</span>
            {accountCount > 0 && (
              <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded-xs ${
                activeTab === 'accounts'
                  ? 'theme-bg-subtle text-[var(--color-primary)] font-bold'
                  : 'bg-[#f0f2f5] dark:bg-[#222730] text-[#667085] dark:text-[#8e98a8]'
              }`}>
                {accountCount}
              </span>
            )}
          </button>

          {/* 4. カレンダー */}
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <Calendar className="h-4 w-4 shrink-0" />
            <span>カレンダー</span>
          </button>

          {/* 5. 設定・保存 */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>設定・保存</span>
          </button>
        </nav>
      </div>
    </header>
  );
};