import React from 'react';
import { LayoutDashboard, CreditCard, Landmark, Calendar, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cardCount: number;
  accountCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  cardCount,
  accountCount,
}) => {
  return (
    <nav
      aria-label="ボトムナビゲーション"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#161a20]/95 backdrop-blur-md border-t border-[#d0d5dd] dark:border-[#262c36] shadow-lg transition-colors pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-14 items-center">
        {/* 1. 概要 */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="h-5 w-5" />
            {cardCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full theme-bg-primary text-white text-[9px] font-mono font-bold flex items-center justify-center">
                {cardCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">概要</span>
          {activeTab === 'dashboard' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 theme-bg-primary rounded-full" />
          )}
        </button>

        {/* 2. カード */}
        <button
          type="button"
          onClick={() => setActiveTab('cards')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'cards'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <div className="relative">
            <CreditCard className="h-5 w-5" />
            {cardCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full theme-bg-primary text-white text-[9px] font-mono font-bold flex items-center justify-center">
                {cardCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">カード</span>
          {activeTab === 'cards' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 theme-bg-primary rounded-full" />
          )}
        </button>

        {/* 3. 口座 */}
        <button
          type="button"
          onClick={() => setActiveTab('accounts')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'accounts'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <div className="relative">
            <Landmark className="h-5 w-5" />
            {accountCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full theme-bg-primary text-white text-[9px] font-mono font-bold flex items-center justify-center">
                {accountCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">口座</span>
          {activeTab === 'accounts' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 theme-bg-primary rounded-full" />
          )}
        </button>

        {/* 4. カレンダー */}
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'calendar'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">カレンダー</span>
          {activeTab === 'calendar' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 theme-bg-primary rounded-full" />
          )}
        </button>

        {/* 5. 設定・保存 */}
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">設定・保存</span>
          {activeTab === 'settings' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 theme-bg-primary rounded-full" />
          )}
        </button>
      </div>
    </nav>
  );
};