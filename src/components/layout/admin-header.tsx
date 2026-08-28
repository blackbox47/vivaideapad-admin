import { LogOut, Menu, Moon, Sun, User } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

import AdminSidebar from '@/components/layout/admin-sidebar';
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
import useAdminUser from '@/hooks/auth/use-admin-user';
import useAuth from '@/hooks/auth/use-auth';
import useAdminNotifications from '@/hooks/notifications/use-admin-notifications';
import useMobileNav from '@/hooks/ui/use-mobile-nav';
import useTheme from '@/hooks/ui/use-theme';
import { ADMIN_ROUTES } from '@/utils/constants/routes';
import { deriveInitials } from '@/utils/helpers/initials';

export default function AdminHeader() {
  const { isOpen, setOpen } = useMobileNav();
  const { user } = useAdminUser();
  const { unreadCount } = useAdminNotifications();
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
            <AdminSidebar className="h-full" />
          </SheetContent>
        </Sheet>

        <p className="min-w-0 text-xs font-extrabold tracking-[0.12em] text-brand-sage uppercase">
          Administration
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

        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate({ to: ADMIN_ROUTES.notifications })}
          className="relative size-10 rounded-full border-border bg-card text-foreground transition-colors hover:border-foreground"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : 'Notifications'
          }
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 ? (
            <span
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-brand-lime"
              aria-hidden
            />
          ) : null}
        </Button>

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
                {user ? deriveInitials(user.display_name, user.email) : '—'}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{user?.display_name ?? 'Admin'}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{user?.email ?? 'Signed in'}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate({ to: ADMIN_ROUTES.profile })}
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
