import { Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Flame,
  TrendingUp,
  Users,
} from 'lucide-react';

import Hero from '@/features/landing/hero-section';
import FeaturedRequests from '@/features/landing/featured-requests';
import ProcessSection from '@/features/landing/process-section';
import HomeNav, { SparkoryLogoMark } from '@/components/layout/home-nav';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

const STATS = [
  { value: '$24,000+', label: 'Rewarded to creators', icon: Award },
  { value: '4,800+', label: 'Ideas submitted', icon: Users },
  { value: '78%', label: 'Approval rate', icon: CheckCircle2 },
  { value: '24h', label: 'Average review turnaround', icon: TrendingUp },
];

const WINNERS = [
  {
    title: 'Small rituals, lasting change',
    category: 'Food systems',
    contributor: 'Amina Rahman',
    reward: '$180',
    desc: 'A framework for zero-waste preparation that saved 4 local kitchens over $1,200/month.',
  },
  {
    title: 'Shared seats, quieter streets',
    category: 'Urban life',
    contributor: 'Jonas Lee',
    reward: '$240',
    desc: 'A peer commute routing model optimizing micro-mobility stations around suburban transit stops.',
  },
  {
    title: 'Curiosity on the corner',
    category: 'Future skills',
    contributor: 'Sara Idris',
    reward: '$320',
    desc: 'Interactive physical prompt stations turning mundane bus wait times into science explorations.',
  },
];

const LEADERBOARD_PREVIEW = [
  {
    rank: '1',
    initials: 'AR',
    name: 'Amina Rahman',
    ideas: '9 ideas approved',
    pts: '2,840',
  },
  {
    rank: '2',
    initials: 'JL',
    name: 'Jonas Lee',
    ideas: '8 ideas approved',
    pts: '2,620',
  },
  {
    rank: '3',
    initials: 'SI',
    name: 'Sara Idris',
    ideas: '7 ideas approved',
    pts: '2,410',
  },
];

export function LandingOverview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#12172b] font-urbanist selection:bg-[#3281ff]/15 selection:text-[#3281ff]">
      {/* Responsive Navbar */}
      <HomeNav />

      {/* Hero Section */}
      <Hero onCtaClick={() => navigate({ to: CREATOR_ROUTES.login })} />

      {/* Stats Section */}
      <section className="border-y border-[#eaeaf0] bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center sm:items-start sm:text-left"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#3281ff]/8 text-[#3281ff]">
                    <Icon className="size-5" />
                  </div>
                  <div className="mt-3 text-2xl font-bold tracking-tight text-[#12172b] sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-[#666680] sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <FeaturedRequests
        onViewAll={() => navigate({ to: CREATOR_ROUTES.login })}
        onRequestClick={() => navigate({ to: CREATOR_ROUTES.login })}
      />

      {/* How it works Section */}
      <ProcessSection />

      {/* Proof / Winners Section */}
      <section id="winners" className="scroll-mt-20 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#3281ff]">
                Proof, not promises
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#12172b] sm:text-4xl">
                Ideas that earned their reward.
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#666680] sm:text-base">
              A glimpse of approved contributions and what creators took home
              once published.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {WINNERS.map((winner) => (
              <div
                key={winner.title}
                className="rounded-2xl border border-[#eaeaf0] bg-white p-6 shadow-xs transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="size-3" /> Published
                  </span>
                  <span className="font-bold text-[#3281ff]">
                    {winner.reward}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#12172b]">
                  {winner.title}
                </h3>

                <p className="mt-2 text-sm text-[#666680] line-clamp-3">
                  {winner.desc}
                </p>

                <div className="mt-5 border-t border-[#f0f0f5] pt-3 text-xs text-[#8c8ca1]">
                  <span>By {winner.contributor}</span> ·{' '}
                  <span>{winner.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Leaderboard Pulse Section */}
      <section id="leaderboard" className="scroll-mt-20 py-16 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="relative overflow-hidden rounded-3xl bg-[#12231f] p-8 text-white md:p-12 lg:p-14">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c9f36d]">
                  <Flame className="size-4" />
                  <span>Community pulse</span>
                </div>

                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  Good ideas create momentum.
                </h2>

                <p className="mt-4 text-sm text-neutral-300 sm:text-base leading-relaxed">
                  Celebrate creators who consistently bring clarity,
                  originality, and positive impact to every brief.
                </p>

                <div className="mt-8">
                  <Link
                    to={CREATOR_ROUTES.login}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[#c9f36d] px-6 py-3.5 text-sm font-bold text-[#12231f] transition-all hover:bg-[#b5e05a] active:scale-98"
                  >
                    <span>Join the community</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              {/* Leaderboard Table Preview */}
              <div className="lg:col-span-6">
                <div className="space-y-3">
                  {LEADERBOARD_PREVIEW.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur-xs transition-all hover:bg-white/15"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center font-bold text-[#c9f36d]">
                          #{user.rank}
                        </span>
                        <div className="flex size-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                          {user.initials}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">
                            {user.name}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {user.ideas}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-[#c9f36d]">
                        {user.pts} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eaeaf0] bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center gap-2.5">
            <SparkoryLogoMark />
            <span className="font-urbanist text-xl font-bold text-[#12172b]">
              sparkory
            </span>
          </div>

          <p className="text-xs text-[#8c8ca1]">
            Original thinking. Fair recognition. &copy; 2026 Sparkory. All
            rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-[#666680]">
            <a href="#opportunities" className="hover:text-[#12172b]">
              Opportunities
            </a>
            <a href="#how" className="hover:text-[#12172b]">
              How it works
            </a>
            <Link to={CREATOR_ROUTES.login} className="hover:text-[#12172b]">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingOverview;
