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
  submissionId?: string;
  submission?: SubmissionDetail | null;
  isLoadingSubmission?: boolean;
}

export default function SubmitIdeaForm({
  topics,
  isLoadingTopics,
  selectedTopicId = '',
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
        label: `${topic.title} (${topic.reward})`,
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
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-8">
      {/* Field: Topic (disabled - selection handled by topic cards above) */}
      <div className="space-y-2.5">
        <Label
          htmlFor="topic"
          className="block text-base sm:text-lg font-bold text-foreground"
        >
          Topic <span className="text-emerald-600 font-semibold">*</span>
        </Label>
        <Select
          id="topic"
          disabled
          value={selectedTopicId || ''}
          placeholder={
            isLoadingTopics
              ? 'Loading topics…'
              : 'Choose a topic from the cards above'
          }
          options={topicOptions}
          className="h-auto rounded-xl border border-border bg-muted/60 px-4 py-3.5 pr-10 text-base text-foreground placeholder:text-muted-foreground disabled:opacity-80 disabled:cursor-not-allowed cursor-not-allowed transition-colors"
          errorMessage={errors.topicId?.message}
        />
        <input type="hidden" {...register('topicId')} />
        <p className="text-xs text-muted-foreground">
          Topic is selected by clicking an active topic card above.
        </p>
      </div>

      {/* Field: Title */}
      <div className="space-y-2.5">
        <Label
          htmlFor="title"
          className="block text-base sm:text-lg font-bold text-foreground"
        >
          Title <span className="text-emerald-600 font-semibold">*</span>
        </Label>
        <div>
          <Input
            id="title"
            required
            disabled={isBusy}
            maxLength={TITLE_MAX}
            placeholder="Give it a working title"
            className="h-auto rounded-xl border border-border bg-card px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-brand-forest focus-visible:ring-2 focus-visible:ring-brand-forest/15 transition-colors"
            errorMessage={errors.title?.message}
            {...register('title')}
          />
          <div className="mt-1.5 flex justify-end">
            <span className="text-xs font-semibold text-muted-foreground">
              {titleValue.length}/{TITLE_MAX}
            </span>
          </div>
        </div>
      </div>

      {/* Field: Summary */}
      <div className="space-y-2.5">
        <Label
          htmlFor="summary"
          className="block text-base sm:text-lg font-bold text-foreground"
        >
          Summary
        </Label>
        <div>
          <Textarea
            id="summary"
            disabled={isBusy}
            maxLength={SUMMARY_MAX}
            rows={3}
            placeholder="One or two lines — what is the idea and who is it for?"
            className="rounded-xl border border-border bg-card px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-brand-forest focus-visible:ring-2 focus-visible:ring-brand-forest/15 transition-colors resize-y"
            errorMessage={errors.summary?.message}
            {...register('summary')}
          />
          <div className="mt-1.5 flex justify-end">
            <span className="text-xs font-semibold text-muted-foreground">
              {summaryValue.length}/{SUMMARY_MAX}
            </span>
          </div>
        </div>
      </div>

      {/* Field: Body */}
      <div className="space-y-2.5">
        <Label
          htmlFor="body"
          className="block text-base sm:text-lg font-bold text-foreground"
        >
          Body <span className="text-emerald-600 font-semibold">*</span>
        </Label>
        <div>
          <Textarea
            id="body"
            required
            disabled={isBusy}
            maxLength={BODY_MAX}
            rows={6}
            placeholder="Describe the idea, the steps to pilot it, and how you'd measure success."
            className="rounded-xl border border-border bg-card px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-brand-forest focus-visible:ring-2 focus-visible:ring-brand-forest/15 transition-colors resize-y"
            errorMessage={errors.body?.message}
            {...register('body')}
          />
          <div className="mt-1.5 flex justify-end">
            <span className="text-xs font-semibold text-muted-foreground">
              {bodyValue.length}/{BODY_MAX}
            </span>
          </div>
        </div>
      </div>

      {/* Field: Supporting evidence */}
      <div className="space-y-2.5">
        <Label className="block text-base sm:text-lg font-bold text-foreground">
          Supporting evidence
        </Label>
        <FileUploader
          id="attachment"
          acceptText="PDF, DOCX, JPG or PNG · up to 10 MB"
          value={selectedFile}
          onChange={handleFileChange}
          disabled={isBusy}
          errorMessage={errors.attachmentUrl?.message}
        />
      </div>

      {/* Field: Confirmation Checkbox */}
      <div className="pt-2">
        <label
          htmlFor="confirmedOriginal"
          className="flex items-start sm:items-center gap-3 cursor-pointer select-none group"
        >
          <input
            id="confirmedOriginal"
            type="checkbox"
            disabled={isBusy}
            className="mt-1 sm:mt-0 size-5 rounded border-border accent-primary cursor-pointer disabled:opacity-60"
            {...register('confirmedOriginal')}
          />
          <span className="text-base sm:text-lg font-semibold text-foreground">
            I confirm this submission is original and follows the content guidelines
          </span>
        </label>
        {errors.confirmedOriginal?.message ? (
          <p
            className="mt-1.5 text-xs font-semibold text-destructive"
            role="alert"
          >
            {errors.confirmedOriginal.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p
          className="text-sm font-semibold text-destructive"
          role="alert"
        >
          {serverError}
        </p>
      ) : null}

      {/* Submit button area */}
      <div className="pt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isBusy}
          loading={isSubmittingNew || isUpdating || isSubmittingExisting}
          className="w-full max-w-[400px] py-4 px-8 h-auto rounded-full bg-[#112520] hover:bg-[#193b33] active:bg-[#0a1613] text-white dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 font-bold text-base tracking-wide shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center text-center cursor-pointer disabled:opacity-60"
        >
          {isSubmittingNew || isUpdating || isSubmittingExisting
            ? submissionId
              ? 'Updating & submitting…'
              : 'Submitting…'
            : submissionId
              ? 'Update & submit idea'
              : 'Submit idea'}
        </Button>
      </div>
    </form>
  );
}