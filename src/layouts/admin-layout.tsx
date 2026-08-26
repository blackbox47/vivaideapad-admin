import { Outlet } from 'react-router-dom';

import AdminHeader from '@/components/layout/admin-header';
import AdminSidebar from '@/components/layout/admin-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function AdminLayout() {
  return (
    <TooltipProvider>
      <div className="flex min-h-svh bg-background text-foreground">
        <div className="sticky top-0 hidden h-svh md:block">
          <AdminSidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col px-3 pb-[90px] md:px-[34px] md:pb-[45px]">
          <AdminHeader />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
