import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/ui/file-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
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
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [submitIdea, { isLoading: isSubmittingNew }] = useSubmitIdea();
  const [updateSubmission, { isLoading: isUpdating }] =
    useUpdateSubmissionMutation();
  const [submitExisting, { isLoading: isSubmittingExisting }] =
    useSubmitExistingSubmissionMutation();
  const navigate = useNavigate();

  const isBusy =
    isSavingDraft ||
    isSubmittingFinal ||
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
    getValues,
    setError,
    clearErrors,
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

  // Plain-text length of the body's HTML for the counter (matches zod).
  const bodyPlainTextLength = useMemo(() => {
    if (typeof document === 'undefined') return 0;
    const tmp = document.createElement('div');
    tmp.innerHTML = bodyValue;
    return (tmp.textContent ?? '').length;
  }, [bodyValue]);

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

  const handleSaveDraft = async () => {
    setServerError(null);
    clearErrors();
    const values = getValues();

    if (!values.topicId) {
      setError('topicId', { message: 'Pick a topic before saving a draft.' });
      return;
    }

    if (!values.title?.trim()) {
      setError('title', { message: 'Title is required to save a draft.' });
      return;
    }

    const plainBody = values.body?.replace(/<[^>]*>/g, '').trim() ?? '';
    if (!plainBody) {
      setError('body', {
        message: 'Write a brief description to save your draft.',
      });
      return;
    }

    setIsSavingDraft(true);
    try {
      if (submissionId) {
        await updateSubmission({
          id: submissionId,
          body: {
            concept_id: values.topicId,
            topicId: values.topicId,
            title: values.title.trim(),
            summary: values.summary?.trim(),
            body: values.body || '',
            attachmentUrl: values.attachmentUrl?.trim() || undefined,
            file: selectedFile ?? undefined,
          },
        }).unwrap();
      } else {
        await submitIdea({
          topicId: values.topicId,
          concept_id: values.topicId,
          title: values.title.trim(),
          summary: values.summary?.trim(),
          body: values.body || '',
          attachmentUrl: values.attachmentUrl?.trim() || undefined,
          file: selectedFile ?? undefined,
        }).unwrap();
      }

      toast.success('Draft saved successfully');
      navigate({ to: CREATOR_ROUTES.submissions, replace: true });
    } catch (err) {
      toast.error('Failed to save draft');
      setServerError(getApiErrorMessage(err));
    } finally {
      setIsSavingDraft(false);
    }
  };

  const onFormSubmit = async (values: SubmitIdeaFormValues) => {
    setServerError(null);
    setIsSubmittingFinal(true);
    try {
      if (submissionId) {
        await updateSubmission({
          id: submissionId,
          body: {
            concept_id: values.topicId,
            topicId: values.topicId,
            title: values.title.trim(),
            summary: values.summary?.trim(),
            body: values.body,
            attachmentUrl: values.attachmentUrl?.trim() || undefined,
            file: selectedFile ?? undefined,
          },
        }).unwrap();
        await submitExisting(submissionId).unwrap();
      } else {
        const res = await submitIdea({
          topicId: values.topicId,
          concept_id: values.topicId,
          title: values.title.trim(),
          summary: values.summary?.trim(),
          body: values.body,
          attachmentUrl: values.attachmentUrl?.trim() || undefined,
          file: selectedFile ?? undefined,
        }).unwrap();
        const newId = res?.idea?.id;
        if (newId) {
          await submitExisting(newId).unwrap();
        }
      }
      toast.success(
        submissionId
          ? 'Idea updated and submitted for review'
          : 'Idea submitted for review',
      );
      navigate({ to: CREATOR_ROUTES.submissions, replace: true });
    } catch (err) {
      toast.error('Failed to submit idea');
      setServerError(getApiErrorMessage(err));
    } finally {
      setIsSubmittingFinal(false);
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
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-4">
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
            placeholder="Enter title"
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
            placeholder="Enter summary"
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
        <Controller
          control={control}
          name="body"
          render={({ field }) => (
            <RichTextEditor
              id="body"
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Describe the idea, the steps to pilot it, and how you'd measure success."
              disabled={isBusy}
              aria-invalid={errors.body ? 'true' : 'false'}
              errorMessage={errors.body?.message}
              maxLength={BODY_MAX}
            />
          )}
        />
        <div className="flex justify-end">
          <span
            className={cn(
              'text-xs font-semibold',
              bodyPlainTextLength >= BODY_MAX
                ? 'text-amber-600 dark:text-amber-500'
                : 'text-muted-foreground',
            )}
          >
            {bodyPlainTextLength}/{BODY_MAX}
          </span>
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

      {/* Action buttons */}
      <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 sm:gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          loading={isSavingDraft}
          onClick={handleSaveDraft}
          className="w-full sm:w-auto min-w-[160px] py-3.5 px-6 h-auto rounded-full border border-border bg-card hover:bg-muted/80 text-foreground font-bold text-base tracking-wide transition-all duration-150 flex items-center justify-center text-center cursor-pointer disabled:opacity-60"
        >
          Save as draft
        </Button>
        <Button
          type="submit"
          disabled={isBusy}
          loading={isSubmittingFinal}
          className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 h-auto rounded-full bg-[#112520] hover:bg-[#193b33] active:bg-[#0a1613] text-white dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 font-bold text-base tracking-wide shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center text-center cursor-pointer disabled:opacity-60"
        >
          {isSubmittingFinal
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