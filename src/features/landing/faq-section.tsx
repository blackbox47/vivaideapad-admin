import { useState, type FC } from 'react';

export interface FaqItemData {
  question: string;
  answer: string;
}

export interface FaqSectionProps {
  badgeText?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  ctaText?: string;
  faqs?: FaqItemData[];
  onContactClick?: () => void;
  className?: string;
  id?: string;
}

const DEFAULT_FAQS: FaqItemData[] = [
  {
    question: 'Who can submit ideas?',
    answer:
      'Anyone with an account on Viva IdeaPad can submit ideas to open requests posted by vendors.',
  },
  {
    question: 'How are winners selected?',
    answer:
      'Winners are chosen by a panel of judges based on creativity, feasibility, and alignment with the vendor\'s needs.',
  },
  {
    question: 'Can I submit more than one idea to the same request?',
    answer:
      'Yes, you may submit multiple ideas to a single request. Each submission is evaluated independently.',
  },
  {
    question: 'How do I receive my prize?',
    answer:
      'Prize details are specified per request. Winners are contacted via email within 14 days of selection.',
  },
  {
    question: 'Can my idea be used without winning?',
    answer:
      'By submitting, you grant the vendor a license to use your idea. Review the request\'s terms for specifics.',
  },
  {
    question: 'How do I post a request as a vendor?',
    answer:
      'Upgrade to a vendor account, then use the \'Post a Request\' button in your dashboard to get started.',
  },
  {
    question: 'Is there a deadline for submissions?',
    answer:
      'Each request has its own deadline, displayed prominently on the request page.',
  },
  {
    question: 'Can I see submissions from other contributors?',
    answer:
      'Submissions are kept private during the review period to ensure fair judging.',
  },
];

export const FaqItem: FC<FaqItemData> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="bg-[#fafafa] border-[#eaeaf0] border-[1.332px] border-solid rounded-[6px] w-full overflow-hidden cursor-pointer transition-colors duration-150 hover:border-[#d0d0de]"
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setOpen((v) => !v);
        }
      }}
    >
      <div className="flex items-center justify-between px-[24px] py-[20px] gap-4">
        <p className="font-urbanist font-['Urbanist:SemiBold','Urbanist',sans-serif] font-semibold text-[15.2px] leading-[20.9px] text-[#0f0f1a] select-none [word-break:break-word] m-0">
          {question}
        </p>
        <div
          className="bg-white border-[#e0e0ec] border-[1.332px] border-solid flex items-center justify-center rounded-full shrink-0 size-[28px] transition-transform duration-200 select-none shadow-2xs"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <span className="font-urbanist font-['Urbanist:Bold','Urbanist',sans-serif] font-bold text-[14px] leading-[20px] text-[#aaaabc]">
            +
          </span>
        </div>
      </div>
      {open && (
        <div className="px-[24px] pb-[20px] animate-in fade-in-50 duration-200">
          <p className="font-urbanist font-['Urbanist:Regular','Urbanist',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#888898] m-0">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export const FaqSection: FC<FaqSectionProps> = ({
  badgeText = 'FAQ',
  titleLine1 = 'Got questions?',
  titleLine2 = 'We have answers.',
  description = 'Everything you need to know about Viva IdeaPad — for contributors, vendors, and judges alike.',
  ctaText = 'Still have questions? Contact us →',
  faqs = DEFAULT_FAQS,
  onContactClick,
  className = '',
  id = 'faq',
}) => {
  return (
    <section
      id={id}
      className={`bg-white border-[#eaeaf0] border-solid border-t-[0.666px] flex flex-col items-center px-6 sm:px-10 lg:px-[64px] py-16 lg:py-[112px] w-full scroll-mt-20 ${className}`}
    >
      <div className="flex flex-col items-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[422.4px_1fr] gap-y-10 lg:gap-x-[64px] w-full max-w-[1152px]">
          {/* Left sticky column */}
          <div className="self-start lg:sticky lg:top-[32px]">
            {/* FAQ badge */}
            <div className="inline-flex items-center gap-[6px] bg-[rgba(50,129,255,0.08)] border-[0.666px] border-[rgba(50,129,255,0.2)] border-solid rounded-full px-[12px] py-[4px] mb-[16px]">
              <div className="bg-[#3281ff] rounded-full size-[5.994px] shrink-0" />
              <span className="font-urbanist font-['Urbanist:SemiBold','Urbanist',sans-serif] font-semibold text-[12px] leading-[16px] text-[#3281ff]">
                {badgeText}
              </span>
            </div>

            {/* Heading */}
            <div className="mb-0">
              <h2 className="font-urbanist font-['Urbanist:Regular','Urbanist',sans-serif] font-normal text-[36px] sm:text-[42px] lg:text-[48px] leading-[42px] sm:leading-[48px] lg:leading-[52.8px] text-[#0f0f1a] m-0">
                {titleLine1}
              </h2>
              <p className="font-urbanist font-['Urbanist:ExtraBold','Urbanist',sans-serif] font-extrabold text-[36px] sm:text-[42px] lg:text-[48px] leading-[42px] sm:leading-[48px] lg:leading-[52.8px] text-[#3281ff] m-0">
                {titleLine2}
              </p>
            </div>

            {/* Paragraph */}
            <p className="font-urbanist font-['Urbanist:Regular','Urbanist',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#888898] w-full max-w-[422px] pt-[16px] pb-[32px] m-0">
              {description}
            </p>

            {/* CTA button */}
            <button
              type="button"
              onClick={onContactClick}
              className="cursor-pointer bg-[#3281ff] text-white font-urbanist font-['Urbanist:SemiBold','Urbanist',sans-serif] font-semibold text-[14px] leading-[20px] px-[16px] py-[10px] rounded-[6px] whitespace-nowrap hover:bg-[#1a6ef5] active:scale-98 transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3281ff] focus-visible:ring-offset-2"
            >
              {ctaText}
            </button>
          </div>

          {/* Right FAQ accordion column */}
          <div className="flex flex-col gap-[12px] w-full">
            {faqs.map((faq) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
