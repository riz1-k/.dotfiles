import { redirect } from '@tanstack/react-router';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: LayoutComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.session) {
      throw redirect({
        to: '/dash',
      });
    }
  },
});

function LayoutComponent() {
  return (
    <div className='h-screen grid place-items-center '>
      <main className='max-w-2xl w-full px-4'>
        <Outlet />
      </main>
    </div>
  );
}
