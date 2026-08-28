import { NavLink } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import useAdminUser from '@/hooks/auth/use-admin-user';
import useMobileNav from '@/hooks/ui/use-mobile-nav';
import { cn } from '@/lib/utils';
import { ADMIN_NAV_ITEMS } from '@/utils/constants/nav-items';
import { ADMIN_ROUTES } from '@/utils/constants/routes';
import { deriveInitials } from '@/utils/helpers/initials';
import { formatPlatformRole } from '@/utils/helpers/platform-role';

function BrandMark() {
  return (
    <span
      className="grid size-7 place-items-center bg-sidebar-primary"
      style={{
        borderRadius: '50% 50% 50% 12%',
        transform: 'rotate(-12deg)',
      }}
      aria-hidden
    >
      <i className="block size-1.5 rounded-full bg-sidebar-primary-foreground" />
    </span>
  );
}

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const { user, isLoading } = useAdminUser();
  const { close } = useMobileNav();

  return (
    <aside
      className={cn(
        'flex h-full w-[245px] shrink-0 flex-col bg-sidebar px-[18px] py-[26px] text-sidebar-foreground',
        className,
      )}
    >
      <div className="mb-[35px] flex items-center gap-2.5 px-2.5">
        <BrandMark />
        <span className="font-heading text-xl font-extrabold tracking-[-0.04em] lowercase">
          ideapad
        </span>
      </div>

      <p className="px-3 pt-[15px] pb-[7px] text-[10px] tracking-[0.14em] text-sidebar-muted uppercase">
        Platform admin
      </p>

      <ScrollArea className="min-h-0 flex-1">
        <nav className="flex flex-col pr-1" aria-label="Admin">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === ADMIN_ROUTES.dashboard}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    'my-0.5 flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold no-underline transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'bg-transparent text-sidebar-nav-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )
                }
              >
                <Icon className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="mt-auto flex items-center gap-2.5 border-t border-sidebar-border px-2 pt-[18px]">
        {isLoading || !user ? (
          <>
            <Skeleton className="size-9 rounded-full bg-sidebar-foreground/10" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3.5 w-24 bg-sidebar-foreground/10" />
              <Skeleton className="h-3 w-20 bg-sidebar-foreground/10" />
            </div>
          </>
        ) : (
          <>
            <Avatar className="size-9 after:border-transparent">
              <AvatarFallback className="bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
                {deriveInitials(user.display_name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-sidebar-foreground">
                {user.display_name ?? user.email}
              </p>
              <p className="truncate text-[11px] text-sidebar-muted">{formatPlatformRole(user.role)}</p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
