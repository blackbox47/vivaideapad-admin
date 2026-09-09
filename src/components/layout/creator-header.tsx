import { LogOut, Moon, Sun, User } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useCreatorUser from '@/hooks/auth/use-creator-user';
import useAuth from '@/hooks/auth/use-auth';
import NotificationPopover from '@/components/notifications/notification-popover';
import useTheme from '@/hooks/ui/use-theme';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

export default function CreatorHeader() {
  const { user } = useCreatorUser();
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="flex h-16 sm:h-[76px] md:h-[82px] items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        {/* Mobile: Logo & brand name matching Stitch mobile design */}
        <Link
          to={CREATOR_ROUTES.dashboard}
          className="flex items-center gap-1.5 focus:outline-none no-underline md:hidden"
          aria-label="Ideapad home"
        >
          <span
            className="flex size-6 items-center justify-center rounded-full bg-brand-lime shadow-xs"
            aria-hidden
          >
            <span className="size-2 rounded-full bg-brand-pine-deep" />
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground lowercase">
            ideapad
          </span>
        </Link>

        {/* Desktop: Workspace eyebrow */}
        <p className="hidden min-w-0 text-xs font-extrabold tracking-[0.12em] text-brand-sage uppercase md:block">
          Creator workspace
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="size-9 rounded-full border-border bg-card text-foreground transition-all hover:border-foreground active:scale-95"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="size-4 text-warning" />
          ) : (
            <Moon className="size-4 text-foreground" />
          )}
        </Button>

        <NotificationPopover role="creator" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="flex h-9 items-center gap-1.5 rounded-full border-border bg-card py-1 pr-2.5 pl-1 text-xs font-medium text-foreground transition-colors hover:border-foreground cursor-pointer"
                aria-label="Account menu"
              />
            }
          >
            <Avatar className="size-6.5 after:border-transparent">
              <AvatarFallback className="bg-brand-lime text-[10px] font-bold text-brand-pine-deep tracking-tight">
                {user?.initials ?? '—'}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-xs font-medium text-foreground sm:inline">
              {user?.name ?? 'Contributor'}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{user?.email ?? 'Signed in'}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate({ to: CREATOR_ROUTES.profile })}
            >
              <User className="size-4" />
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              {isDarkMode ? (
                <>
                  <Sun className="size-4" />
                  Light mode
                </>
              ) : (
                <>
                  <Moon className="size-4" />
                  Dark mode
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}