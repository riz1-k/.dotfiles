import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { BottomNav } from '@/components/global/BottomNav';
import { useSession } from '@/lib/hooks/useSession';

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  const session = useSession();

  if (session.isLoading) {
    return <div>Session loading...</div>;
  }

  if (!session.data) {
    return <Navigate to='/login' />;
  }

  if (session.data.account.emailVerified === false) {
    return <Navigate to='/verify-email' />;
  }

  if (!session.currentStore || session.currentStore.kycStatus === 'PENDING') {
    return <Navigate to='/onboard' />;
  }

  return (
    <main className='max-h-[calc(100dvh-75px)] overflow-y-auto pb-5'>
      <Outlet />
      <BottomNav />
    </main>
  );
}
