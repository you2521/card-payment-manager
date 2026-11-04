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
        ? 'border-[#3c4043] bg-[#202124]/95 text-[#e8eaed]' 
        : 'border-[#dadce0] bg-white/95 text-[#202124] shadow-sm'
    }`}>
      <div className="mx-auto max-w-7xl px-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2.5 py-2.5 sm:py-3 md:flex-row md:items-center md:justify-between">
          {/* App Title & Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shrink-0">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h1 className={`text-sm sm:text-base font-bold tracking-tight flex items-center gap-1.5 ${
                  isDark ? 'text-[#e8eaed]' : 'text-[#202124]'
                }`}>
                  カード＆口座引き落とし管理
                </h1>
              </div>
            </div>

            {/* Mobile Actions: Theme & Calendar */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={onToggleTheme}
                title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
                className={`p-1.5 rounded-full transition-colors border ${
                  isDark
                    ? 'bg-[#303134] text-amber-300 hover:bg-[#3c4043] border-[#3c4043]'
                    : 'bg-gray-100 text-amber-600 hover:bg-gray-200 border-gray-300'
                }`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4 text-slate-700" />}
              </button>

              <button
                onClick={onOpenCalendar}
                title="カレンダー表示"
                className="flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>カレンダー</span>
              </button>
            </div>
          </div>

          {/* Nav Tabs & Primary Actions */}
          <div className="flex items-center justify-between gap-2.5 w-full md:w-auto">
            {/* Segmented Switcher (Expanded) */}
            <div className={`flex items-center rounded-full p-1 border transition-colors w-full md:w-auto flex-1 md:flex-none ${
              isDark ? 'bg-[#171717] border-[#3c4043]' : 'bg-gray-100 border-gray-300'
            }`}>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-[#9aa0a6] hover:text-white hover:bg-[#303134]'
                    : 'text-[#5f6368] hover:text-[#202124] hover:bg-gray-200'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                <span>概要</span>
                <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-700 text-white'
                    : isDark
                    ? 'bg-[#303134] text-[#e8eaed]'
                    : 'bg-gray-200 text-[#202124]'
                }`}>
                  {cardCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('cards')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'cards'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-[#9aa0a6] hover:text-white hover:bg-[#303134]'
                    : 'text-[#5f6368] hover:text-[#202124] hover:bg-gray-200'
                }`}
              >
                <CreditCard className="h-4 w-4 shrink-0" />
                <span>カード</span>
              </button>

              <button
                onClick={() => setActiveTab('accounts')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-6 py-2 text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'accounts'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark
                    ? 'text-[#9aa0a6] hover:text-white hover:bg-[#303134]'
                    : 'text-[#5f6368] hover:text-[#202124] hover:bg-gray-200'
                }`}
              >
                <Landmark className="h-4 w-4 shrink-0" />
                <span>口座</span>
                <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  activeTab === 'accounts'
                    ? 'bg-blue-700 text-white'
                    : isDark
                    ? 'bg-[#303134] text-[#e8eaed]'
                    : 'bg-gray-200 text-[#202124]'
                }`}>
                  {accountCount}
                </span>
              </button>
            </div>

            {/* Right Actions: Theme Switcher & Calendar */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Theme Switcher Button */}
              <button
                onClick={onToggleTheme}
                title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
                className={`hidden md:flex items-center gap-1.5 p-2.5 rounded-full transition-colors border ${
                  isDark
                    ? 'bg-[#303134] text-amber-300 hover:bg-[#3c4043] border-[#3c4043]'
                    : 'bg-gray-100 text-amber-600 hover:bg-gray-200 border-gray-300'
                }`}
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-700" />
                )}
              </button>

              {/* Calendar Modal Trigger Button */}
              <button
                onClick={onOpenCalendar}
                title="支払カレンダーを表示"
                className="hidden md:flex items-center gap-1.5 text-xs px-4 py-2 rounded-full font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                <span>カレンダー</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
