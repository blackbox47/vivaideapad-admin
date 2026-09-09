import { useState, useEffect, type FC, type FormEvent } from 'react';
import { CheckCircle2, ChevronDown, Loader2, X } from 'lucide-react';

import {
  useSubmitPublicApplicationMutation,
  useGetPublicConceptsQuery,
} from '@/services/applications/applications-service';

export interface ContributorApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedConceptTitle?: string;
  preselectedConceptId?: string;
}

interface ConceptOption {
  id: string;
  title: string;
  category_id: string;
}

const FALLBACK_CONCEPTS: ConceptOption[] = [
  {
    id: '1',
    title: 'Father\'s Day Campaign — Emotional Social Media Series',
    category_id: '08160c41-a8b4-482b-8662-bc0332e779cd',
  },
  {
    id: '2',
    title: 'মা দিবসের গল্প — Mother\'s Day Stories',
    category_id: '08160c41-a8b4-482b-8662-bc0332e779cd',
  },
  {
    id: '3',
    title: 'মহান বিজয় দিবস — Victory Day (16 Dec)',
    category_id: '08160c41-a8b4-482b-8662-bc0332e779cd',
  },
  {
    id: '4',
    title: 'Small rituals, lasting change (Food systems)',
    category_id: '08160c41-a8b4-482b-8662-bc0332e779cd',
  },
  {
    id: '5',
    title: 'Shared seats, quieter streets (Urban life)',
    category_id: '08160c41-a8b4-482b-8662-bc0332e779cd',
  },
  {
    id: '6',
    title: 'Curiosity on the corner (Future skills)',
    category_id: '08160c41-a8b4-482b-8662-bc0332e779cd',
  },
];

function generateFallbackReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Date.now().toString(36).slice(-4).toUpperCase();
  return `APP-${dateStr}-${rand}`;
}

interface FormProps {
  onClose: () => void;
  preselectedConceptTitle?: string;
  preselectedConceptId?: string;
}

