import { PageHeader } from '@/components/global/common-page-components';
import { createFileRoute } from '@tanstack/react-router';
import { ListTree } from 'lucide-react';

export const Route = createFileRoute('/_dashboard/dashboard/leads')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className='w-full px-4 py-6 space-y-6'>
      <PageHeader title='Listings' icon={<ListTree className='h-6 w-6' />} />
    </main>
  );
}
