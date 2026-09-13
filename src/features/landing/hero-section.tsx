import takaCoinImg from '@/assets/hero/taka-coin.png';
import notebookPenImg from '@/assets/hero/notebook-pen.png';
import paperBgImg from '@/assets/hero/paper-bg.jpg';
import { CURRENCY_SYMBOL } from '@/utils/constants';

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroProps {
  badgeText?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  stats?: HeroStat[];
  className?: string;
}

const DEFAULT_STATS: HeroStat[] = [
  { value: '6', label: 'Active Requests' },
  { value: '151', label: 'Ideas Submitted' },
  { value: `${CURRENCY_SYMBOL} 1.65L`, label: 'Total Prizes' },
];

export function Hero({
  badgeText = '6 live idea requests · Open to all',
  titleLine1 = 'Where the Best Ideas',
  titleLine2 = 'Get Hunted.',
  description = 'Brands post creative challenges. Contributors worldwide submit ideas. Judges pick winners. Prizes get paid. A living marketplace for creative minds.',
  ctaText = 'Share your Idea →',
  onCtaClick,
  stats = DEFAULT_STATS,
  className = '',
}: HeroProps) {
  return (
    <section
      className={`relative w-full overflow-hidden bg-[#fafafc] ${className}`}
      style={{
        minHeight: '820px',
      }}
    >
      {/* Authentic crumpled paper texture background */}
      <div
        className="absolute inset-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-[0.88] mix-blend-multiply"
        style={{
          backgroundImage: `url(${paperBgImg})`,
        }}
      />

      {/* Radiant blue glow centered from the top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(50, 129, 255, 0.14) 0%, rgba(50, 129, 255, 0.04) 50%, rgba(255, 255, 255, 0) 75%)',
        }}
      />

      {/* Subtle paper grain / micro texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(50, 129, 255, 0.25) 39px, rgba(50, 129, 255, 0.25) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(50, 129, 255, 0.25) 39px, rgba(50, 129, 255, 0.25) 40px)',
        }}
      />

      {/* Main hero content container */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-20 pb-24 md:pt-24 md:pb-32 flex flex-col items-center text-center">
        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#3281ff]/20 bg-[#3281ff]/[0.07] backdrop-blur-xs shadow-xs mb-8 sm:mb-10 transition-all hover:bg-[#3281ff]/10">
          <span className="relative flex size-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3281ff] opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-[#3281ff]" />
          </span>
          <span className="font-urbanist text-xs sm:text-[13px] font-normal tracking-wide text-[#3281ff] whitespace-nowrap">
            {badgeText}
          </span>
        </div>

        {/* Hero Title with Floating 3D Taka Coin */}
        <div className="relative flex flex-col items-center">
          <h1 className="font-urbanist text-[#0f0f1a] font-normal tracking-[-0.03em] leading-[1.05] text-[44px] sm:text-[62px] md:text-[76px] lg:text-[88px] m-0">
            {titleLine1}
          </h1>

          <div className="relative inline-block mt-1 sm:mt-2">
            <span className="font-urbanist text-[#3281ff] font-extrabold italic tracking-[-0.025em] leading-[1.05] text-[44px] sm:text-[62px] md:text-[76px] lg:text-[88px] inline-block">
              {titleLine2}
            </span>

            {/* 3D Taka Coin with purple sparkles */}
            <div
              className="absolute -top-6 sm:-top-8 md:-top-11 -right-16 sm:-right-24 md:-right-32 lg:-right-36 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 pointer-events-none select-none drop-shadow-[0_12px_24px_rgba(50,129,255,0.22)] transition-transform duration-500 hover:scale-105"
              style={{
                animation: 'hero-float 5s ease-in-out infinite',
              }}
            >
              <img
                src={takaCoinImg}
                alt="Taka Reward Coin"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Supporting Description */}
        <p className="mt-6 sm:mt-7 max-w-[650px] font-urbanist text-[16px] sm:text-[18px] md:text-[19px] leading-[1.62] text-[#666680] font-normal">
          {description}
        </p>

        {/* CTA Button */}
        <div className="mt-9 sm:mt-10">
          <button
            type="button"
            onClick={onCtaClick}
            className="group relative inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#3281ff] px-8 sm:px-9 py-3.5 sm:py-4 font-urbanist text-[15px] sm:text-[16px] font-medium text-white shadow-[0_4px_18px_rgba(50,129,255,0.35)] transition-all duration-200 hover:bg-[#256ee6] hover:shadow-[0_8px_26px_rgba(50,129,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:opacity-90 cursor-pointer"
          >
            <span>{ctaText}</span>
          </button>
        </div>

        {/* Stats Card Container with 3D Notebook & Pen */}
        <div className="relative mt-16 sm:mt-20 w-full max-w-[560px] mx-auto">
          {/* Floating 3D Notebook & Pen - Bottom-Left Overlapping */}
          <div
            className="absolute -left-10 sm:-left-16 md:-left-20 -bottom-7 sm:-bottom-9 w-22 h-22 sm:w-28 sm:h-28 md:w-34 md:h-34 pointer-events-none select-none z-20 drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-transform duration-500 hover:scale-105"
            style={{
              animation: 'hero-float-reverse 6s ease-in-out infinite',
            }}
          >
            <img
              src={notebookPenImg}
              alt="Ideas Notebook and Pen"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>

          {/* Elevated Stats Card */}
          <div className="relative z-10 grid grid-cols-3 divide-x divide-[#eaeaf0] rounded-[10px] sm:rounded-[12px] border border-[#eaeaf0] bg-white shadow-[0_4px_28px_rgba(50,129,255,0.06),0_1px_3px_rgba(0,0,0,0.02)]">
            {stats.map((stat) => (
              <StatCell key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating animations styling */}
      <style>{`
        @keyframes hero-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1.5deg);
          }
        }
        @keyframes hero-float-reverse {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(6px) rotate(-1.5deg);
          }
        }
      `}</style>
    </section>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-3 sm:px-5 py-5 sm:py-6 text-center">
      <p className="font-urbanist text-[26px] sm:text-[32px] md:text-[34px] font-normal sm:font-medium leading-none text-[#3281ff] whitespace-nowrap">
        {value}
      </p>
      <p className="mt-2 font-urbanist text-[11px] sm:text-[12px] md:text-[13px] font-normal leading-4 text-[#9999b0] whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}

export default Hero;
