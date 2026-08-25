import { Link } from 'react-router-dom';

import StatusBadge from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  ProjectTable,
  ProjectTableCell,
  ProjectTableRow,
} from '@/components/ui/project-table';
import type { MyIdea } from '@/models/creator/my-ideas-model';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

interface MyIdeasTableProps {
  items: MyIdea[];
  isLoading: boolean;
}

const columns = [
  { label: 'Title' },
  { label: 'Concept' },
  { label: 'Date' },
  { label: 'Status' },
  { label: 'Reward' },
  { isAction: true },
];

export default function MyIdeasTable({ items, isLoading }: MyIdeasTableProps) {
  return (
    <ProjectTable columns={columns} isLoading={isLoading} loadingRows={4}>
      {items.map((idea) => (
        <ProjectTableRow key={idea.id}>
          <ProjectTableCell>
            <strong className="font-semibold text-foreground">{idea.title}</strong>
          </ProjectTableCell>
          <ProjectTableCell className="text-[#687773]">
            {idea.topic}
          </ProjectTableCell>
          <ProjectTableCell className="whitespace-nowrap text-[#687773]">
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
              render={<Link to={CREATOR_ROUTES.submitIdea} />}
              variant="outline"
              className="h-auto rounded-full border-[#dfe7e3] bg-white px-3.5 py-1.5 text-xs font-bold"
            >
              View
            </Button>
          </ProjectTableCell>
        </ProjectTableRow>
      ))}
    </ProjectTable>
  );
}
