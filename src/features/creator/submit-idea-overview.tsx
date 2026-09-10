import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
          <Button
            type="button"
            loading={isLoading}
            onClick={() => void refetch()}
            className="h-auto rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-brand-forest"
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const topics = data?.topics ?? [];

  return (
    <div className="mx-auto w-full max-w-[1200px] py-4 sm:py-8">
      {/* Section Header */}
      <section className="mb-10" data-purpose="header-section">
        <h1 className="mb-3 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
          {submissionId ? 'Edit your idea' : 'Submit a new idea'}
        </h1>
        <p className="text-base sm:text-lg font-normal text-muted-foreground">
          {submissionId
            ? 'Refine your idea and submit it for review.'
            : 'Pick a topic, draft the idea, and we\'ll route it to the right reviewer.'}
        </p>
      </section>

      <SubmitIdeaTopics
        topics={topics}
        isLoading={isLoading}
        onSelectTopic={handleSelectTopic}
        selectedTopicId={activeTopicId}
      />

      <section
        className="mb-16 rounded-3xl border border-border bg-card p-8 sm:p-12 lg:p-14 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
        data-purpose="submission-form"
      >
        <SubmitIdeaForm
          topics={topics}
          isLoadingTopics={isLoading}
          selectedTopicId={activeTopicId ?? ''}
          submissionId={submissionId || undefined}
          submission={submissionData}
          isLoadingSubmission={isLoadingSubmission}
        />
      </section>
    </div>
  );
}