import React from 'react';
import { CreditCard, Landmark, LayoutDashboard, Calendar, Sun, Moon } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cardCount: number;
  accountCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCalendar: () => void;
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
  onOpenCalendar,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-30 border-b transition-colors backdrop-blur-md ${
      isDark 
        ? 'border-[#262c36] bg-[#161a20]/95 text-[#f0f2f5]' 
        : 'border-[#d0d5dd] bg-white/95 text-[#101828] shadow-xs'
    }`}>
      <div className="mx-auto max-w-6xl px-2.5 sm:px-6">
        <div className="flex flex-col gap-1.5 pt-2.5 pb-0 md:flex-row md:items-center md:justify-between">
          
          {/* Service Title & Logo (スマホで1行に収まるよう最適化) */}
          <div className="flex items-center justify-between pb-1 md:pb-3 gap-2">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-md bg-[#0047AB] text-white shrink-0 shadow-xs">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <h1 className={`text-sm sm:text-base font-bold tracking-tight whitespace-nowrap truncate ${
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

            {/* Mobile Actions: コンパクトかつ押しやすいサイズ */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              <button
                onClick={onToggleTheme}
                title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
                className={`p-1.5 rounded-md transition-colors border flex items-center justify-center h-8 w-8 ${
                  isDark
                    ? 'bg-[#222730] text-amber-300 hover:bg-[#2c333f] border-[#363f4e]'
                    : 'bg-[#f4f6f8] text-[#344054] hover:bg-[#eaecf0] border-[#d0d5dd]'
                }`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={onOpenCalendar}
                title="カレンダー表示"
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md font-bold transition-all bg-[#0047AB] hover:bg-[#003882] text-white shadow-xs h-8"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>カレンダー</span>
              </button>
            </div>
          </div>

          {/* Desktop Right Actions: Theme & Calendar */}
          <div className="hidden md:flex items-center gap-2 pb-3">
            <button
              onClick={onToggleTheme}
              title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                isDark
                  ? 'bg-[#222730] text-[#cfd5e0] hover:bg-[#2c333f] border-[#363f4e]'
                  : 'bg-white text-[#344054] hover:bg-[#f4f6f8] border-[#d0d5dd]'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>ライト</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-[#344054]" />
                  <span>ダーク</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenCalendar}
              title="支払カレンダーを表示"
              className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-md font-bold transition-all bg-[#0047AB] hover:bg-[#003882] text-white shadow-xs cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>支払カレンダー</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (3等分グリッドで改行を完全に防ぎ、等幅に配置) */}
        <nav className="grid grid-cols-3 border-t border-[#d0d5dd]/40 dark:border-[#262c36] -mb-[1px]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-[#0047AB] text-[#0047AB] dark:text-[#5294e2] dark:border-[#5294e2]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span>概要</span>
            {cardCount > 0 && (
              <span className={`text-[10px] sm:text-[11px] font-mono px-1 sm:px-1.5 py-0.2 rounded-xs ${
                activeTab === 'dashboard'
                  ? 'bg-[#0047AB]/10 text-[#0047AB] dark:bg-[#5294e2]/20 dark:text-[#5294e2]'
                  : 'bg-[#f0f2f5] dark:bg-[#222730] text-[#667085] dark:text-[#8e98a8]'
              }`}>
                {cardCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cards'
                ? 'border-[#0047AB] text-[#0047AB] dark:text-[#5294e2] dark:border-[#5294e2]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="hidden sm:inline">カード管理</span>
            <span className="sm:hidden">カード</span>
            {cardCount > 0 && (
              <span className={`text-[10px] sm:text-[11px] font-mono px-1 sm:px-1.5 py-0.2 rounded-xs ${
                activeTab === 'cards'
                  ? 'bg-[#0047AB]/10 text-[#0047AB] dark:bg-[#5294e2]/20 dark:text-[#5294e2]'
                  : 'bg-[#f0f2f5] dark:bg-[#222730] text-[#667085] dark:text-[#8e98a8]'
              }`}>
                {cardCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'accounts'
                ? 'border-[#0047AB] text-[#0047AB] dark:text-[#5294e2] dark:border-[#5294e2]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <Landmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="hidden sm:inline">引き落とし口座</span>
            <span className="sm:hidden">口座</span>
            {accountCount > 0 && (
              <span className={`text-[10px] sm:text-[11px] font-mono px-1 sm:px-1.5 py-0.2 rounded-xs ${
                activeTab === 'accounts'
                  ? 'bg-[#0047AB]/10 text-[#0047AB] dark:bg-[#5294e2]/20 dark:text-[#5294e2]'
                  : 'bg-[#f0f2f5] dark:bg-[#222730] text-[#667085] dark:text-[#8e98a8]'
              }`}>
                {accountCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
