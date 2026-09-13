import { useMemo, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Award, CheckCircle2, TrendingUp, Users } from 'lucide-react';

import Hero, { type HeroStat } from '@/features/landing/hero-section';
import FeaturedRequests, {
  type FeaturedRequest,
} from '@/features/landing/featured-requests';
import ProcessSection from '@/features/landing/process-section';
import LeaderboardSection, {
  type LeaderboardRowData,
} from '@/features/landing/leaderboard-section';
import FaqSection from '@/features/landing/faq-section';
import CtaSection from '@/features/landing/cta-section';
import ContributorApplicationDialog from '@/features/landing/contributor-application-dialog';
import HomeNav, { IdeaPadLogoMark } from '@/components/layout/home-nav';
import { CREATOR_ROUTES } from '@/utils/constants/routes';
import { CURRENCY_SYMBOL } from '@/utils/constants';
import {
  useGetPublicFeaturedRequestsQuery,
  useGetPublicLandingStatsQuery,
  useGetPublicLeaderboardQuery,
} from '@/services/landing/landing-service';

function formatBdt(amount: number): string {
  if (amount >= 100000) {
    const lakhs = (amount / 100000).toFixed(2).replace(/\.00$/, '');
    return `${CURRENCY_SYMBOL} ${lakhs}L`;
  }
  return `${CURRENCY_SYMBOL} ${new Intl.NumberFormat('en-IN').format(amount)}`;
}

function formatUsd(amount: number): string {
  return `${CURRENCY_SYMBOL}${new Intl.NumberFormat('en-IN').format(amount)}+`;
}

const STATS = [
  { value: `${CURRENCY_SYMBOL}24,000+`, label: 'Rewarded to creators', icon: Award },
  { value: '4,800+', label: 'Ideas submitted', icon: Users },
  { value: '78%', label: 'Approval rate', icon: CheckCircle2 },
  { value: '24h', label: 'Average review turnaround', icon: TrendingUp },
];

