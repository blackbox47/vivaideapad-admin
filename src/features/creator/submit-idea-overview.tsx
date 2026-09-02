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
import { useTanstackSearchParams } from '@/lib/use-tanstack-search-params';
import { useGetSubmissionByIdQuery } from '@/services/creator/creator-ideas-service';

export default function SubmitIdeaOverview() {
  const [searchParams] = useTanstackSearchParams();
  const submissionId = searchParams.get('id') ?? '';

  const { data, isLoading, isError, error, refetch } = useCreatorTopics();
  const { data: submissionData, isLoading: isLoadingSubmission } =
    useGetSubmissionByIdQuery(submissionId, {
      skip: !submissionId,
    });

  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(
    undefined,
  );  

  const activeTopicId = selectedTopicId ?? submissionData?.conceptId;

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
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
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-brand-forest cursor-pointer"
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
        eyebrow={submissionId ? 'Edit submission' : 'Contributor space'}
        title={submissionId ? 'Edit your idea' : 'Submit a new idea'}
        description={
          submissionId
            ? 'Refine your idea and submit it for review.'
            : 'Pick a topic, draft the idea, and we\'ll route it to the right reviewer.'
        }
      />

      <SubmitIdeaTopics
        topics={topics}
        isLoading={isLoading}
        onSelectTopic={handleSelectTopic}
        selectedTopicId={activeTopicId}
      />

      <section className="rounded-[20px] border border-border bg-card p-6">
        <SubmitIdeaForm
          topics={topics}
          isLoadingTopics={isLoading}
          selectedTopicId={activeTopicId ?? ''}
          onTopicChange={setSelectedTopicId}
          submissionId={submissionId || undefined}
          submission={submissionData}
          isLoadingSubmission={isLoadingSubmission}
        />
      </section>
    </div>
  );
}