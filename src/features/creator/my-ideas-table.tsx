import StatusBadge from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import type { MyIdea } from '@/models/creator/my-ideas-model';

interface MyIdeasTableProps {
  items: MyIdea[];
  isLoading: boolean;
  onView: (idea: MyIdea) => void;
}

const columns = [
  { label: 'Title' },
  { label: 'Concept' },
  { label: 'Date' },
  { label: 'Status' },
  { label: 'Reward' },
  { isAction: true },
];

export default function MyIdeasTable({
  items,
  isLoading,
  onView,
}: MyIdeasTableProps) {
  return (
    <ProjectTable columns={columns} isLoading={isLoading} loadingRows={4}>
      {items.map((idea) => (
        <ProjectTableRow key={idea.id}>
          <ProjectTableCell>
            <strong className="font-semibold text-foreground">{idea.title}</strong>
          </ProjectTableCell>
          <ProjectTableCell className="text-muted-foreground">
            {idea.conceptTitle ?? idea.topic ?? '—'}
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap text-muted-foreground">
            {idea.submitted}
          </ProjectTableCell>
          <ProjectTableCell>
            <StatusBadge status={idea.status} />
          </ProjectTableCell>
          <ProjectTableCell>
            <strong className="font-semibold text-foreground">{idea.reward}</strong>
          </ProjectTableCell>
          <ProjectTableCell>
            <Button
              type="button"
              variant="outline"
              onClick={() => onView(idea)}
              className="h-auto rounded-full border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground hover:bg-surface-subtle"
            >
              View
            </Button>
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </ProjectTable>
  );
}
