import { useState } from 'react';
import rocketImg from '@/assets/hero/rocket-3d.png';

export interface ProcessStep {
  num: string;
  icon: string;
  label: string;
  description: string;
}

export interface ProcessSectionProps {
  badgeText?: string;
  titleLight?: string;
  titleBold?: string;
  description?: string;
  steps?: ProcessStep[];
  defaultActive?: number;
  className?: string;
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    num: '01',
    icon: '📋',
    label: 'Vendor Posts a Request',
    description:
      'A brand publishes a creative brief with a deadline and prize pool.',
  },
  {
    num: '02',
    icon: '✅',
    label: 'Admin Reviews & Approves',
    description:
      'Our team reviews the brief for quality and compliance before it goes live.',
  },
  {
    num: '03',
    icon: '💡',
    label: 'Contributors Submit Ideas',
    description:
      'Creatives from our community submit their best work within the deadline.',
  },
  {
    num: '04',
    icon: '⚖️',
    label: 'Judges Score & Decide',
    description:
      'Expert judges evaluate submissions against clear rubrics and criteria.',
  },
  {
    num: '05',
    icon: '🏆',
    label: 'Winners Announced',
    description:
      'Top submissions are celebrated and winners receive their prize rewards.',
  },
];

export function ProcessSection({
  badgeText = 'The Process',
  titleLight = 'From brief to',
  titleBold = 'Award Winning Idea',
  description = 'A transparent, end-to-end process that turns creative problems into recognized solutions — in 5 structured steps.',
  steps = DEFAULT_STEPS,
  defaultActive = 0,
  className = '',
}: ProcessSectionProps) {
  const [active, setActive] = useState(defaultActive);
  const currentStep = steps[active] || steps[0];

  return (
    <section
      id="how"
      className={`relative w-full border-t border-[#eaeaf0] bg-white px-4 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-20 md:py-28 overflow-hidden ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header row with floating 3D rocket */}
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
          {/* Left: Badge & Heading */}
          <div className="flex flex-col items-start max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3281ff]/[0.08] border border-[#3281ff]/20 mb-4 shadow-2xs">
              <span className="size-1.5 rounded-full bg-[#3281ff] shrink-0" />
              <span className="font-urbanist text-xs font-semibold text-[#3281ff] tracking-wide whitespace-nowrap">
                {badgeText}
              </span>
            </div>

            {/* Heading */}
            <div className="flex flex-col">
              <span className="font-urbanist text-3xl sm:text-4xl md:text-5xl lg:text-[51px] font-light leading-[1.1] text-[#0f0f1a]">
                {titleLight}
              </span>
              <span className="font-urbanist text-3xl sm:text-4xl md:text-5xl lg:text-[51px] font-extrabold leading-[1.1] text-[#3281ff] tracking-tight">
                {titleBold}
              </span>
            </div>
          </div>

          {/* Right: Description & Rocket decoration */}
          <div className="relative flex flex-col items-start md:items-end md:text-right max-w-sm">
            {/* 3D Rocket Decoration */}
            <div
              className="absolute -top-14 sm:-top-16 md:-top-20 right-0 sm:right-4 md:-right-8 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 pointer-events-none select-none drop-shadow-[0_16px_32px_rgba(64,117,174,0.25)] transition-transform duration-500"
              style={{
                animation: 'rocket-float 4.5s ease-in-out infinite',
              }}
            >
              <img
                src={rocketImg}
                alt="Rocket Launch"
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  // Fallback to emoji if asset fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML =
                      '<span style="font-size: 64px; line-height: 1;">🚀</span>';
                  }
                }}
              />
            </div>

            <p className="font-urbanist text-sm sm:text-[15px] font-normal leading-relaxed text-[#888898] mt-6 md:mt-0">
              {description}
            </p>
          </div>
        </div>

        {/* Interactive Step Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full mt-12 sm:mt-16">
          {steps.map((step, i) => {
            const isActive = i === active;
            return (
              <button
                type="button"
                key={step.num}
                onClick={() => setActive(i)}
                className={`group flex flex-col justify-between p-4 rounded-lg text-left transition-all duration-200 cursor-pointer min-h-[104px] border ${
                  isActive
                    ? 'bg-[#3281ff] border-[#3281ff] shadow-[0_4px_16px_rgba(50,129,255,0.25)] -translate-y-0.5'
                    : 'bg-[#f7f8ff] border-[#eaeaf0] hover:border-[#3281ff]/40 hover:bg-[#f0f4ff]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-mono text-xs font-bold tracking-wider transition-colors ${
                      isActive ? 'text-white/80' : 'text-[#aaaabc]'
                    }`}
                  >
                    {step.num}
                  </span>
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg text-base transition-all ${
                      isActive
                        ? 'bg-white/20 text-white shadow-2xs'
                        : 'bg-white border border-[#eaeaf0] shadow-2xs'
                    }`}
                  >
                    <span>{step.icon}</span>
                  </div>
                </div>

                <p
                  className={`mt-3 font-urbanist text-sm font-bold leading-tight transition-colors line-clamp-2 ${
                    isActive ? 'text-white' : 'text-[#0f0f1a]'
                  }`}
                >
                  {step.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Step Detail Card */}
        <div className="mt-8 sm:mt-10 w-full rounded-xl sm:rounded-2xl border border-[#eaeaf0] bg-[#f7f8ff] p-6 sm:p-8 md:p-10 shadow-xs transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 md:gap-8">
            {/* Step Icon */}
            <div className="flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-[#3281ff]/[0.08] border border-[#3281ff]/20 text-2xl sm:text-3xl shrink-0 shadow-2xs">
              <span>{currentStep.icon}</span>
            </div>

            {/* Step Content */}
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-[#3281ff]/[0.08] px-2.5 py-1 font-mono text-xs font-bold text-[#3281ff]">
                  Step {currentStep.num}
                </span>
                <span className="font-urbanist text-xs font-medium text-[#aaaabc]">
                  {active + 1} of {steps.length}
                </span>
              </div>

              <h3 className="mt-3 font-urbanist text-xl sm:text-2xl md:text-[26px] font-bold text-[#0f0f1a] leading-tight">
                {currentStep.label}
              </h3>

              <p className="mt-2.5 font-urbanist text-sm sm:text-base leading-relaxed text-[#555568] max-w-2xl">
                {currentStep.description}
              </p>
            </div>

            {/* Pagination Dots */}
            <div className="flex sm:flex-col items-center gap-2 self-center sm:self-start pt-1">
              {steps.map((stepItem, i) => {
                const isDotActive = i === active;
                return (
                  <button
                    type="button"
                    key={stepItem.num}
                    onClick={() => setActive(i)}
                    aria-label={`Go to step ${stepItem.num}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isDotActive
                        ? 'w-6 bg-[#3281ff]'
                        : 'w-2 bg-[#e0e0ec] hover:bg-[#3281ff]/50'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating animation keyframe */}
      <style>{`
        @keyframes rocket-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }
      `}</style>
    </section>
  );
}

export default ProcessSection;
