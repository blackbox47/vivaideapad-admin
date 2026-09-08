import { Link } from '@tanstack/react-router';
import { ChevronRight, Menu } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

export interface HomeNavItem {
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface HomeNavProps {
  className?: string;
  activeItem?: string;
  onActiveItemChange?: (label: string) => void;
  navItems?: HomeNavItem[];
  signInUrl?: string;
  joinFreeUrl?: string;
  onSignInClick?: () => void;
  onJoinFreeClick?: () => void;
  actionsRightSlot?: ReactNode;
}

/**
 * Rotated Sparkory gradient logo mark.
 */
export function SparkoryLogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex size-[37px] shrink-0 items-center justify-center',
        className,
      )}
    >
      <div className="-rotate-12 flex-none">
        <div
          className="flex size-[31px] flex-col items-center justify-center rounded-tl-[15.5px] rounded-tr-[15.5px] rounded-br-[15.5px] rounded-bl-[3.72px] shadow-xs"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgb(50, 129, 255) 0%, rgb(54, 164, 255) 100%)',
          }}
        >
          <div className="size-[8px] rounded-[4px] bg-white shadow-xs" />
        </div>
      </div>
    </div>
  );
}

/**
 * Brand link with logo mark and styled text wordmark.
 */
function BrandLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="group flex items-center gap-[7px] outline-none select-none focus-visible:ring-2 focus-visible:ring-[#3281ff] focus-visible:rounded-lg"
      aria-label="Sparkory Home"
    >
      <SparkoryLogoMark className="transition-transform duration-200 group-hover:scale-105" />
      <span className="font-urbanist text-[22px] font-semibold tracking-tight text-[#12172b] transition-colors group-hover:text-[#3281ff]">
        sparkory
      </span>
    </Link>
  );
}

const DEFAULT_NAV_ITEMS: HomeNavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Opportunities', href: '/opportunities' },
  { label: 'How it works', href: '/#how' },
  { label: 'Winners', href: '/#winners' },
  { label: 'Leaderboard', href: '/leaderboard' },
];

