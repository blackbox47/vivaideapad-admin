import { Outlet } from 'react-router-dom';

import CreatorHeader from '@/components/layout/creator-header';
import CreatorSidebar from '@/components/layout/creator-sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function CreatorLayout() {
  return (
    <TooltipProvider>
      <div className="flex min-h-svh bg-[#f5f7f5] text-foreground">
        <div className="sticky top-0 hidden h-svh md:block">
          <CreatorSidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col px-3 pb-[90px] md:px-[34px] md:pb-[45px]">
          <CreatorHeader />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}