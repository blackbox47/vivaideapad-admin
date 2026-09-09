import type { FC } from 'react';

export interface LeaderboardRowData {
  rank: string;
  initials: string;
  name: string;
  stats: string;
  amount: string;
  highlighted?: boolean;
}

export interface LeaderboardSectionProps {
  badgeText?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  rows?: LeaderboardRowData[];
  onCtaClick?: () => void;
  className?: string;
  id?: string;
}

const DEFAULT_LEADERBOARD_ROWS: LeaderboardRowData[] = [
  {
    rank: '🏆',
    initials: 'NR',
    name: 'Nadia Rahman',
    stats: '9 wins · 47 ideas',
    amount: '৳ 2,40,000',
    highlighted: true,
  },
  {
    rank: '🥈',
    initials: 'TA',
    name: 'Tanvir Ahmed',
    stats: '7 wins · 38 ideas',
    amount: '৳ 1,85,000',
    highlighted: false,
  },
  {
    rank: '🥉',
    initials: 'SI',
    name: 'Sadia Islam',
    stats: '6 wins · 35 ideas',
    amount: '৳ 1,60,000',
    highlighted: false,
  },
  {
    rank: '#4',
    initials: 'FH',
    name: 'Farhan Hossain',
    stats: '5 wins · 29 ideas',
    amount: '৳ 1,20,000',
    highlighted: false,
  },
  {
    rank: '#5',
    initials: 'MN',
    name: 'Meherun Nessa',
    stats: '4 wins · 24 ideas',
    amount: '৳ 95,000',
    highlighted: false,
  },
];

export const LeaderboardRow: FC<LeaderboardRowData> = ({
  rank,
  initials,
  name,
  stats,
  amount,
  highlighted = false,
}) => {
  return (
    <div
      className={`${
        highlighted ? 'bg-[rgba(50,129,255,0.08)]' : 'bg-white'
      } border-[#eaeaf0] border-b-[0.666px] border-solid content-stretch flex gap-[16px] items-center px-[20px] py-[16px] relative shrink-0 w-full transition-colors duration-150 ${
        highlighted ? 'hover:bg-[rgba(50,129,255,0.12)]' : 'hover:bg-neutral-50/80'
      }`}
    >
      <div className="content-stretch flex flex-col items-center relative shrink-0 w-[31.991px]">
        <p
          className="[word-break:break-word] font-mono font-['JetBrains_Mono:Bold','JetBrains_Mono',monospace] font-bold leading-[20px] relative shrink-0 text-[14px] text-center whitespace-nowrap select-none"
          style={{ color: highlighted ? '#3281ff' : '#aaaabc' }}
        >
          {rank}
        </p>
      </div>

      <div
        className={`${
          highlighted
            ? 'bg-[#3281ff] border-[#3281ff]'
            : 'bg-[#f3f4ff] border-[#eaeaf0]'
        } border-[0.666px] border-solid content-stretch flex items-center justify-center relative rounded-full shrink-0 size-[31.991px] select-none`}
      >
        <p
          className={`[word-break:break-word] font-urbanist font-['Urbanist:Bold','Urbanist',sans-serif] font-bold leading-[16px] relative shrink-0 text-[12px] ${
            highlighted ? 'text-white' : 'text-[#666680]'
          } whitespace-nowrap`}
        >
          {initials}
        </p>
      </div>

      <div className="content-stretch flex flex-1 flex-col items-start min-w-px relative">
        <div className="content-stretch flex flex-col h-[19.992px] items-start overflow-clip relative shrink-0 w-full">
          <p className="[word-break:break-word] font-urbanist font-['Urbanist:Medium','Urbanist',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#0f0f1a] text-[14px] whitespace-nowrap">
            {name}
          </p>
        </div>
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <p className="[word-break:break-word] font-urbanist font-['Urbanist:Regular','Urbanist',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#aaaabc] text-[12px] whitespace-nowrap">
            {stats}
          </p>
        </div>
      </div>

      <div className="content-stretch flex flex-col items-start relative shrink-0">
        <p className="[word-break:break-word] font-mono font-['JetBrains_Mono:Bold','Noto_Sans_Bengali:Bold','JetBrains_Mono',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#3281ff] text-[14px] whitespace-nowrap">
          {amount}
        </p>
      </div>
    </div>
  );
};

export const LeaderboardSection: FC<LeaderboardSectionProps> = ({
  badgeText = 'Top Contributors',
  title = 'The Creative Elite',
  description = `The leaderboard tracks every idea submitted, every prize won, and every judge's nod — permanently and publicly. Make your mark.`,
  ctaText = 'See Full Leaderboard',
  rows = DEFAULT_LEADERBOARD_ROWS,
  onCtaClick,
  className = '',
  id = 'leaderboard',
}) => {
  return (
    <section
      id={id}
      className={`border-[#eaeaf0] border-solid border-t-[0.666px] content-stretch flex flex-col items-center px-6 sm:px-10 lg:px-[64px] py-16 lg:py-[96px] relative w-full scroll-mt-20 ${className}`}
    >
      <div className="gap-x-[48px] gap-y-[48px] grid grid-cols-1 lg:grid-cols-2 max-w-[1152px] w-full">
        {/* Left: text + CTA */}
        <div className="content-stretch flex flex-col items-start self-start">
          {/* Eyebrow badge */}
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            <p className="[word-break:break-word] font-urbanist font-['Urbanist:Regular','Urbanist',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#3281ff] text-[12px] uppercase whitespace-nowrap">
              {badgeText}
            </p>
          </div>

          {/* Heading */}
          <div className="content-stretch flex flex-col min-h-[56px] lg:h-[84px] items-start pt-[12px] relative shrink-0 w-full">
            <h2 className="[word-break:break-word] font-urbanist font-['Urbanist:Regular','Urbanist',sans-serif] font-normal leading-[42px] sm:leading-[54px] lg:leading-[72px] relative shrink-0 text-[#0f0f1a] text-[34px] sm:text-[42px] lg:text-[48px] tracking-tight lg:whitespace-nowrap m-0">
              {title}
            </h2>
          </div>

          {/* Paragraph */}
          <div className="content-stretch flex flex-col items-start pb-[24px] pt-[16px] relative shrink-0 w-full">
            <p className="[word-break:break-word] font-urbanist font-['Urbanist:Regular','Urbanist',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#888898] text-[14px] max-w-[552px] m-0">
              {description}
            </p>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={onCtaClick}
            className="cursor-pointer bg-[#3281ff] rounded-[6px] px-[16px] py-[9px] border-none shadow-2xs transition-all hover:bg-[#256ee6] active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3281ff] focus-visible:ring-offset-2"
          >
            <p className="[word-break:break-word] font-urbanist font-['Urbanist:SemiBold','Urbanist',sans-serif] font-semibold leading-[20px] text-[14px] text-center text-white whitespace-nowrap m-0">
              {ctaText}
            </p>
          </button>
        </div>

        {/* Right: leaderboard card */}
        <div className="bg-transparent border-[#eaeaf0] border-[0.666px] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[6px] self-start w-full shadow-2xs">
          {rows.map((row) => (
            <LeaderboardRow key={row.rank} {...row} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