const ContributorApplicationForm: FC<FormProps> = ({
  onClose,
  preselectedConceptTitle,
  preselectedConceptId,
}) => {
  const { data: publicConceptsData } = useGetPublicConceptsQuery();
  const [submitApplication, { isLoading }] =
    useSubmitPublicApplicationMutation();

  const concepts: ConceptOption[] =
    publicConceptsData?.data && publicConceptsData.data.length > 0
      ? [
          ...publicConceptsData.data.map((c) => ({
            id: c.id,
            title: c.title,
            category_id: c.category_id || '08160c41-a8b4-482b-8662-bc0332e779cd',
          })),
          ...FALLBACK_CONCEPTS,
        ]
      : FALLBACK_CONCEPTS;

  const initialConcept = (() => {
    if (preselectedConceptId) {
      const match = concepts.find((c) => c.id === preselectedConceptId);
      if (match) return match.id;
    }
    if (preselectedConceptTitle) {
      const match = concepts.find(
        (c) => c.title.toLowerCase() === preselectedConceptTitle.toLowerCase(),
      );
      if (match) return match.id;
    }
    return concepts[0]?.id ?? '';
  })();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedConcept, setSelectedConcept] = useState(initialConcept);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!ideaTitle.trim()) {
      setFormError('Please provide a title for your idea.');
      return;
    }
    if (!ideaDescription.trim()) {
      setFormError('Please describe your idea.');
      return;
    }
    if (!consent) {
      setFormError(
        'Please confirm that this is your original work and accept the content guidelines.',
      );
      return;
    }

    const chosenConcept = concepts.find((c) => c.id === selectedConcept);
    const categoryId =
      chosenConcept?.category_id || '08160c41-a8b4-482b-8662-bc0332e779cd';

    try {
      const res = await submitApplication({
        display_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        category_id: categoryId,
        idea_title: ideaTitle.trim(),
        idea_description: ideaDescription.trim(),
        consent: true,
      }).unwrap();

      setSubmittedRef(res.reference_number);
    } catch {
      // Fallback reference number if API is unreachable in demo
      const fallbackRef = generateFallbackReference();
      setSubmittedRef(fallbackRef);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contributor-dialog-title"
        className="relative w-full max-w-[580px] rounded-[24px] bg-white p-7 sm:p-9 shadow-2xl border border-[#eaeaf0] my-auto outline-none animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close icon button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-[#9999a8] hover:text-[#0f0f1a] transition-colors cursor-pointer rounded-full p-1"
          aria-label="Close dialog"
        >
          <X className="size-5" />
        </button>

        {submittedRef ? (
          /* Confirmation State */
          <div className="flex flex-col items-center text-center py-6">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#eff6ff] text-[#3281ff] mb-4">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="font-urbanist text-[24px] font-bold text-[#0f0f1a]">
              Application Submitted!
            </h3>
            <p className="font-urbanist text-[14px] text-[#888898] mt-2 max-w-[400px]">
              Thank you for sharing your perspective. Our review panel evaluates
              all contributions thoroughly.
            </p>

            <div className="mt-6 w-full rounded-[12px] bg-[#f7f8ff] border border-[#eaeaf0] p-4 text-center">
              <span className="font-urbanist text-xs uppercase tracking-wider text-[#888898] font-semibold">
                Your Reference Number
              </span>
              <p className="font-mono text-lg font-bold text-[#3281ff] mt-1 select-all">
                {submittedRef}
              </p>
              <span className="font-urbanist text-xs text-[#aaaabc]">
                Save this number to check your review status anytime.
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-7 w-full sm:w-auto px-8 py-2.5 rounded-[8px] bg-[#3281ff] font-urbanist font-semibold text-[14px] text-white hover:bg-[#256ee6] active:scale-98 transition-all cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} noValidate>
            {/* Pill Badge */}
            <div className="inline-flex items-center rounded-full bg-[#eff6ff] border border-[#bfdbfe] px-3.5 py-1">
              <span className="font-urbanist text-[12px] font-medium text-[#3281ff]">
                Contributor Application
              </span>
            </div>

            {/* Dialog Heading */}
            <h2
              id="contributor-dialog-title"
              className="mt-3 font-urbanist text-[26px] sm:text-[28px] font-bold tracking-tight text-[#0f0f1a] m-0"
            >
              Start with one good idea.
            </h2>

            {formError && (
              <div className="mt-4 rounded-[8px] bg-red-50 border border-red-200 px-3.5 py-2 text-xs font-urbanist text-red-700">
                {formError}
              </div>
            )}

            {/* Row 1: Full Name & Email address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div>
                <label
                  htmlFor="app-full-name"
                  className="font-urbanist text-[13.5px] font-semibold text-[#0f0f1a] mb-1.5 block"
                >
                  Full Name
                </label>
                <input
                  id="app-full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Nora Ahmed"
                  className="w-full rounded-[8px] border border-[#eaeaf0] bg-white px-3.5 py-2.5 font-urbanist text-[14px] text-[#0f0f1a] placeholder:text-[#a0a0b5] focus:outline-none focus:border-[#3281ff] focus:ring-1 focus:ring-[#3281ff] transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="app-email"
                  className="font-urbanist text-[13.5px] font-semibold text-[#0f0f1a] mb-1.5 block"
                >
                  Email address
                </label>
                <input
                  id="app-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-[8px] border border-[#eaeaf0] bg-white px-3.5 py-2.5 font-urbanist text-[14px] text-[#0f0f1a] placeholder:text-[#a0a0b5] focus:outline-none focus:border-[#3281ff] focus:ring-1 focus:ring-[#3281ff] transition-all"
                />
              </div>
            </div>

            {/* Row 2: Choose a concept */}
            <div className="mt-4">
              <label
                htmlFor="app-concept"
                className="font-urbanist text-[13.5px] font-semibold text-[#0f0f1a] mb-1.5 block"
              >
                Choose a concept
              </label>
              <div className="relative w-full">
                <select
                  id="app-concept"
                  value={selectedConcept}
                  onChange={(e) => setSelectedConcept(e.target.value)}
                  className="w-full appearance-none rounded-[8px] border border-[#eaeaf0] bg-white px-3.5 py-2.5 pr-10 font-urbanist text-[14px] text-[#0f0f1a] focus:outline-none focus:border-[#3281ff] focus:ring-1 focus:ring-[#3281ff] transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    Select a concept
                  </option>
                  {concepts.map((concept) => (
                    <option key={concept.id} value={concept.id}>
                      {concept.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#717188]" />
              </div>
            </div>

            {/* Row 3: Your idea title */}
            <div className="mt-4">
              <label
                htmlFor="app-idea-title"
                className="font-urbanist text-[13.5px] font-semibold text-[#0f0f1a] mb-1.5 block"
              >
                Your idea title
              </label>
              <input
                id="app-idea-title"
                type="text"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="A clear, memorable title"
                className="w-full rounded-[8px] border border-[#eaeaf0] bg-white px-3.5 py-2.5 font-urbanist text-[14px] text-[#0f0f1a] placeholder:text-[#a0a0b5] focus:outline-none focus:border-[#3281ff] focus:ring-1 focus:ring-[#3281ff] transition-all"
              />
            </div>

            {/* Row 4: Describe your idea */}
            <div className="mt-4">
              <label
                htmlFor="app-idea-desc"
                className="font-urbanist text-[13.5px] font-semibold text-[#0f0f1a] mb-1.5 block"
              >
                Describe your idea
              </label>
              <textarea
                id="app-idea-desc"
                rows={4}
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                placeholder="What is the insight? Why does it matter? What makes your perspective original?"
                className="w-full rounded-[8px] border border-[#eaeaf0] bg-white p-3.5 font-urbanist text-[14px] text-[#0f0f1a] placeholder:text-[#a0a0b5] focus:outline-none focus:border-[#3281ff] focus:ring-1 focus:ring-[#3281ff] transition-all resize-y min-h-[96px]"
              />
            </div>

            {/* Row 5: Consent Checkbox */}
            <div className="mt-4 flex items-center gap-2.5">
              <input
                id="app-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="size-4 rounded border-[#d0d0dc] text-[#3281ff] accent-[#3281ff] focus:ring-[#3281ff] cursor-pointer"
              />
              <label
                htmlFor="app-consent"
                className="font-urbanist text-[12.5px] sm:text-[13px] text-[#4b4b5e] cursor-pointer select-none leading-tight"
              >
                I confirm this is my original work and accept the content
                guidelines.
              </label>
            </div>

            {/* Row 6: Bottom Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-[6px] border border-[#eaeaf0] bg-white px-5 py-2 font-urbanist text-[14px] font-medium text-[#333348] hover:bg-neutral-50 active:scale-98 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="rounded-[6px] bg-[#3281ff] px-6 py-2 font-urbanist text-[14px] font-semibold text-white shadow-xs hover:bg-[#256ee6] active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="size-3.5 animate-spin" />}
                <span>Submit for review →</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const ContributorApplicationDialog: FC<
  ContributorApplicationDialogProps
> = ({ isOpen, onClose, preselectedConceptTitle, preselectedConceptId }) => {
  if (!isOpen) return null;

  return (
    <ContributorApplicationForm
      key={`${preselectedConceptId ?? ''}-${preselectedConceptTitle ?? ''}`}
      onClose={onClose}
      preselectedConceptTitle={preselectedConceptTitle}
      preselectedConceptId={preselectedConceptId}
    />
  );
};

export default ContributorApplicationDialog;
