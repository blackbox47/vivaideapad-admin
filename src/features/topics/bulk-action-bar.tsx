import {
  Check,
  ChevronDown,
  Copy,
  Loader2,
  Trash2,
  UserMinus,
  UserPlus,
} from 'lucide-react';

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
      className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-7 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-foreground shadow-2xl transition-all duration-300 ease-out md:ml-32 md:gap-4 md:px-5"
    >
      <div className="flex items-center gap-2.5 border-r border-border pr-3 md:pr-4">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {selectedCount}
        </span>
        <span className="whitespace-nowrap text-xs font-semibold tracking-wide text-foreground">
          {selectedCount === 1 ? 'Card Selected' : 'Cards Selected'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onSetActive}
          disabled={isLoading}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-brand-forest disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Check className="size-3.5 stroke-[2.5]" />
          )}
          <span>Set Active</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isLoading}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground outline-none transition hover:bg-primary/10 hover:text-primary disabled:opacity-50"
          >
            <UserPlus className="size-3.5 text-primary" />
            <span>Onboarding</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="top"
            sideOffset={8}
            className="z-50 min-w-44 rounded-xl border border-border bg-card p-1 text-foreground shadow-xl"
          >
            <DropdownMenuItem
              onClick={() =>
                onSetOnboarding ? onSetOnboarding(true) : onToggleForNewUsers?.()
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <UserPlus className="size-3.5 text-primary" />
              <span>Set as Onboarding (NEW)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onSetOnboarding ? onSetOnboarding(false) : onToggleForNewUsers?.()
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-warning-subtle hover:text-warning"
            >
              <UserMinus className="size-3.5 text-warning" />
              <span>Remove Onboarding (Not NEW)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isLoading}
            className="flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground outline-none transition hover:bg-primary/10 hover:text-primary disabled:opacity-50"
          >
            <span>Change Status</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="top"
            sideOffset={8}
            className="z-50 min-w-32 rounded-xl border border-border bg-card p-1 text-foreground shadow-xl"
          >
            {STATUS_CHOICES.map((choice) => (
              <DropdownMenuItem
                key={choice.id}
                onClick={() => onChangeStatus(choice.id)}
                className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {choice.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={onDuplicate}
          disabled={isLoading}
          className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition hover:bg-primary/10 hover:text-primary disabled:opacity-50"
          title="Duplicate selected"
        >
          <Copy className="size-4" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isLoading}
          className="cursor-pointer rounded-lg p-1.5 text-destructive transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          title="Delete selected"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="border-l border-border pl-2">
        <button
          type="button"
          onClick={onDeselectAll}
          disabled={isLoading}
          className="cursor-pointer rounded px-2 py-1 text-[11px] text-muted-foreground transition hover:text-foreground disabled:opacity-50"
        >
          Deselect
        </button>
      </div>
    </div>
  );
}
