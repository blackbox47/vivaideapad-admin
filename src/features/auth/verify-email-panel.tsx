import { useMemo, useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

import OnboardingTopicCards from '@/features/auth/onboarding-topic-cards';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';
import {
  useGetPublicConceptsQuery,
  useSubmitVerifyEmailApplicationMutation,
  useValidateVerifyEmailTokenQuery,
} from '@/services/applications/applications-service';
import {
  BODY_MAX,
  SUMMARY_MAX,
} from '@/models/creator/submit-idea-model';
import { getApiErrorMessage } from '@/utils/helpers/api-error';
import { CREATOR_ROUTES } from '@/utils/constants/routes';
import { cn } from '@/lib/utils';
import { htmlToPlainText, sanitizeHtml } from '@/utils/helpers/sanitize-html';

interface VerifyEmailPanelProps {
  token: string;
  brandName?: string;
}

const fieldClassName =
  'rounded-xl border-border bg-card px-3.5 py-2.5 text-base shadow-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 md:text-sm';

function BrandMark() {
  return (
    <div
      className="flex size-7 items-center justify-center rounded-xl bg-primary shadow-xs"
      aria-hidden
    >
      <div className="size-2.5 rounded-full bg-white" />
    </div>
  );
}

export default function VerifyEmailPanel({
  token,
  brandName = 'Viva IdeaPad',
}: VerifyEmailPanelProps) {
  const hasToken = token.trim().length > 0;

  const {
    data: identity,
    isLoading: isValidating,
    isError: isValidateError,
    error: validateError,
  } = useValidateVerifyEmailTokenQuery(token, { skip: !hasToken });

  const canLoadTopics =
    hasToken && Boolean(identity) && !identity?.application_status;

  const { data: conceptsData, isLoading: isLoadingConcepts } =
    useGetPublicConceptsQuery(
      { isOnboarding: true, limit: 50 },
      { skip: !canLoadTopics },
    );

  const [submitApplication, { isLoading: isSubmitting }] =
    useSubmitVerifyEmailApplicationMutation();

  const topics = conceptsData?.data ?? [];

  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [ideaSummary, setIdeaSummary] = useState('');
  const [ideaBody, setIdeaBody] = useState('');
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  const effectiveTopicId = useMemo(() => {
    if (
      selectedTopicId &&
      topics.some((topic) => topic.id === selectedTopicId)
    ) {
      return selectedTopicId;
    }
    return topics[0]?.id ?? '';
  }, [topics, selectedTopicId]);

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === effectiveTopicId) ?? null,
    [topics, effectiveTopicId],
  );

  const ideaTitle = selectedTopic?.title?.trim() ?? '';

  const bodyPlainLength = useMemo(
    () => htmlToPlainText(ideaBody).length,
    [ideaBody],
  );

  const validateMessage = getApiErrorMessage(validateError);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!effectiveTopicId || !ideaTitle) {
      setFormError('Please choose an onboarding topic.');
      return;
    }
    if (bodyPlainLength < 1) {
      setFormError('Please describe your idea.');
      return;
    }
    if (!consent) {
      setFormError(
        'Please confirm this is your original work and accept the content guidelines.',
      );
      return;
    }

    try {
      const result = await submitApplication({
        token,
        concept_id: effectiveTopicId,
        idea_title: ideaTitle,
        idea_summary: ideaSummary.trim() || undefined,
        idea_description: sanitizeHtml(ideaBody),
        consent: true,
      }).unwrap();
      setReferenceNumber(result.reference_number);
      toast.success('Application submitted for review.');
    } catch (error) {
      const message =
        getApiErrorMessage(error) ??
        'Could not submit your application. Please try again.';
      setFormError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto bg-background px-5 py-8 sm:px-8 md:w-[56%] md:bg-surface-subtle md:px-10 lg:px-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-2.5 md:hidden">
          <BrandMark />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {brandName}
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          {!hasToken ? (
            <StatusCard
              tone="error"
              title="Missing verification link"
              body="Open the link from your sign-up email to continue. If you did not receive one, sign up again."
            />
          ) : isValidating ? (
            <div className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-primary" />
              Checking your verification link…
            </div>
          ) : isValidateError ? (
            <StatusCard
              tone="error"
              title="Link unavailable"
              body={
                validateMessage ??
                'This verification link is invalid or has expired.'
              }
            />
          ) : referenceNumber || identity?.application_status ? (
            <div className="flex min-h-[min(60vh,28rem)] flex-col items-center justify-center px-2 text-center">
              <div className="w-full max-w-md space-y-5">
                <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
                  <CheckCircle2 className="size-10 shrink-0 text-primary" />
                  <h2 className="mt-4 text-lg font-semibold text-foreground">
                    {referenceNumber
                      ? 'Application submitted'
                      : 'Application already received'}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    An admin will review your idea. You will be able to sign in
                    after approval.
                  </p>
                  {referenceNumber ? (
                    <p className="mt-4 rounded-lg bg-muted/50 px-3 py-2 font-mono text-sm font-semibold text-foreground">
                      Ref: {referenceNumber}
                    </p>
                  ) : null}
                </div>
                <div className="flex justify-center">
                  <Link
                    to={CREATOR_ROUTES.login}
                    className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-brand-forest"
                  >
                    Go to sign in
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Complete your application
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  Share one strong idea
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Signed up as{' '}
                  <span className="font-semibold text-foreground">
                    {identity?.email}
                  </span>
                  . Pick an onboarding topic and write your idea for review.
                </p>
              </div>

              <OnboardingTopicCards
                topics={topics}
                isLoading={isLoadingConcepts}
                selectedTopicId={effectiveTopicId}
                onSelectTopic={setSelectedTopicId}
              />

              {formError ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-3.5 py-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              ) : null}

              <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-xs md:bg-transparent md:p-0 md:shadow-none md:border-0">
                <div className="space-y-1.5">
                  <Label htmlFor="verify-title">Idea title</Label>
                  <Input
                    id="verify-title"
                    value={ideaTitle}
                    readOnly
                    tabIndex={-1}
                    placeholder="Select a topic card above"
                    className={cn(
                      fieldClassName,
                      'cursor-default bg-muted/40 text-foreground',
                    )}
                    aria-readonly="true"
                  />
                  <p className="text-xs text-muted-foreground">
                    Set automatically from the selected onboarding topic.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="verify-summary">
                    Summary{' '}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="verify-summary"
                    value={ideaSummary}
                    onChange={(event) =>
                      setIdeaSummary(event.target.value.slice(0, SUMMARY_MAX))
                    }
                    placeholder="One or two sentences on the idea"
                    className={cn(fieldClassName, 'min-h-20 resize-y')}
                    maxLength={SUMMARY_MAX}
                  />
                  <p className="text-right text-[11px] text-muted-foreground">
                    {ideaSummary.length}/{SUMMARY_MAX}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="verify-body">Idea body</Label>
                  <RichTextEditor
                    id="verify-body"
                    value={ideaBody}
                    onChange={setIdeaBody}
                    placeholder="Describe the idea, who it helps, and why it matters."
                    minHeight={180}
                    maxLength={BODY_MAX}
                  />
                  <p className="text-right text-[11px] text-muted-foreground">
                    {bodyPlainLength}/{BODY_MAX}
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-1 size-4 rounded border-border text-primary focus-visible:ring-primary/20"
                  />
                  <span>
                    I confirm this is my original work and I accept the content
                    guidelines.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting || topics.length === 0}
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-brand-forest disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    'Submit for review'
                  )}
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already approved?{' '}
                <Link
                  to={CREATOR_ROUTES.login}
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}

          {(isValidateError || !hasToken) && (
            <div className="mt-6 space-y-3">
              <Link
                to={CREATOR_ROUTES.signUp}
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-brand-forest"
              >
                Back to sign up
              </Link>
              <Link
                to={CREATOR_ROUTES.login}
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                Go to sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  tone,
  title,
  body,
}: {
  tone: 'error' | 'info';
  title: string;
  body: string;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3.5 rounded-xl border p-4.5',
        tone === 'error'
          ? 'border-destructive/20 bg-destructive/5'
          : 'border-border bg-card shadow-xs',
      )}
    >
      <AlertCircle
        className={cn(
          'mt-0.5 size-5 shrink-0',
          tone === 'error' ? 'text-destructive' : 'text-primary',
        )}
      />
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  );
}
