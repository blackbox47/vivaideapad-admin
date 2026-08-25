import { LogOut, Menu, User } from 'lucide-react';

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
import useMobileNav from '@/hooks/ui/use-mobile-nav';

export default function CreatorHeader() {
  const { isOpen, setOpen } = useMobileNav();
  const { user } = useCreatorUser();
  const { logout } = useAuth();

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

        <p className="min-w-0 text-xs font-extrabold tracking-[0.12em] text-[#527065] uppercase">
          Creator workspace
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="size-10 rounded-full border-[#dfe7e3] bg-white text-foreground"
          aria-label="Notifications"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#12231f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="h-auto rounded-full border-[#dfe7e3] bg-white py-1.5 pr-3.5 pl-1.5 text-[13px] font-bold text-foreground hover:border-[#12231f]"
                aria-label="Account menu"
              />
            }
          >
            <Avatar className="size-7 after:border-transparent">
              <AvatarFallback className="bg-[#c9f36d] text-[11px] font-bold text-[#12231f]">
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
            <DropdownMenuItem disabled>
              <User />
              View profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}