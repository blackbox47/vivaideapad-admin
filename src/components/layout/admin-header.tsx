import { LogOut, Menu, User } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

import AdminSidebar from '@/components/layout/admin-sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import NotificationPopover from '@/components/notifications/notification-popover';
import useMobileNav from '@/hooks/ui/use-mobile-nav';
import { ADMIN_ROUTES } from '@/utils/constants/routes';
import { deriveInitials } from '@/utils/helpers/initials';
import { resolveAvatarUrl } from '@/utils/helpers/resolve-avatar-url';

export default function AdminHeader() {
  const { isOpen, setOpen } = useMobileNav();
  const { user } = useAdminUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const resolvedAvatarUrl = resolveAvatarUrl(user?.avatar_url);

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
      </div>

      <div className="flex items-center gap-3">
        <NotificationPopover role="admin" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="h-auto gap-2 rounded-full border-border bg-card py-1.5 pr-3.5 pl-1.5 text-[13px] font-bold text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                aria-label="Account menu"
              />
            }
          >
            <Avatar className="size-7 after:border-transparent">
              {resolvedAvatarUrl && (
                <AvatarImage
                  src={resolvedAvatarUrl}
                  alt={user?.display_name ?? 'Admin'}
                />
              )}
              <AvatarFallback className="bg-primary text-[11px] font-bold text-primary-foreground">
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
