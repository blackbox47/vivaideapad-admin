import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useSubmitIdea from '@/hooks/creator/use-submit-idea';
import type { CreatorTopic } from '@/models/creator/submit-idea-model';
import {
  BODY_MAX,
  SUMMARY_MAX,
  TITLE_MAX,
} from '@/models/creator/submit-idea-model';
import { CREATOR_ROUTES } from '@/utils/constants/routes';
import { getApiErrorMessage } from '@/utils/helpers/api-error';

interface SubmitIdeaFormProps {
  topics: CreatorTopic[];
  isLoadingTopics: boolean;
  initialTopicId?: string;
}

interface FormValues {
  topicId: string;
  title: string;
  summary: string;
  body: string;
  attachmentUrl: string;
}

const EMPTY: FormValues = {
  topicId: '',
  title: '',
  summary: '',
  body: '',
  attachmentUrl: '',
};

const URL_PATTERN = /^https?:\/\/\S+$/i;

const fieldClassName =
  'h-auto w-full rounded-[12px] border-[#dfe7e3] bg-white px-[14px] py-[13px] text-sm shadow-none focus-visible:border-[#70a28d] focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_#e2f1ea]';

function validate(values: FormValues): string | null {
  if (!values.topicId) {
    return 'Pick a topic before submitting.';
  }
  if (!values.title.trim()) {
    return 'Title is required.';
  }
  if (values.title.length > TITLE_MAX) {
    return `Title must be at most ${TITLE_MAX} characters.`;
  }
  if (!values.summary.trim()) {
    return 'Summary is required.';
  }
  if (values.summary.length > SUMMARY_MAX) {
    return `Summary must be at most ${SUMMARY_MAX} characters.`;
  }
  if (!values.body.trim()) {
    return 'Body is required.';
  }
  if (values.body.length > BODY_MAX) {
    return `Body must be at most ${BODY_MAX} characters.`;
  }
  if (
    values.attachmentUrl.trim().length > 0 &&
    !URL_PATTERN.test(values.attachmentUrl.trim())
  ) {
    return 'Attachment URL must start with http:// or https://';
  }
  return null;
}

export default function SubmitIdeaForm({
  topics,
  isLoadingTopics,
  initialTopicId = '',
}: SubmitIdeaFormProps) {
  const [values, setValues] = useState<FormValues>({
    ...EMPTY,
    topicId: initialTopicId,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitIdea, { isLoading }] = useSubmitIdea();
  const navigate = useNavigate();

  const serverError = getApiErrorMessage(null);
  const inlineError = validationError ?? serverError;

  const update = (key: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validate(values);
    if (validation) {
      setValidationError(validation);
      return;
    }

    try {
      await submitIdea({
        topicId: values.topicId,
        title: values.title.trim(),
        summary: values.summary.trim(),
        body: values.body.trim(),
        attachmentUrl: values.attachmentUrl.trim() || undefined,
      }).unwrap();
      navigate(CREATOR_ROUTES.submissions, { replace: true });
    } catch (err) {
      setValidationError(getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <div>
        <Label
          htmlFor="topic"
          className="mb-1.5 block text-[12px] font-bold text-[#12231f]"
        >
          Topic
        </Label>
        <select
          id="topic"
          value={values.topicId}
          onChange={(event) => update('topicId', event.target.value)}
          disabled={isLoadingTopics}
          className={fieldClassName + ' appearance-none'}
        >
          <option value="">
            {isLoadingTopics ? 'Loading topics…' : 'Choose a topic'}
          </option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title} · {topic.reward}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label
          htmlFor="title"
          className="mb-1.5 block text-[12px] font-bold text-[#12231f]"
        >
          Title
        </Label>
        <Input
          id="title"
          value={values.title}
          onChange={(event) => update('title', event.target.value)}
          maxLength={TITLE_MAX}
          placeholder="Give it a working title"
          className={fieldClassName}
        />
        <p className="mt-1 text-right text-xs text-[#9aa8a3]">
          {values.title.length}/{TITLE_MAX}
        </p>
      </div>

      <div>
        <Label
          htmlFor="summary"
          className="mb-1.5 block text-[12px] font-bold text-[#12231f]"
        >
          Summary
        </Label>
        <textarea
          id="summary"
          value={values.summary}
          onChange={(event) => update('summary', event.target.value)}
          maxLength={SUMMARY_MAX}
          rows={2}
          placeholder="One or two lines — what is the idea and who is it for?"
          className={fieldClassName}
        />
        <p className="mt-1 text-right text-xs text-[#9aa8a3]">
          {values.summary.length}/{SUMMARY_MAX}
        </p>
      </div>

      <div>
        <Label
          htmlFor="body"
          className="mb-1.5 block text-[12px] font-bold text-[#12231f]"
        >
          Body
        </Label>
        <textarea
          id="body"
          value={values.body}
          onChange={(event) => update('body', event.target.value)}
          maxLength={BODY_MAX}
          rows={8}
          placeholder="Describe the idea, the steps to pilot it, and how you'd measure success."
          className={fieldClassName}
        />
        <p className="mt-1 text-right text-xs text-[#9aa8a3]">
          {values.body.length}/{BODY_MAX}
        </p>
      </div>

      <div>
        <Label
          htmlFor="attachment"
          className="mb-1.5 block text-[12px] font-bold text-[#12231f]"
        >
          Attachment URL <span className="font-normal text-[#9aa8a3]">(optional)</span>
        </Label>
        <Input
          id="attachment"
          value={values.attachmentUrl}
          onChange={(event) => update('attachmentUrl', event.target.value)}
          placeholder="https://"
          className={fieldClassName}
        />
      </div>

      {inlineError ? (
        <p
          className="text-[12px] font-semibold text-[#b3401f]"
          role="alert"
        >
          {inlineError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isLoading || isLoadingTopics}
        className="h-auto w-full rounded-full bg-[#12231f] px-5 py-[14px] text-sm font-bold text-white hover:bg-[#254b40] disabled:opacity-60 sm:w-auto sm:self-start"
      >
        {isLoading ? 'Submitting…' : 'Submit idea'}
      </Button>
    </form>
  );
}