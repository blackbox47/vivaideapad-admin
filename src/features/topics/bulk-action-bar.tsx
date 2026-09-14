import {
  ChevronDown,
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
  onToggleForNewUsers?: () => void;
  onSetOnboarding?: (flag: boolean) => void;
  onChangeStatus: (status: ConceptStatus) => void;
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
  onToggleForNewUsers,
  onSetOnboarding,
  onChangeStatus,
  onDelete,
  onDeselectAll,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      data-purpose="bulk-action-bar"
      className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-7 left-1/2 z-40 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 flex-nowrap items-center gap-2 overflow-x-auto rounded-2xl border border-border bg-card px-3 py-2.5 text-foreground shadow-2xl transition-all duration-300 ease-out md:ml-32 md:gap-3 md:px-4"
    >
      <div className="flex shrink-0 items-center gap-2 border-r border-border pr-2.5 md:pr-3">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {selectedCount}
        </span>
        <span className="whitespace-nowrap text-xs font-semibold tracking-wide text-foreground">
          {selectedCount === 1 ? 'Card Selected' : 'Cards Selected'}
        </span>
      </div>

      <div className="flex shrink-0 flex-nowrap items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isLoading}
            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-foreground outline-none transition hover:bg-primary/10 hover:text-primary disabled:opacity-50"
          >
            <UserPlus className="size-3.5 shrink-0 text-primary" />
            <span>Onboarding</span>
            <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
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
              <span>Set as Onboarding (New)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onSetOnboarding ? onSetOnboarding(false) : onToggleForNewUsers?.()
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-warning-subtle hover:text-warning"
            >
              <UserMinus className="size-3.5 text-warning" />
              <span>Remove Onboarding (Not New)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isLoading}
            className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs font-medium text-foreground outline-none transition hover:bg-primary/10 hover:text-primary disabled:opacity-50"
          >
            <span>Change Status</span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
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
          onClick={onDelete}
          disabled={isLoading}
          className="cursor-pointer rounded-lg p-1.5 text-destructive transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          title="Delete selected"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="shrink-0 border-l border-border pl-2">
        <button
          type="button"
          onClick={onDeselectAll}
          disabled={isLoading}
          className="cursor-pointer whitespace-nowrap rounded px-2 py-1 text-[11px] text-muted-foreground transition hover:text-foreground disabled:opacity-50"
        >
          Deselect
        </button>
      </div>
    </div>
  );
}
