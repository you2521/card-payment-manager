import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  warningDetails?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  message,
  warningDetails,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-[8px] border border-[var(--dads-gray-300)] bg-[var(--dads-white)] p-5 text-[var(--dads-sumi-900)] animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 dads-action-btn px-2"
          title="閉じる"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-3.5">
          <div className="flex items-center gap-2.5 text-[var(--dads-danger)]">
            <div className="p-2 rounded-[4px] bg-[var(--dads-danger-bg)] border border-[var(--dads-danger)]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--dads-sumi-900)]">{title}</h3>
          </div>

          <p className="text-xs sm:text-sm text-[var(--dads-sumi-700)] leading-relaxed">{message}</p>

          {warningDetails && (
            <div className="p-2.5 rounded-[4px] bg-[var(--dads-warning-bg)] border border-[var(--dads-warning-border)] text-[var(--dads-warning-text)] text-xs leading-relaxed font-medium">
              {warningDetails}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-[4px] border border-[var(--dads-gray-300)] bg-[var(--dads-white)] text-xs font-bold text-[var(--dads-sumi-900)] hover:bg-[var(--dads-gray-100)] transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-2 rounded-[4px] bg-[var(--dads-danger)] hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer"
            >
              削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
