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
        eyebrow="Administration"
        title={title}
        description={description}
      />
      <div className="rounded-[22px] border border-border bg-card px-6 py-[60px] text-center text-muted-foreground">
        <span className="mb-2.5 block text-[28px]">◇</span>
        <strong className="mb-1 block text-foreground">Coming soon</strong>
        <span className="text-[13px]">
          This section is scaffolded for routing. Wire real data when the API is
          ready.
        </span>
      </div>
    </div>
  );
}