export function HomeNav({
  className,
  activeItem = 'Home',
  onActiveItemChange,
  navItems = DEFAULT_NAV_ITEMS,
  signInUrl = CREATOR_ROUTES.login,
  joinFreeUrl = CREATOR_ROUTES.login,
  onSignInClick,
  onJoinFreeClick,
  actionsRightSlot,
}: HomeNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleItemClick = (item: HomeNavItem) => {
    onActiveItemChange?.(item.label);
    item.onClick?.();
    setMobileOpen(false);
  };

  const handleSignIn = () => {
    onSignInClick?.();
    setMobileOpen(false);
  };

  const handleJoinFree = () => {
    onJoinFreeClick?.();
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-[#eaeaf0] bg-[rgba(255,255,255,0.97)] backdrop-blur-md transition-all',
        className,
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Brand Logo */}
        <BrandLink />

        {/* Desktop Navigation Links (>= 1024px) */}
        <nav
          className="hidden items-center gap-[2px] lg:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive = activeItem === item.label || item.active;

            if (item.href?.startsWith('#') || item.href?.startsWith('/#')) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'cursor-pointer px-4 py-2 font-urbanist text-[14px] font-medium transition-all select-none',
                    isActive ?
                      'rounded-[6px] bg-[rgba(50,129,255,0.08)] text-[#3281ff]'
                    : 'rounded-[8px] text-[#666680] hover:bg-neutral-100/60 hover:text-[#12172b]',
                  )}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href || '/'}
                onClick={() => handleItemClick(item)}
                className={cn(
                  'cursor-pointer px-4 py-2 font-urbanist text-[14px] font-medium transition-all select-none',
                  isActive ?
                    'rounded-[6px] bg-[rgba(50,129,255,0.08)] text-[#3281ff]'
                  : 'rounded-[8px] text-[#666680] hover:bg-neutral-100/60 hover:text-[#12172b]',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Actions (>= 1024px) */}
        <div className="hidden items-center gap-2 lg:flex">
          {actionsRightSlot}

          {onSignInClick ?
            <button
              type="button"
              onClick={handleSignIn}
              className="cursor-pointer rounded-[6px] border border-[#eaeaf0] bg-white px-4 py-[6px] font-urbanist text-[14px] font-medium text-[#666680] shadow-2xs transition-colors hover:bg-neutral-50 hover:text-[#12172b] focus-visible:ring-2 focus-visible:ring-[#3281ff] focus-visible:outline-none"
            >
              Sign In
            </button>
          : <Link
              to={signInUrl}
              className="cursor-pointer rounded-[6px] border border-[#eaeaf0] bg-white px-4 py-[6px] font-urbanist text-[14px] font-medium text-[#666680] shadow-2xs transition-colors hover:bg-neutral-50 hover:text-[#12172b] focus-visible:ring-2 focus-visible:ring-[#3281ff] focus-visible:outline-none"
            >
              Sign In
            </Link>
          }

          {onJoinFreeClick ?
            <button
              type="button"
              onClick={handleJoinFree}
              className="cursor-pointer rounded-[6px] bg-[#3281ff] px-4 py-[6px] font-urbanist text-[14px] font-semibold text-white shadow-2xs transition-all hover:bg-[#256ee6] active:scale-98 focus-visible:ring-2 focus-visible:ring-[#3281ff] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Join Free
            </button>
          : <Link
              to={joinFreeUrl}
              className="cursor-pointer rounded-[6px] bg-[#3281ff] px-4 py-[6px] font-urbanist text-[14px] font-semibold text-white shadow-2xs transition-all hover:bg-[#256ee6] active:scale-98 focus-visible:ring-2 focus-visible:ring-[#3281ff] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Join Free
            </Link>
          }
        </div>

        {/* Mobile & Tablet Right Controls (< 1024px) */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Quick "Join Free" CTA on small-to-medium screens */}
          <div className="hidden xs:block sm:block">
            {onJoinFreeClick ?
              <button
                type="button"
                onClick={handleJoinFree}
                className="cursor-pointer rounded-[6px] bg-[#3281ff] px-3 py-1.5 font-urbanist text-[13px] font-semibold text-white transition-all hover:bg-[#256ee6] active:scale-98"
              >
                Join Free
              </button>
            : <Link
                to={joinFreeUrl}
                className="cursor-pointer rounded-[6px] bg-[#3281ff] px-3 py-1.5 font-urbanist text-[13px] font-semibold text-white transition-all hover:bg-[#256ee6] active:scale-98"
              >
                Join Free
              </Link>
            }
          </div>

          {/* Hamburger Drawer Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg text-[#12172b] hover:bg-neutral-100/70"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-full max-w-[320px] flex-col justify-between p-0 sm:max-w-[360px]"
            >
              <div>
                <SheetHeader className="border-b border-[#eaeaf0] p-4.5">
                  <div className="flex items-center justify-between">
                    <BrandLink onClick={() => setMobileOpen(false)} />
                  </div>
                  <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                </SheetHeader>

                {/* Mobile Nav Links */}
                <div className="flex flex-col gap-1 p-4">
                  {navItems.map((item) => {
                    const isActive = activeItem === item.label || item.active;

                    if (
                      item.href?.startsWith('#') ||
                      item.href?.startsWith('/#')
                    ) {
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => handleItemClick(item)}
                          className={cn(
                            'group flex items-center justify-between rounded-lg px-4 py-3 font-urbanist text-[15px] font-medium transition-colors',
                            isActive ?
                              'bg-[rgba(50,129,255,0.08)] font-semibold text-[#3281ff]'
                            : 'text-[#666680] hover:bg-neutral-100/60 hover:text-[#12172b]',
                          )}
                        >
                          <span>{item.label}</span>
                          <ChevronRight
                            className={cn(
                              'size-4 transition-transform group-hover:translate-x-0.5',
                              isActive ? 'text-[#3281ff]' : 'text-[#666680]/50',
                            )}
                          />
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={item.label}
                        to={item.href || '/'}
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          'group flex items-center justify-between rounded-lg px-4 py-3 font-urbanist text-[15px] font-medium transition-colors',
                          isActive ?
                            'bg-[rgba(50,129,255,0.08)] font-semibold text-[#3281ff]'
                          : 'text-[#666680] hover:bg-neutral-100/60 hover:text-[#12172b]',
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          className={cn(
                            'size-4 transition-transform group-hover:translate-x-0.5',
                            isActive ? 'text-[#3281ff]' : 'text-[#666680]/50',
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Drawer Action Buttons */}
              <div className="border-t border-[#eaeaf0] p-4.5">
                <div className="flex flex-col gap-2.5">
                  {onSignInClick ?
                    <button
                      type="button"
                      onClick={handleSignIn}
                      className="w-full cursor-pointer rounded-[8px] border border-[#eaeaf0] bg-white py-2.5 text-center font-urbanist text-[15px] font-medium text-[#666680] transition-colors hover:bg-neutral-50 hover:text-[#12172b]"
                    >
                      Sign In
                    </button>
                  : <Link
                      to={signInUrl}
                      onClick={() => setMobileOpen(false)}
                      className="w-full cursor-pointer rounded-[8px] border border-[#eaeaf0] bg-white py-2.5 text-center font-urbanist text-[15px] font-medium text-[#666680] transition-colors hover:bg-neutral-50 hover:text-[#12172b]"
                    >
                      Sign In
                    </Link>
                  }

                  {onJoinFreeClick ?
                    <button
                      type="button"
                      onClick={handleJoinFree}
                      className="w-full cursor-pointer rounded-[8px] bg-[#3281ff] py-2.5 text-center font-urbanist text-[15px] font-semibold text-white shadow-2xs transition-all hover:bg-[#256ee6] active:scale-99"
                    >
                      Join Free
                    </button>
                  : <Link
                      to={joinFreeUrl}
                      onClick={() => setMobileOpen(false)}
                      className="w-full cursor-pointer rounded-[8px] bg-[#3281ff] py-2.5 text-center font-urbanist text-[15px] font-semibold text-white shadow-2xs transition-all hover:bg-[#256ee6] active:scale-99"
                    >
                      Join Free
                    </Link>
                  }
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default HomeNav;
