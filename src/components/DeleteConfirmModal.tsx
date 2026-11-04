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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-lg border border-[#d0d5dd] dark:border-[#2e3642] bg-white dark:bg-[#1a1f26] shadow-xl p-5 text-[#101828] dark:text-[#f0f2f5] animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-md text-[#667085] hover:text-[#101828] dark:hover:text-white hover:bg-[#eaecf0] dark:hover:bg-[#2c333f]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-[#d92d20]">
            <div className="p-2 rounded-md bg-[#d92d20]/10 border border-[#d92d20]/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#101828] dark:text-white">{title}</h3>
          </div>

          <p className="text-xs text-[#475467] dark:text-[#98a2b3] leading-relaxed">{message}</p>

          {warningDetails && (
            <div className="p-2.5 rounded-md bg-[#b54708]/10 border border-[#b54708]/30 text-[#b54708] text-xs leading-relaxed">
              ⚠️ {warningDetails}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-md border border-[#d0d5dd] dark:border-[#363f4e] text-xs font-bold text-[#344054] dark:text-[#cfd5e0] hover:bg-[#f4f6f8] dark:hover:bg-[#222730] transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-2 rounded-md bg-[#d92d20] hover:bg-[#b42318] text-white text-xs font-bold transition-all shadow-xs"
            >
              削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
