import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import PageHeader from '@/components/layout/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SubmitIdeaForm from '@/features/creator/submit-idea-form';
import SubmitIdeaTopics from '@/features/creator/submit-idea-topics';
import useCreatorTopics from '@/hooks/creator/use-creator-topics';

export default function SubmitIdeaOverview() {
  const { data, isLoading, isError, error, refetch } = useCreatorTopics();
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(
    undefined,
  );

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId((prev) => (prev === topicId ? undefined : topicId));
  };

  if (isError) {
    return (
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-destructive" />
            Could not load topics
          </CardTitle>
          <CardDescription>
            {error ? String(error) : 'Unexpected error'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-full bg-[#12231f] px-5 py-2 text-sm font-bold text-white hover:bg-[#254b40]"
          >
            Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  const topics = data?.topics ?? [];

  return (
    <div className="pb-4">
      <PageHeader
        eyebrow="Contributor space"
        title="Submit a new idea"
        description="Pick a topic, draft the idea, and we'll route it to the right reviewer."
      />

      <SubmitIdeaTopics
        topics={topics}
        isLoading={isLoading}
        onSelectTopic={handleSelectTopic}
        selectedTopicId={selectedTopicId}
      />

      <section className="rounded-[20px] border border-[#e3e9e6] bg-white p-6">
        <SubmitIdeaForm
          topics={topics}
          isLoadingTopics={isLoading}
          initialTopicId={selectedTopicId ?? ''}
        />
      </section>
    </div>
  );
}