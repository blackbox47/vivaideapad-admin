import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/ui/file-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useSubmitIdea from '@/hooks/creator/use-submit-idea';
import {
  useSubmitExistingSubmissionMutation,
  useUpdateSubmissionMutation,
} from '@/services/creator/creator-ideas-service';
import type {
  CreatorTopic,
  SubmissionDetail,
} from '@/models/creator/submit-idea-model';
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () =>
      reject(new Error(reader.error?.message ?? 'Failed to read file'));
    reader.readAsDataURL(file);
  });
}

interface SubmitIdeaFormProps {
  topics: CreatorTopic[];
  isLoadingTopics: boolean;
  selectedTopicId?: string;
  onTopicChange?: (topicId: string) => void;
  submissionId?: string;
  submission?: SubmissionDetail | null;
  isLoadingSubmission?: boolean;
}

export default function SubmitIdeaForm({
  topics,
  isLoadingTopics,
  selectedTopicId = '',
  onTopicChange,
  submissionId,
  submission,
  isLoadingSubmission = false,
}: SubmitIdeaFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitIdea, { isLoading: isSubmittingNew }] = useSubmitIdea();
  const [updateSubmission, { isLoading: isUpdating }] =
    useUpdateSubmissionMutation();
  const [submitExisting, { isLoading: isSubmittingExisting }] =
    useSubmitExistingSubmissionMutation();
  const navigate = useNavigate();

  const isBusy =
    isSubmittingNew ||
    isUpdating ||
    isSubmittingExisting ||
    isLoadingTopics ||
    isLoadingSubmission;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SubmitIdeaFormValues>({
    resolver: zodResolver(submitIdeaSchema),
    defaultValues: {
      topicId: selectedTopicId,
      title: '',
      summary: '',
      body: '',
      attachmentUrl: '',
      confirmedOriginal: false,
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

  // Populate form with existing submission data
  useEffect(() => {
    if (submission) {
      reset({
        topicId: submission.conceptId || selectedTopicId || '',
        title: submission.title || '',
        summary: submission.summary || '',
        body: submission.body || '',
        attachmentUrl: submission.attachmentUrl || '',
        confirmedOriginal: true,
      });
    }
  }, [submission, reset, selectedTopicId]);

  useEffect(() => {
    if (selectedTopicId) {
      setValue('topicId', selectedTopicId);
    }
  }, [selectedTopicId, setValue]);

  const handleFileChange = async (file: File | null) => {
    setSelectedFile(file);
    if (!file) {
      setValue('attachmentUrl', submission?.attachmentUrl ?? '');
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setValue('attachmentUrl', dataUrl);
    } catch {
      setValue('attachmentUrl', file.name);
    }
  };

  const onFormSubmit = async (values: SubmitIdeaFormValues) => {
    setServerError(null);
    try {
      if (submissionId) {
        await updateSubmission({
          id: submissionId,
          body: {
            concept_id: values.topicId,
            topicId: values.topicId,
            title: values.title.trim(),
            summary: values.summary?.trim(),
            body: values.body.trim(),
            attachmentUrl: values.attachmentUrl?.trim() || undefined,
            file: selectedFile ?? undefined,
          },
        }).unwrap();
        await submitExisting(submissionId).unwrap();
      } else {
        await submitIdea({
          topicId: values.topicId,
          concept_id: values.topicId,
          title: values.title.trim(),
          summary: values.summary?.trim(),
          body: values.body.trim(),
          attachmentUrl: values.attachmentUrl?.trim() || undefined,
          file: selectedFile ?? undefined,
        }).unwrap();
      }
      navigate({ to: CREATOR_ROUTES.submissions, replace: true });
    } catch (err) {
      setServerError(getApiErrorMessage(err));
    }
  };

  const topicRegister = register('topicId');

  if (isLoadingSubmission) {
    return (
      <div className="space-y-4 py-4" aria-busy="true">
        <div className="h-10 animate-pulse rounded-md bg-surface-subtle" />
        <div className="h-12 animate-pulse rounded-md bg-surface-subtle" />
        <div className="h-20 animate-pulse rounded-md bg-surface-subtle" />
        <div className="h-40 animate-pulse rounded-md bg-surface-subtle" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="grid gap-4">
      <Select
        id="topic"
        label="Topic"
        required
        disabled={isLoadingTopics || isBusy}
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
          disabled={isBusy}
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
          disabled={isBusy}
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
          disabled={isBusy}
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

      <FileUploader
        id="attachment"
        label="Supporting evidence"
        acceptText="PDF, DOCX, JPG or PNG · up to 10 MB"
        value={selectedFile}
        onChange={handleFileChange}
        disabled={isBusy}
        errorMessage={errors.attachmentUrl?.message}
      />

      <div className="flex items-center gap-2.5 pt-0.5">
        <Input
          id="confirmedOriginal"
          type="checkbox"
          disabled={isBusy}
          className="size-4 cursor-pointer rounded accent-primary disabled:opacity-60"
          {...register('confirmedOriginal')}
        />
        <Label
          htmlFor="confirmedOriginal"
          className="cursor-pointer text-[13px] font-normal text-foreground select-none"
        >
          I confirm this submission is original and follows the content guidelines
        </Label>
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
        disabled={isBusy}
        loading={isSubmittingNew || isUpdating || isSubmittingExisting}
        className="h-auto w-full rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground hover:bg-brand-forest disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {isSubmittingNew || isUpdating || isSubmittingExisting
          ? submissionId
            ? 'Updating & submitting…'
            : 'Submitting…'
          : submissionId
            ? 'Update & submit idea'
            : 'Submit idea'}
      </Button>
    </form>
  );
}