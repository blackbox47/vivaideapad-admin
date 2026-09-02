import { LogOut, Menu, Moon, Sun, User } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

import CreatorSidebar from '@/components/layout/creator-sidebar';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import useCreatorUser from '@/hooks/auth/use-creator-user';
import useAuth from '@/hooks/auth/use-auth';
import NotificationPopover from '@/components/notifications/notification-popover';
import useMobileNav from '@/hooks/ui/use-mobile-nav';
import useTheme from '@/hooks/ui/use-theme';
import { CREATOR_ROUTES } from '@/utils/constants/routes';

export default function CreatorHeader() {
  const { isOpen, setOpen } = useMobileNav();
  const { user } = useCreatorUser();
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="flex h-[82px] items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <Sheet open={isOpen} onOpenChange={(open) => setOpen(open)}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation"
              />
            }
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[245px] border-0 bg-sidebar p-0 sm:max-w-[245px]"
            showCloseButton={false}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <CreatorSidebar className="h-full" />
          </SheetContent>
        </Sheet>

        <p className="min-w-0 text-xs font-extrabold tracking-[0.12em] text-brand-sage uppercase">
          Creator workspace
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="size-10 rounded-full border-border bg-card text-foreground transition-colors hover:border-foreground"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="size-4.5 text-warning" />
          ) : (
            <Moon className="size-4.5 text-foreground" />
          )}
        </Button>

        <NotificationPopover role="creator" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="h-auto rounded-full border-border bg-card py-1.5 pr-3.5 pl-1.5 text-[13px] font-bold text-foreground transition-colors hover:border-foreground"
                aria-label="Account menu"
              />
            }
          >
            <Avatar className="size-7 after:border-transparent">
              <AvatarFallback className="bg-brand-lime text-[11px] font-bold text-brand-lime-foreground">
                {user?.initials ?? '—'}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{user?.name ?? 'Contributor'}</span>
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