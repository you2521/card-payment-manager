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
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className="flex flex-col gap-2 pt-3 pb-0 md:flex-row md:items-center md:justify-between">
          
          {/* Service Title & Logo (デジタル庁基準のクリーンなデザイン) */}
          <div className="flex items-center justify-between pb-1 md:pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0047AB] text-white shrink-0 shadow-xs">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h1 className={`text-base font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-[#101828]'
                }`}>
                  カード＆口座引き落とし管理
                </h1>
                <p className={`text-[10px] hidden sm:block ${
                  isDark ? 'text-[#8e98a8]' : 'text-[#667085]'
                }`}>
                  支払日・引き落とし口座の一元管理ツール
                </p>
              </div>
            </div>

            {/* Mobile Actions: Theme & Calendar */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={onToggleTheme}
                title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
                className={`p-2 rounded-md transition-colors border min-h-[40px] min-w-[40px] flex items-center justify-center ${
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
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md font-bold transition-all bg-[#0047AB] hover:bg-[#003882] text-white shadow-xs min-h-[40px]"
              >
                <Calendar className="h-4 w-4" />
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

        {/* Navigation Tabs (デジタル庁デザインシステム準拠のアクティブ下線タブ) */}
        <nav className="flex items-center space-x-1 sm:space-x-4 border-t border-[#d0d5dd]/40 dark:border-[#262c36] -mb-[1px]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-[#0047AB] text-[#0047AB] dark:text-[#5294e2] dark:border-[#5294e2]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            <span>概要</span>
            {cardCount > 0 && (
              <span className={`ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded-xs ${
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
            className={`flex items-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'border-[#0047AB] text-[#0047AB] dark:text-[#5294e2] dark:border-[#5294e2]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <CreditCard className="h-4 w-4 shrink-0" />
            <span>カード管理</span>
            {cardCount > 0 && (
              <span className={`ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded-xs ${
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
            className={`flex items-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-[#0047AB] text-[#0047AB] dark:text-[#5294e2] dark:border-[#5294e2]'
                : 'border-transparent text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
            }`}
          >
            <Landmark className="h-4 w-4 shrink-0" />
            <span>引き落とし口座</span>
            {accountCount > 0 && (
              <span className={`ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded-xs ${
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
