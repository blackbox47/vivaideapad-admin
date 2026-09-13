import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export interface DeleteConceptsConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
  selectedCount: number;
  /** Optional title of the first selected concept for single-delete copy. */
  primaryTitle?: string;
}

export default function DeleteConceptsConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  selectedCount,
  primaryTitle,
}: DeleteConceptsConfirmationModalProps) {
  const isSingle = selectedCount === 1;

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
      data-purpose="delete-concepts-confirmation-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-concepts-confirmation-title"
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
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="material-symbols-outlined text-[28px]">delete</span>
          </div>
          <h3
            id="delete-concepts-confirmation-title"
            className="text-lg font-bold text-slate-900 tracking-tight"
          >
            {isSingle ? 'Delete concept' : 'Delete concepts'}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
            {isSingle ? (
              <>
                You are about to permanently delete
                {primaryTitle ? (
                  <>
                    {' '}
                    <span className="font-semibold text-slate-700">
                      {primaryTitle}
                    </span>
                  </>
                ) : (
                  ' this concept'
                )}
                . This action cannot be undone.
              </>
            ) : (
              <>
                You are about to permanently delete{' '}
                <span className="font-semibold text-slate-700">
                  {selectedCount} concepts
                </span>
                . This action cannot be undone.
              </>
            )}
          </p>
        </div>

        <div className="p-6">
          <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 shrink-0">Selected</span>
              <span className="font-semibold text-slate-800 text-right">
                {isSingle
                  ? (primaryTitle ?? '1 concept')
                  : `${selectedCount} concepts`}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 shrink-0">Impact</span>
              <span className="font-semibold text-rose-600 text-right">
                Removed from Topics &amp; concepts
              </span>
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
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-3.5 animate-spin shrink-0" />
            ) : (
              <span className="material-symbols-outlined text-[16px]">delete</span>
            )}
            <span>{isSubmitting ? 'Deleting…' : 'Confirm delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
