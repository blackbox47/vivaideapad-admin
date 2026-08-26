interface AuditLogEmptyStateProps {
  description?: string;
}

export default function AuditLogEmptyState({
  description = 'Try a different keyword or category filter.',
}: AuditLogEmptyStateProps) {
  return (
    <div className="rounded-[22px] border border-border bg-card px-6 py-[60px] text-center text-muted-foreground">
      <span className="mb-2.5 block text-[28px]" aria-hidden>
        ◇
      </span>
      <strong className="mb-1 block text-foreground">No events match</strong>
      <span className="text-[13px]">{description}</span>
    </div>
  );
}