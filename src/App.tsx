import React, { useState, useEffect } from 'react';
import { CreditCard, BankAccount, ActiveTab, ThemeAccentColor } from './types';
import { getThemeColorConfig } from './utils/themeColors';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { CardManagementView } from './components/CardManagementView';
import { AccountManagementView } from './components/AccountManagementView';
import { CalendarView } from './components/CalendarView';
import { SettingsView } from './components/SettingsView';
import { CardModal } from './components/CardModal';
import { AccountModal } from './components/AccountModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

const CARDS_STORAGE_KEY = 'card_payment_manager_cards_v2';
const ACCOUNTS_STORAGE_KEY = 'card_payment_manager_accounts_v2';
const THEME_STORAGE_KEY = 'card_payment_manager_theme_v2';
const ACCENT_COLOR_STORAGE_KEY = 'card_payment_manager_accent_v2';
const BANK_HOLIDAY_ADJUST_KEY = 'card_payment_manager_adjust_holiday_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Theme State ('light' | 'dark')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.error('Failed to load theme', e);
    }
    return 'light';
  });

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // デザインアクセントカラー設定（ブルー、オレンジ、グリーン、パープル、レッド、スレート）
  const [themeAccentColor, setThemeAccentColor] = useState<ThemeAccentColor>(() => {
    try {
      const saved = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY) as ThemeAccentColor | null;
      if (saved && ['blue', 'orange', 'green', 'purple', 'red', 'slate'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.error('Failed to load accent color', e);
    }
    return 'blue';
  });

  const handleSelectThemeAccent = (color: ThemeAccentColor) => {
    setThemeAccentColor(color);
    localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, color);
  };

  // テーマカラーをルートCSS変数に適用
  useEffect(() => {
    const config = getThemeColorConfig(themeAccentColor);
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.primaryHex);
    root.style.setProperty('--color-primary-hover', config.hoverHex);
    root.style.setProperty('--color-primary-subtle', config.lightBgHex);
    root.style.setProperty('--color-primary-subtle-dark', config.subtleDarkHex);
  }, [themeAccentColor]);

  // 金融機関休業日（土日祝日）補正設定
  const [adjustForBankHolidays, setAdjustForBankHolidays] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(BANK_HOLIDAY_ADJUST_KEY);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return true; // デフォルトで有効
  });

  const handleToggleBankHolidayAdjustment = (enabled: boolean) => {
    setAdjustForBankHolidays(enabled);
    localStorage.setItem(BANK_HOLIDAY_ADJUST_KEY, JSON.stringify(enabled));
  };

  // Load state from localStorage - 初期データは完全「0件」（まっさら）でスタート
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    try {
      const saved = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load accounts from localStorage', e);
    }
    return [];
  });

  const [creditCards, setCreditCards] = useState<CreditCard[]>(() => {
    try {
      const saved = localStorage.getItem(CARDS_STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load cards from localStorage', e);
    }
    return [];
  });

  // Persist to localStorage on state changes
  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(creditCards));
  }, [creditCards]);

  // Modal states（カード登録・編集、口座登録・編集、削除確認のみモーダルで管理）
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  // Delete modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    type: 'card' | 'account';
    id?: string;
    title: string;
    message: string;
    warningDetails?: string;
  }>({
    isOpen: false,
    type: 'card',
    title: '',
    message: '',
  });

  // Card Handlers
  const handleOpenAddCard = () => {
    setEditingCard(null);
    setIsCardModalOpen(true);
  };

  const handleOpenEditCard = (card: CreditCard) => {
    setEditingCard(card);
    setIsCardModalOpen(true);
  };

  const handleSaveCard = (cardData: Omit<CreditCard, 'id'>, cardId?: string) => {
    if (cardId) {
      setCreditCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...cardData, id: cardId } : c))
      );
    } else {
      const newCard: CreditCard = {
        ...cardData,
        id: `card-${Date.now()}`,
      };
      setCreditCards((prev) => [...prev, newCard]);
    }
  };

  const handleRequestDeleteCard = (cardId: string) => {
    const card = creditCards.find((c) => c.id === cardId);
    if (!card) return;

    setDeleteConfirmState({
      isOpen: true,
      type: 'card',
      id: cardId,
      title: 'クレジットカードの削除確認',
      message: `「${card.name}」を削除してもよろしいですか？この操作は取り消せません。`,
    });
  };

  // Account Handlers
  const handleOpenAddAccount = () => {
    setEditingAccount(null);
    setIsAccountModalOpen(true);
  };

  const handleOpenEditAccount = (account: BankAccount) => {
    setEditingAccount(account);
    setIsAccountModalOpen(true);
  };

  const handleSaveAccount = (accountData: Omit<BankAccount, 'id'>, accountId?: string) => {
    if (accountId) {
      setBankAccounts((prev) =>
        prev.map((a) => (a.id === accountId ? { ...accountData, id: accountId } : a))
      );
    } else {
      const newAccount: BankAccount = {
        ...accountData,
        id: `acc-${Date.now()}`,
      };
      setBankAccounts((prev) => [...prev, newAccount]);
    }
  };

  const handleRequestDeleteAccount = (accountId: string) => {
    const account = bankAccounts.find((a) => a.id === accountId);
    if (!account) return;

    const linkedCards = creditCards.filter((c) => c.bankAccountId === accountId);
    let warningDetails: string | undefined = undefined;

    if (linkedCards.length > 0) {
      warningDetails = `この口座は現在 ${linkedCards.length} 枚のカード（${linkedCards
        .map((c) => c.name)
        .join('、')}）の引き落とし口座に設定されています。削除するとカード側の口座設定が未設定になります。`;
    }

    setDeleteConfirmState({
      isOpen: true,
      type: 'account',
      id: accountId,
      title: '引き落とし口座の削除確認',
      message: `「${account.name}」を削除してもよろしいですか？`,
      warningDetails,
    });
  };

  const handleConfirmDelete = () => {
    const { type, id } = deleteConfirmState;
    if (type === 'card' && id) {
      setCreditCards((prev) => prev.filter((c) => c.id !== id));
    } else if (type === 'account' && id) {
      setBankAccounts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // 復元処理（インポート）
  const handleRestoreData = (newCards: CreditCard[], newAccounts: BankAccount[]) => {
    setCreditCards(newCards);
    setBankAccounts(newAccounts);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col transition-colors ${
      isDark ? 'bg-[#12151a] text-[#f0f2f5]' : 'bg-[#f4f6f8] text-[#1a1f26]'
    }`}>
      {/* デジタル庁風トップアクセントバー */}
      <div className="h-1 w-full theme-bg-primary" />

      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cardCount={creditCards.length}
        accountCount={bankAccounts.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAddCard={handleOpenAddCard}
        onOpenAddAccount={handleOpenAddAccount}
      />

      {/* Main Container (スマホではボトムナビの高さ分 pb-20 を確保) */}
      <main className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-6 flex-1 w-full space-y-4 pb-20 md:pb-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            cards={creditCards}
            accounts={bankAccounts}
            adjustForBankHolidays={adjustForBankHolidays}
            onEditCard={handleOpenEditCard}
            onDeleteCard={handleRequestDeleteCard}
            onEditAccount={handleOpenEditAccount}
            onOpenAddCard={handleOpenAddCard}
            onOpenAddAccount={handleOpenAddAccount}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'cards' && (
          <CardManagementView
            cards={creditCards}
            accounts={bankAccounts}
            onOpenAddCard={handleOpenAddCard}
            onEditCard={handleOpenEditCard}
            onDeleteCard={handleRequestDeleteCard}
            onOpenAddAccount={handleOpenAddAccount}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountManagementView
            accounts={bankAccounts}
            cards={creditCards}
            onOpenAddAccount={handleOpenAddAccount}
            onEditAccount={handleOpenEditAccount}
            onDeleteAccount={handleRequestDeleteAccount}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            cards={creditCards}
            accounts={bankAccounts}
            adjustForBankHolidays={adjustForBankHolidays}
            onEditCard={handleOpenEditCard}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            cards={creditCards}
            accounts={bankAccounts}
            adjustForBankHolidays={adjustForBankHolidays}
            onToggleBankHolidayAdjustment={handleToggleBankHolidayAdjustment}
            onRestoreData={handleRestoreData}
            themeAccentColor={themeAccentColor}
            onChangeThemeColor={handleSelectThemeAccent}
          />
        )}
      </main>

      {/* デジタル庁デザインシステム準拠のクリーンなフッター (改行防止) */}
      <footer className={`border-t py-4 md:py-6 text-xs transition-colors mb-14 md:mb-0 ${
        isDark ? 'border-[#262c36] bg-[#161a20] text-[#8e98a8]' : 'border-[#d0d5dd] bg-white text-[#475467]'
      }`}>
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span className="inline-block w-2 h-2 theme-bg-primary rounded-xs" />
            <span className={`font-bold whitespace-nowrap ${isDark ? 'text-[#f0f2f5]' : 'text-[#101828]'}`}>
              カード＆口座引き落とし管理
            </span>
            <span className="text-[10px] text-[#667085] whitespace-nowrap">（完全端末内保存・通信なし）</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#667085]">
            <button
              onClick={() => setActiveTab('settings')}
              className="underline hover:text-[var(--color-primary)] cursor-pointer"
            >
              設定・バックアップ
            </button>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">デジタル庁デザインシステム準拠</span>
          </div>
        </div>
      </footer>

      {/* スマホ用ボトムナビゲーション (5つのタブすべてシームレスにページ遷移) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cardCount={creditCards.length}
        accountCount={bankAccounts.length}
      />

      {/* Modals（データ登録・編集、削除確認） */}
      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        onSave={handleSaveCard}
        editingCard={editingCard}
        bankAccounts={bankAccounts}
        onOpenAddAccountModal={() => {
          setIsCardModalOpen(false);
          handleOpenAddAccount();
        }}
        onDeleteCard={handleRequestDeleteCard}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSave={handleSaveAccount}
        editingAccount={editingAccount}
        onDeleteAccount={handleRequestDeleteAccount}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmState.isOpen}
        title={deleteConfirmState.title}
        message={deleteConfirmState.message}
        warningDetails={deleteConfirmState.warningDetails}
        onClose={() => setDeleteConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}