export function LandingOverview() {
  const navigate = useNavigate();
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [selectedConceptTitle, setSelectedConceptTitle] = useState<
    string | undefined
  >();
  const [selectedConceptId, setSelectedConceptId] = useState<
    string | undefined
  >();

  const statsQuery = useGetPublicLandingStatsQuery();
  const featuredQuery = useGetPublicFeaturedRequestsQuery(3);
  const leaderboardQuery = useGetPublicLeaderboardQuery(5);

  const heroStats = useMemo<HeroStat[] | undefined>(() => {
    const stats = statsQuery.data?.data;
    if (
      !stats ||
      stats.activeRequests === undefined ||
      stats.ideasSubmitted === undefined ||
      stats.totalPrizes === undefined
    ) {
      return undefined;
    }

    return [
      { value: String(stats.activeRequests), label: 'Active Requests' },
      {
        value: new Intl.NumberFormat('en-US').format(stats.ideasSubmitted),
        label: 'Ideas Submitted',
      },
      { value: formatBdt(stats.totalPrizes), label: 'Total Prizes' },
    ];
  }, [statsQuery.data]);

  const barStats = useMemo(() => {
    const stats = statsQuery.data?.data;
    if (
      !stats ||
      stats.ideasRewardedUsd === undefined ||
      stats.ideasCount === undefined ||
      stats.approvalRatePct === undefined
    ) {
      return STATS;
    }

    return [
      {
        value: formatUsd(stats.ideasRewardedUsd),
        label: 'Rewarded to creators',
        icon: Award,
      },
      {
        value: `${new Intl.NumberFormat('en-US').format(stats.ideasCount)}+`,
        label: 'Ideas submitted',
        icon: Users,
      },
      {
        value: `${stats.approvalRatePct}%`,
        label: 'Approval rate',
        icon: CheckCircle2,
      },
      {
        value:
          stats.avgReviewTurnaroundHours != null
            ? `${stats.avgReviewTurnaroundHours}h`
            : '24h',
        label: 'Average review turnaround',
        icon: TrendingUp,
      },
    ];
  }, [statsQuery.data]);

  const requests = useMemo<FeaturedRequest[] | undefined>(() => {
    const list = featuredQuery.data?.data;
    if (!list || list.length === 0) {
      return undefined;
    }

    return list.map((item) => ({
      id: item.id,
      category: item.category,
      daysLeft: `${item.daysLeft}d left`,
      title: item.title,
      description: item.description,
      tags: item.tags,
      postedBy: item.postedBy,
      amount: `${CURRENCY_SYMBOL} ${new Intl.NumberFormat('en-IN').format(item.amount)}`,
      ideas: String(item.ideas),
    }));
  }, [featuredQuery.data]);

  const rows = useMemo<LeaderboardRowData[] | undefined>(() => {
    const list = leaderboardQuery.data?.data;
    if (!list || list.length === 0) {
      return undefined;
    }

    return list.map((item, idx) => {
      const rankNum = item.rank ?? idx + 1;
      let rankStr = `#${rankNum}`;
      if (rankNum === 1) rankStr = '🏆';
      else if (rankNum === 2) rankStr = '🥈';
      else if (rankNum === 3) rankStr = '🥉';

      return {
        rank: rankStr,
        initials: item.initials,
        name: item.name,
        stats: `${item.wins} wins · ${item.ideas} ideas`,
        amount: `${CURRENCY_SYMBOL} ${new Intl.NumberFormat('en-IN').format(item.amount)}`,
        highlighted: rankNum === 1,
      };
    });
  }, [leaderboardQuery.data]);

  const handleOpenApplication = (title?: string, id?: string) => {
    setSelectedConceptTitle(title);
    setSelectedConceptId(id);
    setIsApplicationOpen(true);
  };

  /**
   * Send the visitor to the submit-idea form with the topic preselected.
   * Unauthenticated visitors are bounced to the creator login by the
   * `_privatecreator` guard, which carries this destination in `?from=`.
   */
  const handleRequestClick = (request: FeaturedRequest) => {
    void navigate({
      to: request.id
        ? `${CREATOR_ROUTES.submitIdea}?topic=${encodeURIComponent(request.id)}`
        : CREATOR_ROUTES.submitIdea,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-urbanist selection:bg-primary/15 selection:text-primary">
      {/* Responsive Navbar */}
      <HomeNav onJoinFreeClick={() => handleOpenApplication()} />

      {/* Hero Section */}
      <Hero onCtaClick={() => handleOpenApplication()} stats={heroStats} />

      {/* Stats Section */}
      <section className="border-y border-[#eaeaf0] bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {barStats.map((stat) => {
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
        onViewAll={() => handleOpenApplication()}
        onRequestClick={handleRequestClick}
        requests={requests}
      />

      {/* How it works Section */}
      <ProcessSection />

      {/* Leaderboard Section */}
      <LeaderboardSection
        onCtaClick={() => navigate({ to: CREATOR_ROUTES.leaderboard })}
        rows={rows}
      />

      {/* FAQ Section */}
      <FaqSection
        onContactClick={() => {
          window.location.href = 'mailto:support@vivaideapad.com';
        }}
      />

      {/* Final Call to Action Section */}
      <CtaSection
        onPrimaryClick={() => navigate({ to: CREATOR_ROUTES.login })}
        onSecondaryClick={() => handleOpenApplication()}
      />

      {/* Footer */}
      <footer className="border-t border-[#eaeaf0] bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center gap-2.5">
            <IdeaPadLogoMark />
            <span className="font-urbanist text-xl font-bold text-foreground">
              Viva IdeaPad
            </span>
          </div>

          <p className="text-xs text-text-subtle">
            Original thinking. Fair recognition. &copy; 2026 Viva IdeaPad. All
            rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-[#666680]">
            <a href="#opportunities" className="hover:text-[#12172b]">
              Opportunities
            </a>
            <a href="#how" className="hover:text-[#12172b]">
              How it works
            </a>
            <a href="#leaderboard" className="hover:text-[#12172b]">
              Leaderboard
            </a>
            <a href="#faq" className="hover:text-[#12172b]">
              FAQ
            </a>
            <Link to={CREATOR_ROUTES.login} className="hover:text-[#12172b]">
              Sign in
            </Link>
          </div>
        </div>
      </footer>

      {/* Contributor Application Modal Dialog */}
      <ContributorApplicationDialog
        isOpen={isApplicationOpen}
        onClose={() => setIsApplicationOpen(false)}
        preselectedConceptTitle={selectedConceptTitle}
        preselectedConceptId={selectedConceptId}
      />
    </div>
  );
}

export default LandingOverview;
