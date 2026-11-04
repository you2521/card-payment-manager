import React, { useState, useEffect } from 'react';
import { CreditCard, BankAccount, ActiveTab } from './types';
import { INITIAL_BANK_ACCOUNTS, INITIAL_CREDIT_CARDS } from './data/initialData';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CardManagementView } from './components/CardManagementView';
import { AccountManagementView } from './components/AccountManagementView';
import { CardModal } from './components/CardModal';
import { AccountModal } from './components/AccountModal';
import { CalendarModal } from './components/CalendarModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

const CARDS_STORAGE_KEY = 'card_payment_manager_cards_v1';
const ACCOUNTS_STORAGE_KEY = 'card_payment_manager_accounts_v1';
const THEME_STORAGE_KEY = 'card_payment_manager_theme_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Theme State ('dark' | 'light')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.error('Failed to load theme', e);
    }
    return 'dark';
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

  // Load state from localStorage or initialize with dummy data
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
    return INITIAL_BANK_ACCOUNTS;
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
    return INITIAL_CREDIT_CARDS;
  });

  // Persist to localStorage on state changes
  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  useEffect(() => {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(creditCards));
  }, [creditCards]);

  // Modal states
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Delete modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    type: 'card' | 'account' | 'reset';
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
      // Update
      setCreditCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...cardData, id: cardId } : c))
      );
    } else {
      // Create
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
      title: 'クレジットカードの削除',
      message: `「${card.name}」を削除してもよろしいですか？`,
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
      // Update
      setBankAccounts((prev) =>
        prev.map((a) => (a.id === accountId ? { ...accountData, id: accountId } : a))
      );
    } else {
      // Create
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
        .join('、')}）の引き落とし口座に指定されています。削除するとカード側の口座指定が解除されます。`;
    }

    setDeleteConfirmState({
      isOpen: true,
      type: 'account',
      id: accountId,
      title: '銀行口座の削除',
      message: `「${account.name}」を削除しますか？`,
      warningDetails,
    });
  };

  const handleConfirmDelete = () => {
    const { type, id } = deleteConfirmState;
    if (type === 'card' && id) {
      setCreditCards((prev) => prev.filter((c) => c.id !== id));
    } else if (type === 'account' && id) {
      setBankAccounts((prev) => prev.filter((a) => a.id !== id));
    } else if (type === 'reset') {
      setBankAccounts(INITIAL_BANK_ACCOUNTS);
      setCreditCards(INITIAL_CREDIT_CARDS);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col transition-colors ${
      isDark ? 'bg-[#171717] text-[#e8eaed]' : 'bg-[#f8f9fa] text-[#1f1f1f]'
    }`}>
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cardCount={creditCards.length}
        accountCount={bankAccounts.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCalendar={() => setIsCalendarModalOpen(true)}
        onOpenAddCard={handleOpenAddCard}
        onOpenAddAccount={handleOpenAddAccount}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-2.5 py-4 sm:px-6 sm:py-6 lg:px-8 flex-1 w-full space-y-4 sm:space-y-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            cards={creditCards}
            accounts={bankAccounts}
            onEditCard={handleOpenEditCard}
            onDeleteCard={handleRequestDeleteCard}
            onEditAccount={handleOpenEditAccount}
            onOpenAddCard={handleOpenAddCard}
            onOpenAddAccount={handleOpenAddAccount}
          />
        )}

        {activeTab === 'cards' && (
          <CardManagementView
            cards={creditCards}
            accounts={bankAccounts}
            onOpenAddCard={handleOpenAddCard}
            onEditCard={handleOpenEditCard}
            onDeleteCard={handleRequestDeleteCard}
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
      </main>

      {/* Footer */}
      <footer className={`mt-12 border-t py-6 text-center text-xs transition-colors ${
        isDark ? 'border-[#3c4043] bg-[#202124] text-[#9aa0a6]' : 'border-[#dadce0] bg-white text-[#5f6368]'
      }`}>
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className={`font-medium ${isDark ? 'text-[#e8eaed]' : 'text-[#202124]'}`}>カード＆口座引き落とし管理</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmState({
                  isOpen: true,
                  type: 'reset',
                  title: 'サンプルデータの復元',
                  message: '登録データを初期サンプルデータにリセットしますか？（現在のデータは上書きされます）',
                });
              }}
              className="text-[11px] underline hover:text-blue-500 transition-colors cursor-pointer"
            >
              初期サンプルを復元
            </button>
            <span>Google Flat Design Theme ({isDark ? 'Dark Mode' : 'Light Mode'})</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
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

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        cards={creditCards}
        accounts={bankAccounts}
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
