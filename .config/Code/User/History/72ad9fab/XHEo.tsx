import { LoaderScreen } from '@/components/global/loader-screen';
import { useSession } from '@/lib/hooks/useSession';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: LayoutComponent,
});

function LayoutComponent() {
  const session = useSession();

  if (session.isLoading) {
    return <LoaderScreen />;
  }

  if (session.data) {
    <Navigate to='/dashboard' />;
  }

  return (
    <div className='h-screen grid place-items-center '>
      <main className='max-w-2xl w-full px-4'>
        <Outlet />
      </main>
    </div>
  );
}
