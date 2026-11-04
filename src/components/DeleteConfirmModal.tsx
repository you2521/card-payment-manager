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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-2xl border border-[#3c4043] bg-[#202124] shadow-2xl p-4 sm:p-6 text-[#e8eaed] animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 rounded-full text-[#9aa0a6] hover:text-white hover:bg-[#303134] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3 sm:mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">{title}</h3>
          <p className="text-xs text-[#9aa0a6] mb-3.5 leading-relaxed">{message}</p>

          {warningDetails && (
            <div className="w-full p-2.5 sm:p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-left mb-4">
              ⚠️ {warningDetails}
            </div>
          )}

          <div className="flex items-center gap-2.5 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2 sm:py-2.5 rounded-full border border-[#3c4043] bg-[#303134] text-[#e8eaed] text-xs font-semibold hover:bg-[#3c4043] transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-2 sm:py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              削除する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
