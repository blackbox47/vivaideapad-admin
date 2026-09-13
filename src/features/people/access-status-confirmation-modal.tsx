import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import type { PlatformUserStatus } from '@/models/people/people-model';

export interface AccessStatusConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  userName: string;
  userInitials: string;
  userEmail?: string;
  /** Status the user will move to after confirmation. */
  nextStatus: Extract<PlatformUserStatus, 'Active' | 'Suspended'>;
}

export default function AccessStatusConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  userName,
  userInitials,
  userEmail,
  nextStatus,
}: AccessStatusConfirmationModalProps) {
  const isReactivate = nextStatus === 'Active';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all"
      data-purpose="access-status-confirmation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-status-confirmation-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <button
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-6 text-center border-b border-slate-100">
          <div
            className={`w-12 h-12 rounded-full border flex items-center justify-center mx-auto mb-3 shadow-sm ${
              isReactivate
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60'
                : 'bg-rose-50 text-rose-600 border-rose-200/60'
            }`}
          >
            <span className="material-symbols-outlined text-[28px]">
              {isReactivate ? 'restart_alt' : 'block'}
            </span>
          </div>
          <h3
            id="access-status-confirmation-title"
            className="text-lg font-bold text-slate-900 tracking-tight"
          >
            {isReactivate ? 'Reactivate contributor access' : 'Suspend contributor access'}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            {isReactivate ? (
              <>
                You are about to restore portal access for{' '}
                <span className="font-semibold text-slate-700">{userName}</span>.
                They will be able to sign in and submit content again.
              </>
            ) : (
              <>
                You are about to suspend{' '}
                <span className="font-semibold text-slate-700">{userName}</span>.
                They will lose contributor portal access until reactivated.
              </>
            )}
          </p>
        </div>

        <div className="p-6">
          <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {userName}
                  </p>
                  {userEmail ? (
                    <p className="text-[11px] text-slate-400 truncate">
                      {userEmail}
                    </p>
                  ) : null}
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border shrink-0 ${
                  isReactivate
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-rose-50 text-rose-600 border-rose-200'
                }`}
              >
                Status change: {nextStatus}
              </span>
            </div>

            <div className="border-t border-slate-200/60 pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500 shrink-0">Impact</span>
                <span
                  className={`font-semibold text-right ${
                    isReactivate ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isReactivate
                    ? 'Portal access restored'
                    : 'Portal access revoked'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/60 flex items-center justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className={`px-5 py-2 rounded-xl text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              isReactivate
                ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
            }`}
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-3.5 animate-spin shrink-0" />
            ) : (
              <span className="material-symbols-outlined text-[16px]">
                {isReactivate ? 'restart_alt' : 'block'}
              </span>
            )}
            <span>
              {isSubmitting
                ? isReactivate
                  ? 'Reactivating…'
                  : 'Suspending…'
                : isReactivate
                  ? 'Confirm reactivate'
                  : 'Confirm suspend'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
