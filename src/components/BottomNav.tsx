import React from 'react';
import { LayoutDashboard, CreditCard, Landmark, Calendar, Settings } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  cardCount: number;
  accountCount: number;
  onOpenCalendar: () => void;
  onOpenSettings: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  cardCount,
  accountCount,
  onOpenCalendar,
  onOpenSettings,
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
              ? 'text-[#0047AB] dark:text-[#5294e2] font-bold'
              : 'text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="h-5 w-5" />
            {cardCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#0047AB] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                {cardCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">概要</span>
          {activeTab === 'dashboard' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 bg-[#0047AB] dark:bg-[#5294e2] rounded-full" />
          )}
        </button>

        {/* 2. カード */}
        <button
          type="button"
          onClick={() => setActiveTab('cards')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'cards'
              ? 'text-[#0047AB] dark:text-[#5294e2] font-bold'
              : 'text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <div className="relative">
            <CreditCard className="h-5 w-5" />
            {cardCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#0047AB] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                {cardCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">カード</span>
          {activeTab === 'cards' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 bg-[#0047AB] dark:bg-[#5294e2] rounded-full" />
          )}
        </button>

        {/* 3. 口座 */}
        <button
          type="button"
          onClick={() => setActiveTab('accounts')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'accounts'
              ? 'text-[#0047AB] dark:text-[#5294e2] font-bold'
              : 'text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5]'
          }`}
        >
          <div className="relative">
            <Landmark className="h-5 w-5" />
            {accountCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#0047AB] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                {accountCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">口座</span>
          {activeTab === 'accounts' && (
            <span className="absolute top-0 left-3 right-3 h-0.5 bg-[#0047AB] dark:bg-[#5294e2] rounded-full" />
          )}
        </button>

        {/* 4. カレンダー */}
        <button
          type="button"
          onClick={onOpenCalendar}
          className="flex flex-col items-center justify-center h-full py-1 text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5] transition-colors cursor-pointer"
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">カレンダー</span>
        </button>

        {/* 5. データ・設定 */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center h-full py-1 text-[#667085] dark:text-[#8e98a8] hover:text-[#101828] dark:hover:text-[#f0f2f5] transition-colors cursor-pointer"
        >
          <Settings className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">設定・保存</span>
        </button>
      </div>
    </nav>
  );
};
