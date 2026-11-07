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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--dads-white)] border-t border-[var(--dads-gray-300)] transition-colors pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-14 items-center">
        {/* 1. 概要 */}
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)]'
          }`}
        >
          <LayoutDashboard strokeWidth={activeTab === 'dashboard' ? 2.25 : 1.75} className="h-5 w-5" />
          <span className="text-[11px] mt-0.5 tracking-tight">概要</span>
          {activeTab === 'dashboard' && (
            <span className="absolute top-0 left-3 right-3 h-[3px] bg-[var(--color-primary)]" />
          )}
        </button>

        {/* 2. カード */}
        <button
          type="button"
          onClick={() => setActiveTab('cards')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'cards'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)]'
          }`}
        >
          <CreditCard strokeWidth={activeTab === 'cards' ? 2.25 : 1.75} className="h-5 w-5" />
          <span className="text-[11px] mt-0.5 tracking-tight">カード</span>
          {activeTab === 'cards' && (
            <span className="absolute top-0 left-3 right-3 h-[3px] bg-[var(--color-primary)]" />
          )}
        </button>

        {/* 3. 口座 */}
        <button
          type="button"
          onClick={() => setActiveTab('accounts')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'accounts'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)]'
          }`}
        >
          <Landmark strokeWidth={activeTab === 'accounts' ? 2.25 : 1.75} className="h-5 w-5" />
          <span className="text-[11px] mt-0.5 tracking-tight">口座</span>
          {activeTab === 'accounts' && (
            <span className="absolute top-0 left-3 right-3 h-[3px] bg-[var(--color-primary)]" />
          )}
        </button>

        {/* 4. カレンダー */}
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'calendar'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)]'
          }`}
        >
          <Calendar strokeWidth={activeTab === 'calendar' ? 2.25 : 1.75} className="h-5 w-5" />
          <span className="text-[11px] mt-0.5 tracking-tight">カレンダー</span>
          {activeTab === 'calendar' && (
            <span className="absolute top-0 left-3 right-3 h-[3px] bg-[var(--color-primary)]" />
          )}
        </button>

        {/* 5. 設定・保存 */}
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`relative flex flex-col items-center justify-center h-full py-1 transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'text-[var(--color-primary)] font-bold'
              : 'text-[var(--dads-sumi-700)] hover:text-[var(--dads-sumi-900)]'
          }`}
        >
          <Settings strokeWidth={activeTab === 'settings' ? 2.25 : 1.75} className="h-5 w-5" />
          <span className="text-[11px] mt-0.5 tracking-tight">設定・保存</span>
          {activeTab === 'settings' && (
            <span className="absolute top-0 left-3 right-3 h-[3px] bg-[var(--color-primary)]" />
          )}
        </button>
      </div>
    </nav>
  );
};
