import { PageHeader } from '@/components/global/common-page-components';
import { ListingToggle } from '@/components/global/ListingToggle';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { ListTree } from 'lucide-react';
import { z } from 'zod';

const searchSchema = z.object({
  listType: z.enum(['product', 'service']).catch('product'),
});

export const Route = createFileRoute('/_dashboard/dashboard/leads')({
  component: RouteComponent,
  validateSearch: searchSchema,
});

function RouteComponent() {
  const search = useSearch({ from: '/_dashboard/dashboard/leads' });
  const navigate = useNavigate();
  return (
    <main className='w-full px-4 py-6 space-y-6'>
      <PageHeader
        title='Captured Leads'
        icon={<ListTree className='h-6 w-6 text-accent' />}
      />
      <div className='flex justify-end'>
        <ListingToggle
          checked={search.listType === 'service'}
          onCheckedChange={(value) => {
            navigate({
              to: '/dashboard/leads',
              search: {
                ...search,
                listType: value ? 'service' : 'product',
              },
            });
          }}
        />
      </div>
    </main>
  );
}
