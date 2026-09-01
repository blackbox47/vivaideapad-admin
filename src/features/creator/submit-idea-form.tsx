import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useSubmitIdea from '@/hooks/creator/use-submit-idea';
import type { CreatorTopic } from '@/models/creator/submit-idea-model';
import {
  BODY_MAX,
  SUMMARY_MAX,
  TITLE_MAX,
} from '@/models/creator/submit-idea-model';
import {
  submitIdeaSchema,
  type SubmitIdeaFormValues,
} from '@/models/creator/submit-idea-schema';
import { CREATOR_ROUTES } from '@/utils/constants/routes';
import { getApiErrorMessage } from '@/utils/helpers/api-error';
import type { DropdownOption } from '@/utils/types/dropdown-option';

interface SubmitIdeaFormProps {
  topics: CreatorTopic[];
  isLoadingTopics: boolean;
  selectedTopicId?: string;
  onTopicChange?: (topicId: string) => void;
}

export default function SubmitIdeaForm({
  topics,
  isLoadingTopics,
  selectedTopicId = '',
  onTopicChange,
}: SubmitIdeaFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitIdea, { isLoading }] = useSubmitIdea();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SubmitIdeaFormValues>({
    resolver: zodResolver(submitIdeaSchema),
    defaultValues: {
      topicId: selectedTopicId,
      title: '',
      summary: '',
      body: '',
      attachmentUrl: '',
    },
  });

  const titleValue = useWatch({ control, name: 'title' }) ?? '';
  const summaryValue = useWatch({ control, name: 'summary' }) ?? '';
  const bodyValue = useWatch({ control, name: 'body' }) ?? '';

  const topicOptions = useMemo<DropdownOption[]>(
    () =>
      topics.map((topic) => ({
        id: topic.id,
        label: `${topic.title} · ${topic.reward}`,
      })),
    [topics],
  );

  useEffect(() => {
    if (selectedTopicId) {
      setValue('topicId', selectedTopicId);
    }
  }, [selectedTopicId, setValue]);

  const onFormSubmit = async (values: SubmitIdeaFormValues) => {
    setServerError(null);
    try {
      await submitIdea({
        topicId: values.topicId,
        title: values.title.trim(),
        summary: values.summary.trim(),
        body: values.body.trim(),
        attachmentUrl: values.attachmentUrl?.trim() || undefined,
      }).unwrap();
      navigate({ to: CREATOR_ROUTES.submissions, replace: true });
    } catch (err) {
      setServerError(getApiErrorMessage(err));
    }
  };

  const topicRegister = register('topicId');

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="grid gap-4">
      <Select
        id="topic"
        label="Topic"
        required
        disabled={isLoadingTopics}
        placeholder={isLoadingTopics ? 'Loading topics…' : 'Choose a topic'}
        options={topicOptions}
        errorMessage={errors.topicId?.message}
        {...topicRegister}
        onChange={(event) => {
          topicRegister.onChange(event);
          onTopicChange?.(event.target.value);
        }}
      />

      <div>
        <Input
          id="title"
          label="Title"
          required
          maxLength={TITLE_MAX}
          placeholder="Give it a working title"
          errorMessage={errors.title?.message}
          {...register('title')}
        />
        <p className="mt-1 text-right text-xs text-text-subtle">
          {titleValue.length}/{TITLE_MAX}
        </p>
      </div>

      <div>
        <Textarea
          id="summary"
          label="Summary"
          required
          maxLength={SUMMARY_MAX}
          rows={2}
          placeholder="One or two lines — what is the idea and who is it for?"
          errorMessage={errors.summary?.message}
          {...register('summary')}
        />
        <p className="mt-1 text-right text-xs text-text-subtle">
          {summaryValue.length}/{SUMMARY_MAX}
        </p>
      </div>

      <div>
        <Textarea
          id="body"
          label="Body"
          required
          maxLength={BODY_MAX}
          rows={8}
          placeholder="Describe the idea, the steps to pilot it, and how you'd measure success."
          errorMessage={errors.body?.message}
          {...register('body')}
        />
        <p className="mt-1 text-right text-xs text-text-subtle">
          {bodyValue.length}/{BODY_MAX}
        </p>
      </div>

      <div>
        <Input
          id="attachment"
          label={
            <>
              Attachment URL <span className="font-normal text-text-subtle">(optional)</span>
            </>
          }
          placeholder="https://"
          errorMessage={errors.attachmentUrl?.message}
          {...register('attachmentUrl')}
        />
      </div>

      {serverError ? (
        <p
          className="text-[12px] font-semibold text-destructive"
          role="alert"
        >
          {serverError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isLoading || isLoadingTopics}
        className="h-auto w-full rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground hover:bg-brand-forest disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {isLoading ? 'Submitting…' : 'Submit idea'}
      </Button>
    </form>
  );
}