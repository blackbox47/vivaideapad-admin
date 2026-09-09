import type { FC } from 'react';

export interface CtaSectionProps {
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
  id?: string;
}

export const CtaSection: FC<CtaSectionProps> = ({
  eyebrow = 'Ready to Compete?',
  titleLine1 = 'Your next winning idea',
  titleLine2 = 'is waiting to be written.',
  description = 'Join thousands of contributors earning prizes for creative ideas. Free to register. No limits on submissions.',
  primaryCtaText = 'Create Free Account',
  secondaryCtaText = 'Share your Idea',
  onPrimaryClick,
  onSecondaryClick,
  className = '',
  id = 'cta',
}) => {
  return (
    <section
      id={id}
      className={`relative flex flex-col items-center px-6 sm:px-10 lg:px-16 py-16 lg:py-24 w-full overflow-hidden bg-[#f7f8ff] border-t-[0.666px] border-solid border-[#eaeaf0] ${className}`}
    >
      {/* Decorative target icon – bottom left */}
      <div
        className="absolute left-[3%] sm:left-[6%] bottom-[10%] sm:bottom-[15%] w-[84px] h-[80px] sm:w-[122px] sm:h-[117px] flex items-center justify-center pointer-events-none select-none opacity-40 sm:opacity-100 transition-opacity"
        style={{ filter: 'drop-shadow(10px 20px 40px rgba(64,117,174,0.35))' }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full"
        >
          <circle cx="58" cy="62" r="46" fill="#e8eeff" />
          <circle
            cx="58"
            cy="62"
            r="34"
            fill="white"
            stroke="#4f7fff"
            strokeWidth="3"
          />
          <circle
            cx="58"
            cy="62"
            r="20"
            fill="#4f7fff"
            opacity="0.15"
            stroke="#4f7fff"
            strokeWidth="3"
          />
          <circle cx="58" cy="62" r="7" fill="#4f7fff" />
          {/* Arrow */}
          <line
            x1="80"
            y1="38"
            x2="62"
            y2="58"
            stroke="#ff6b35"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <polygon points="84,28 90,42 76,36" fill="#ff6b35" />
        </svg>
      </div>

      {/* Decorative search/chart icon – top right */}
      <div
        className="absolute right-[3%] sm:right-[6%] top-[8%] sm:top-[12%] w-[80px] h-[75px] sm:w-[116px] sm:h-[109px] flex items-center justify-center pointer-events-none select-none opacity-40 sm:opacity-100 transition-opacity"
        style={{ filter: 'drop-shadow(10px 20px 40px rgba(64,117,174,0.35))' }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 110 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full"
        >
          <circle cx="46" cy="46" r="38" fill="#e8eeff" />
          <circle
            cx="46"
            cy="46"
            r="30"
            fill="white"
            stroke="#4f7fff"
            strokeWidth="3"
          />
          {/* Chart bars inside */}
          <rect x="30" y="48" width="8" height="14" rx="2" fill="#4f7fff" />
          <rect x="42" y="40" width="8" height="22" rx="2" fill="#7c3aed" />
          <rect
            x="54"
            y="44"
            width="8"
            height="18"
            rx="2"
            fill="#4f7fff"
            opacity="0.6"
          />
          {/* Magnifier handle */}
          <line
            x1="68"
            y1="68"
            x2="84"
            y2="84"
            stroke="#7c3aed"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-[6px] flex flex-col items-center p-8 sm:p-10 lg:p-12 w-full max-w-[669px] shadow-xs border border-[#eaeaf0]/70">
          {/* Eyebrow */}
          <p className="uppercase text-center text-[12px] leading-4 tracking-wide font-urbanist font-['Urbanist:Regular','Urbanist',sans-serif] text-[#3281ff] m-0 font-medium">
            {eyebrow}
          </p>

          {/* Heading */}
          <div className="mt-4 text-center leading-none">
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] leading-[38px] sm:leading-[46px] lg:leading-[52px] font-urbanist font-['Urbanist:Regular','Urbanist',sans-serif] font-normal text-[#0f0f1a] m-0">
              {titleLine1}
            </h2>
            <p className="text-[32px] sm:text-[40px] lg:text-[48px] leading-[38px] sm:leading-[46px] lg:leading-[52px] italic font-urbanist font-['Urbanist:ExtraBold_Italic','Urbanist:ExtraBold','Urbanist',sans-serif] font-extrabold text-[#3281ff] m-0">
              {titleLine2}
            </p>
          </div>

          {/* Subtext */}
          <p className="mt-4 text-center text-[14px] leading-[22.75px] font-urbanist font-['Urbanist:Regular','Urbanist',sans-serif] text-[#888898] max-w-[500px] m-0">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 w-full sm:w-auto items-center justify-center">
            <button
              type="button"
              onClick={onPrimaryClick}
              className="w-full sm:w-auto px-8 py-3 rounded-[6px] text-white text-[16px] leading-6 cursor-pointer bg-[#3281ff] hover:bg-[#256ee6] active:scale-98 transition-all font-urbanist font-['Urbanist:SemiBold','Urbanist',sans-serif] font-semibold shadow-2xs border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3281ff] focus-visible:ring-offset-2"
            >
              {primaryCtaText}
            </button>
            <button
              type="button"
              onClick={onSecondaryClick}
              className="w-full sm:w-auto px-8 py-3 rounded-[6px] text-[16px] leading-6 bg-white hover:bg-neutral-50 active:scale-98 transition-all border border-solid border-[#eaeaf0] font-urbanist font-['Urbanist:Medium','Urbanist',sans-serif] font-medium text-[#333348] shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3281ff] focus-visible:ring-offset-2"
            >
              {secondaryCtaText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
