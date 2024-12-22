import { useSession } from '@/lib/hooks/useSession';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  const session = useSession();

  if (session.isLoading) {
    return <div>Loading...</div>;
  }

  if (session.data) {
    <Navigate to='/dashboard' />;
  }

  return (
    <main className='min-h-[100dvh] w-full flex flex-col'>
      <div className='flex w-full bg-[url("/images/common/login.png")] h-[25vh] bg-cover  bg-no-repeat p-3'>
        <img
          src='/images/common/white-nav-logo.png'
          className='h-10 object-cover'
        />
      </div>
      <div className='h-full grow -mt-8'>
        <Outlet />
      </div>
    </main>
  );
}
