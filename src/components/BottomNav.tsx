import React from 'react';
import { LayoutDashboard, CreditCard, Landmark, Calendar, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav
      aria-label="ボトムナビゲーション"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#161a20]/95 backdrop-blur-md border-t border-[#d0d5dd] dark:border-[#262c36] transition-colors pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-14 items-center">
        {/* 1. 概要 */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[#667085] dark:text-[#98a2b3] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <LayoutDashboard strokeWidth={activeTab === 'dashboard' ? 2 : 1.75} className="h-5 w-5" />
          <span className="text-[10px] mt-1">概要</span>
          {activeTab === 'dashboard' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 bg-[var(--color-primary)] rounded-full" />
          )}
        </button>

        {/* 2. カード */}
        <button
          type="button"
          onClick={() => setActiveTab('cards')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'cards'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[#667085] dark:text-[#98a2b3] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <CreditCard strokeWidth={activeTab === 'cards' ? 2 : 1.75} className="h-5 w-5" />
          <span className="text-[10px] mt-1">カード</span>
          {activeTab === 'cards' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 bg-[var(--color-primary)] rounded-full" />
          )}
        </button>

        {/* 3. 口座 */}
        <button
          type="button"
          onClick={() => setActiveTab('accounts')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'accounts'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[#667085] dark:text-[#98a2b3] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <Landmark strokeWidth={activeTab === 'accounts' ? 2 : 1.75} className="h-5 w-5" />
          <span className="text-[10px] mt-1">口座</span>
          {activeTab === 'accounts' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 bg-[var(--color-primary)] rounded-full" />
          )}
        </button>

        {/* 4. カレンダー */}
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'calendar'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[#667085] dark:text-[#98a2b3] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <Calendar strokeWidth={activeTab === 'calendar' ? 2 : 1.75} className="h-5 w-5" />
          <span className="text-[10px] mt-1">カレンダー</span>
          {activeTab === 'calendar' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 bg-[var(--color-primary)] rounded-full" />
          )}
        </button>

        {/* 5. 設定・保存 */}
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[#667085] dark:text-[#98a2b3] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <Settings strokeWidth={activeTab === 'settings' ? 2 : 1.75} className="h-5 w-5" />
          <span className="text-[10px] mt-1">設定・保存</span>
          {activeTab === 'settings' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 bg-[var(--color-primary)] rounded-full" />
          )}
        </button>
      </div>
    </nav>
  );
};
