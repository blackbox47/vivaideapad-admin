import { Check, ChevronDown, Copy, Loader2, Trash2, UserMinus, UserPlus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ConceptStatus } from '@/models/topics/topics-model';

interface BulkActionBarProps {
  selectedCount: number;
  isLoading?: boolean;
  onSetActive: () => void;
  onToggleForNewUsers?: () => void;
  onSetOnboarding?: (flag: boolean) => void;
  onChangeStatus: (status: ConceptStatus) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDeselectAll: () => void;
}

const STATUS_CHOICES: Array<{ id: ConceptStatus; label: string }> = [
  { id: 'active', label: 'Active' },
  { id: 'draft', label: 'Draft' },
  { id: 'archived', label: 'Archived' },
];

export default function BulkActionBar({
  selectedCount,
  isLoading = false,
  onSetActive,
  onToggleForNewUsers,
  onSetOnboarding,
  onChangeStatus,
  onDuplicate,
  onDelete,
  onDeselectAll,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      data-purpose="bulk-action-bar"
      className="fixed bottom-7 left-1/2 -translate-x-1/2 md:ml-32 z-40 flex items-center gap-3 md:gap-4 rounded-2xl border border-[#1e4638] bg-[#0d221b] px-4 md:px-5 py-3 text-white shadow-2xl transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-4"
    >
      {/* Selection Counter badge */}
      <div className="flex items-center gap-2.5 border-r border-[#1b4336] pr-3 md:pr-4">
        <span className="flex size-6 items-center justify-center rounded-full bg-[#3cd070] text-xs font-bold text-[#0d221b]">
          {selectedCount}
        </span>
        <span className="text-xs font-semibold tracking-wide text-gray-100 whitespace-nowrap">
          {selectedCount === 1 ? 'Card Selected' : 'Cards Selected'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Set Active Button */}
        <button
          type="button"
          onClick={onSetActive}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg bg-[#3cd070] px-3 py-1.5 text-xs font-semibold text-[#091b15] transition shadow-xs hover:bg-[#34b863] disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Check className="size-3.5 stroke-[2.5]" />
          )}
          <span>Set Active</span>
        </button>

        {/* Onboarding Options Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-[#255243] bg-[#17382d] px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-[#1f493b] disabled:opacity-50 cursor-pointer outline-none"
          >
            <UserPlus className="size-3.5 text-[#3cd070]" />
            <span>Onboarding</span>
            <ChevronDown className="size-3 text-emerald-300/70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="top"
            sideOffset={8}
            className="bg-[#0d221b] border border-[#1e4638] text-white p-1 min-w-44 z-50 rounded-xl shadow-xl"
          >
            <DropdownMenuItem
              onClick={() => (onSetOnboarding ? onSetOnboarding(true) : onToggleForNewUsers?.())}
              className="cursor-pointer text-xs font-medium px-3 py-1.5 text-gray-200 hover:bg-[#17382d] hover:text-[#3cd070] rounded-lg transition-colors flex items-center gap-2"
            >
              <UserPlus className="size-3.5 text-[#3cd070]" />
              <span>Set as Onboarding (NEW)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => (onSetOnboarding ? onSetOnboarding(false) : onToggleForNewUsers?.())}
              className="cursor-pointer text-xs font-medium px-3 py-1.5 text-gray-200 hover:bg-[#17382d] hover:text-amber-400 rounded-lg transition-colors flex items-center gap-2"
            >
              <UserMinus className="size-3.5 text-amber-400" />
              <span>Remove Onboarding (Not NEW)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Change Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isLoading}
            className="flex items-center gap-1 rounded-lg border border-[#255243] bg-[#17382d] px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:bg-[#1f493b] disabled:opacity-50 cursor-pointer outline-none"
          >
            <span>Change Status</span>
            <ChevronDown className="size-3.5 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="top"
            sideOffset={8}
            className="bg-[#0d221b] border border-[#1e4638] text-white p-1 min-w-32 z-50 rounded-xl shadow-xl"
          >
            {STATUS_CHOICES.map((choice) => (
              <DropdownMenuItem
                key={choice.id}
                onClick={() => onChangeStatus(choice.id)}
                className="cursor-pointer text-xs font-medium px-3 py-1.5 text-gray-200 hover:bg-[#17382d] hover:text-[#3cd070] rounded-lg transition-colors"
              >
                {choice.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Duplicate */}
        <button
          type="button"
          onClick={onDuplicate}
          disabled={isLoading}
          className="rounded-lg p-1.5 text-gray-300 transition hover:bg-[#17382d] hover:text-white disabled:opacity-50 cursor-pointer"
          title="Duplicate selected"
        >
          <Copy className="size-4" />
        </button>

        {/* Archive / Delete */}
        <button
          type="button"
          onClick={onDelete}
          disabled={isLoading}
          className="rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-950/40 hover:text-rose-300 disabled:opacity-50 cursor-pointer"
          title="Delete selected"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {/* Deselect All (Dismiss) */}
      <div className="border-l border-[#1b4336] pl-2">
        <button
          type="button"
          onClick={onDeselectAll}
          disabled={isLoading}
          className="rounded px-2 py-1 text-[11px] text-gray-400 transition hover:text-white cursor-pointer disabled:opacity-50"
        >
          Deselect
        </button>
      </div>
    </div>
  );
}
