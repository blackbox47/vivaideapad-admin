import EmptyState from '@/components/shared/empty-state';
import PageHeader from '@/components/layout/page-header';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader
        title={title}
        description={description}
      />
      <EmptyState
        title="Coming soon"
        description="This section is scaffolded for routing. Wire real data when the API is ready."
      />
    </div>
  );
}
