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
    <header className="sticky top-0 z-30 border-b border-[var(--dads-gray-300)] bg-[var(--dads-white)] text-[var(--dads-sumi-900)] transition-colors pt-[env(safe-area-inset-top)]">
      <div className="mx-auto max-w-6xl px-3.5 sm:px-6">
        <div className="flex items-center justify-between py-2.5 sm:py-3">
          {/* Service Title & Line Icon (サイト内は端正な線アイコンで統一) */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <CreditCard
              strokeWidth={1.75}
              className="h-5 w-5 text-[var(--color-primary)] shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-[15px] sm:text-base font-bold tracking-tight whitespace-nowrap text-[var(--dads-sumi-900)]">
                カード＆口座引き落とし管理
              </h1>
            </div>
          </div>

          {/* Right Actions - DADS Secondary Outline Button (4px角丸) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onToggleTheme}
              title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
              className="px-2.5 py-1.5 rounded-[4px] transition-colors border border-[var(--color-primary)] bg-[var(--dads-white)] hover:bg-[var(--color-primary-subtle)] dark:hover:bg-[var(--color-primary-subtle-dark)] text-[var(--color-primary)] flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              {isDark ? (
                <Sun strokeWidth={2} className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Moon strokeWidth={2} className="h-3.5 w-3.5 text-[var(--color-primary)]" />
              )}
              <span className="hidden sm:inline">{isDark ? 'ライト' : 'ダーク'}</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs (PCでのみ表示) */}
        <nav className="hidden md:flex items-center space-x-6 border-t border-[var(--dads-gray-200)] -mb-[1px]">
          {/* 1. 概要 */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 py-2.5 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)]'
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
                : 'border-transparent text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)]'
            }`}
          >
            <CreditCard strokeWidth={1.75} className="h-4 w-4 shrink-0" />
            <span>カード管理</span>
            {cardCount > 0 && (
              <span className="text-xs font-mono text-[var(--dads-sumi-700)] font-bold">
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
                : 'border-transparent text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)]'
            }`}
          >
            <Landmark strokeWidth={1.75} className="h-4 w-4 shrink-0" />
            <span>引き落とし口座</span>
            {accountCount > 0 && (
              <span className="text-xs font-mono text-[var(--dads-sumi-700)] font-bold">
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
                : 'border-transparent text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)]'
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
                : 'border-transparent text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)]'
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
