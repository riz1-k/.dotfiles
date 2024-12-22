import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { z } from 'zod';
import { useLeads } from './-utils/useLeads';
import PageHeader from '@/components/global/PageHeader';
import { LeadsToggle } from './-components/LeadsToggle';
import { EmptyView } from '@/components/global/empty-view';
import { LeadItem } from './-components/LeadItem';
import { Pagination } from '@/components/global/pagination';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import StoreTabs from '../-components/StoreTabs';
import { LoaderScreen } from '@/components/global/loader-screen';

export const leadsSearchSchema = z.object({
  leadType: z.enum(['LISTING', 'STORE']).default('LISTING'),
  search: z.string().optional(),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
});
export const Route = createFileRoute('/_dashboard/dashboard/stores/$id/leads/')(
  {
    component: LeadsListPage,
    validateSearch: leadsSearchSchema,
  }
);

function LeadsListPage() {
  const leadsQuery = useLeads();
  const storeId = useParams({
    from: '/_dashboard/dashboard/stores/$id/leads/',
  }).id;

  if (leadsQuery.isLoading)
    return (
      <main className='w-full  space-y-4 '>
        <PageHeader
          breadcrumbs={[
            { label: 'Dashboard', link: { to: '/dashboard' } },
            { label: 'Stores', link: { to: '/dashboard/stores' } },
            { label: 'Leads', link: null },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='leads' />
        <LoaderScreen />
      </main>
    );

  if (!leadsQuery.data || !leadsQuery.data.leads.length)
    return (
      <main className='w-full  space-y-4 '>
        <PageHeader
          breadcrumbs={[
            { label: 'Dashboard', link: { to: '/dashboard' } },
            { label: 'Stores', link: { to: '/dashboard/stores' } },
            { label: 'Leads', link: null },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='leads' />
        <div className='flex justify-center'>
          <LeadsToggle />
        </div>
        <SearchBar storeId={storeId} />
        <EmptyView
          icon='no-files'
          title='No leads found'
          description='Your account has no leads yet'
        />
      </main>
    );

  return (
    <main className='w-full  space-y-4 '>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', link: { to: '/dashboard' } },
          { label: 'Stores', link: { to: '/dashboard/stores' } },
          { label: 'Leads', link: null },
        ]}
      />
      <StoreTabs storeId={storeId} currentTab='leads' />
      <div className='flex justify-center'>
        <LeadsToggle />
      </div>
      <SearchBar storeId={storeId} />
      <section className='space-y-4'>
        {leadsQuery.data.leads.map((lead, index) => (
          <LeadItem lead={lead} index={index} storeId={storeId} />
        ))}
      </section>
      <Pagination total={leadsQuery.data.total} />
    </main>
  );
}

const SearchBar = ({ storeId }: { storeId: string }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const search = useSearch({
    from: '/_dashboard/dashboard/stores/$id/leads/',
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({
          to: '/dashboard/stores/$id/leads',
          search: {
            search: searchTerm,
            page: 1,
            limit: 10,
            leadType: search.leadType,
          },
          params: { id: storeId },
        });
      }}
      className='relative'
    >
      <Input
        placeholder='Search Listings'
        className='pl-10'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
    </form>
  );
};
