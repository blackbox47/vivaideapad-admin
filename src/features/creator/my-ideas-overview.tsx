import { AlertCircle } from 'lucide-react';

import PageHeader from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import MyIdeasTable from '@/features/creator/my-ideas-table';
import useMyIdeas from '@/hooks/creator/use-my-ideas';

export default function MyIdeasOverview() {
  const { data, isLoading, isError, error, refetch } = useMyIdeas({
    status: 'all',
    search: '',
  });

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load your submissions
          </CardTitle>
          <CardDescription>
            {error ? String(error) : 'Unexpected error'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="pb-4">
      <PageHeader
        eyebrow="Your work"
        title="My submissions"
        description="Track every idea from first draft to final decision."
      />

      <MyIdeasTable items={data?.ideas ?? []} isLoading={isLoading} />
    </div>
  );
}
