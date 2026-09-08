import EmptyState from '@/components/shared/empty-state';

interface AuditLogEmptyStateProps {
  description?: string;
}

export default function AuditLogEmptyState({
  description = 'Try a different keyword or category filter.',
}: AuditLogEmptyStateProps) {
  return (
    <EmptyState
      title="No events match"
      description={description}
    />
  );
}