import { ArrowRight, Clock } from 'lucide-react';

export interface FeaturedRequest {
  id?: string;
  category: string;
  daysLeft: string;
  title: string;
  description: string;
  tags: string[];
  postedBy: string;
  amount: string;
  ideas: string;
}

export interface FeaturedRequestsProps {
  eyebrow?: string;
  title?: string;
  viewAllText?: string;
  onViewAll?: () => void;
  onRequestClick?: (request: FeaturedRequest) => void;
  requests?: FeaturedRequest[];
  className?: string;
}

const DEFAULT_REQUESTS: FeaturedRequest[] = [
  {
    id: '1',
    category: 'Family Occasions',
    daysLeft: '17d left',
    title: 'Father\'s Day Campaign — Emotional Social Media Series',
    description:
      'We need a compelling social media campaign concept for Father\'s Day that resonates emotionally with urban Bangladeshi families. Fresh outside-the-box thinking required.',
    tags: ['#Father\'s Day', '#Emotional', '#Social Media'],
    postedBy: 'Cloudomnium',
    amount: '৳ 25,000',
    ideas: '34',
  },
  {
    id: '2',
    category: 'Family Occasions',
    daysLeft: '25d left',
    title: 'মা দিবসের গল্প — Mother\'s Day Stories',
    description:
      'Share a heartfelt story or campaign idea celebrating mothers for the client\'s Mother\'s Day seminar content.',
    tags: ['#Mother\'s Day', '#Family', '#Emotional'],
    postedBy: 'Vivasoft Limited',
    amount: '৳ 40,000',
    ideas: '19',
  },
  {
    id: '3',
    category: 'National Days',
    daysLeft: '9d left',
    title: 'মহান বিজয় দিবস — Victory Day (16 Dec)',
    description:
      'Craft a launch moment that turns our sustainable water bottle into a cultural talking point on TikTok and Instagram Reels.',
    tags: ['#Viral', '#Eco', '#Launch'],
    postedBy: 'Green Feather Technologies',
    amount: '৳ 15,000',
    ideas: '51',
  },
];

export function Pill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[#3281ff]/20 bg-[#3281ff]/[0.08] px-2.5 py-0.5 text-xs font-medium text-[#3281ff] whitespace-nowrap">
      <span>{label}</span>
    </div>
  );
}

export function TimePill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 py-0.5 text-xs font-medium text-[#666680] whitespace-nowrap">
      <Clock className="size-3 text-[#3281ff]" />
      <span>{label}</span>
    </div>
  );
}

export function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[6px] border border-[#eaeaf0] bg-[#f3f4ff] px-2 py-0.5 font-urbanist text-[11px] sm:text-xs font-normal text-[#666680] transition-colors hover:bg-[#e8ebff]">
      {label}
    </span>
  );
}

export interface RequestCardProps {
  request: FeaturedRequest;
  onAction?: (request: FeaturedRequest) => void;
}

export function RequestCard({ request, onAction }: RequestCardProps) {
  const {
    category,
    daysLeft,
    title,
    description,
    tags,
    postedBy,
    amount,
    ideas,
  } = request;

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-[#eaeaf0] bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#3281ff]/40 hover:shadow-lg">
      <div className="flex flex-col">
        {/* Pills row */}
        <div className="flex items-center justify-between gap-2 pb-3">
          <Pill label={category} />
          <TimePill label={daysLeft} />
        </div>

        {/* Title */}
        <h3 className="font-urbanist text-base sm:text-lg font-semibold leading-snug text-[#0f0f1a] transition-colors group-hover:text-[#3281ff] line-clamp-2 min-h-[44px]">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 font-urbanist text-xs sm:text-[13px] leading-relaxed text-[#888898] line-clamp-3 min-h-[58px]">
          {description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5 min-h-[28px]">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>

      <div className="mt-4">
        {/* Posted by / Amount row */}
        <div className="flex items-center justify-between border-t border-[#eaeaf0] py-3 text-xs">
          <div className="flex flex-col items-start">
            <span className="font-urbanist text-[11px] text-[#aaaabc]">
              Posted by
            </span>
            <span className="font-urbanist font-semibold text-[#333348] truncate max-w-[130px] sm:max-w-[150px]">
              {postedBy}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-urbanist text-base sm:text-lg font-semibold text-[#3281ff] leading-tight">
              {amount}
            </span>
            <span className="font-urbanist text-[11px] text-[#aaaabc]">
              {ideas} ideas
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="border-t border-[#eaeaf0] pt-3">
          <button
            type="button"
            onClick={() => onAction?.(request)}
            className="flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#3281ff] px-4 py-2.5 font-urbanist text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#256ee6] hover:shadow-sm active:scale-[0.99] cursor-pointer"
          >
            <span>View brief & Submit</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function FeaturedRequests({
  eyebrow = 'Current opportunities',
  title = 'Choose what sparks you.',
  viewAllText = 'View all 6 →',
  onViewAll,
  onRequestClick,
  requests = DEFAULT_REQUESTS,
  className = '',
}: FeaturedRequestsProps) {
  return (
    <section
      id="opportunities"
      className={`scroll-mt-20 border-t border-[#eaeaf0] bg-[#f7f8ff] px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 md:py-24 ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-urbanist text-xs font-medium uppercase tracking-wider text-[#3281ff]">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-urbanist text-3xl sm:text-4xl lg:text-[44px] font-normal leading-tight text-[#0f0f1a]">
              {title}
            </h2>
          </div>

          {viewAllText && (
            <button
              type="button"
              onClick={onViewAll}
              className="group inline-flex items-center gap-1 self-start sm:self-end font-urbanist text-sm font-semibold text-[#3281ff] transition-colors hover:text-[#256ee6] cursor-pointer"
            >
              <span>{viewAllText}</span>
            </button>
          )}
        </div>

        {/* Requests Cards Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {requests.map((request) => (
            <RequestCard
              key={request.id || request.title}
              request={request}
              onAction={onRequestClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedRequests;
