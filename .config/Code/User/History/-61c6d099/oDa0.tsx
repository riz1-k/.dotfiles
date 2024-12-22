import { LoaderScreen } from '@/components/global/loader-screen';
import { MainSidebar } from './_dashboard/-components/MainSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useSession } from '@/lib/hooks/useSession';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  const session = useSession();
  if (session.isLoading) {
    return <LoaderScreen />;
  }

  if (!session.data) {
    return <Navigate to='/login' />;
  }

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className='relative'>
        <main className='p-3 pt-0'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
