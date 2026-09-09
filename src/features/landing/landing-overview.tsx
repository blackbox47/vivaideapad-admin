import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Award, CheckCircle2, TrendingUp, Users } from 'lucide-react';

import Hero from '@/features/landing/hero-section';
import FeaturedRequests from '@/features/landing/featured-requests';
import ProcessSection from '@/features/landing/process-section';
import LeaderboardSection from '@/features/landing/leaderboard-section';
import FaqSection from '@/features/landing/faq-section';
import CtaSection from '@/features/landing/cta-section';
import ContributorApplicationDialog from '@/features/landing/contributor-application-dialog';
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

export function LandingOverview() {
  const navigate = useNavigate();
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [selectedConceptTitle, setSelectedConceptTitle] = useState<
    string | undefined
  >();
  const [selectedConceptId, setSelectedConceptId] = useState<
    string | undefined
  >();

  const handleOpenApplication = (title?: string, id?: string) => {
    setSelectedConceptTitle(title);
    setSelectedConceptId(id);
    setIsApplicationOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#12172b] font-urbanist selection:bg-[#3281ff]/15 selection:text-[#3281ff]">
      {/* Responsive Navbar */}
      <HomeNav onJoinFreeClick={() => handleOpenApplication()} />

      {/* Hero Section */}
      <Hero onCtaClick={() => handleOpenApplication()} />

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
        onViewAll={() => handleOpenApplication()}
        onRequestClick={(req) => handleOpenApplication(req.title, req.id)}
      />

      {/* How it works Section */}
      <ProcessSection />

      {/* Leaderboard Section */}
      <LeaderboardSection
        onCtaClick={() => navigate({ to: CREATOR_ROUTES.leaderboard })}
      />

      {/* FAQ Section */}
      <FaqSection
        onContactClick={() => {
          window.location.href = 'mailto:support@sparkory.com';
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
