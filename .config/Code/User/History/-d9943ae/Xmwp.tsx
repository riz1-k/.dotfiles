import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { leadsSearchSchema } from '.';
import { LISTING_TYPES } from '@/routes/_dashboard/dashboard/listings/-utils/product-schema';
import { z } from 'zod';
import { useSingleLead } from './-utils/useLeads';
import { LoaderScreen } from '@/components/global/loader-screen';
import { EmptyView } from '@/components/global/empty-view';
import PageHeader from '@/components/global/PageHeader';
import env from '@/lib/config/env';
import { LeadItem } from './-components/LeadItem';
import { Button } from '@/components/ui/button';
import StoreTabs from '../-components/StoreTabs';

const schema = leadsSearchSchema
  .pick({
    page: true,
    limit: true,
  })
  .extend({
    listingType: z.enum(LISTING_TYPES),
    listingId: z.string().length(24),
  });

export const Route = createFileRoute(
  '/_dashboard/dashboard/stores/$id/leads/$listingId'
)({
  component: RouteComponent,
  validateSearch: schema,
});

function RouteComponent() {
  const leadData = useSingleLead();
  const storeId = useParams({
    from: '/_dashboard/dashboard/stores/$id/leads/$listingId',
  }).id;
  const navigate = useNavigate();
  const search = useSearch({
    from: '/_dashboard/dashboard/stores/$id/leads/$listingId',
  });

  if (leadData.isLoading)
    return (
      <main className='w-full  space-y-6'>
        <PageHeader
          breadcrumbs={[
            { label: 'Dashboard', link: { to: '/dashboard' } },
            { label: 'Stores', link: { to: '/dashboard/stores' } },
            {
              label: 'Leads',
              link: { to: '/dashboard/stores/$id/leads' },
            },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='leads' />
        <LoaderScreen />
      </main>
    );

  if (!leadData.data)
    return (
      <main className='w-full  space-y-6'>
        <PageHeader
          breadcrumbs={[
            { label: 'Dashboard', link: { to: '/dashboard' } },
            { label: 'Stores', link: { to: '/dashboard/stores' } },
            {
              label: 'Leads',
              link: { to: '/dashboard/stores/$id/leads' },
            },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='leads' />
        <EmptyView
          icon='no-files'
          title='Lead Data Not Found'
          description='This lead does not exist'
        />
      </main>
    );

  return (
    <main className='w-full  space-y-6'>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', link: { to: '/dashboard' } },
          { label: 'Stores', link: { to: '/dashboard/stores' } },
          { label: 'Leads', link: { to: '/dashboard/stores/$id/leads' } },
        ]}
      />
      <StoreTabs storeId={storeId} currentTab='leads' />
      <section
        id='image-carousel'
        className='w-full overflow-x-auto snap-x snap-mandatory flex gap-4 px-4'
      >
        {leadData.data?.listing.images.map((image, index) => (
          <img
            key={index}
            src={env.CDN_URL + image.src}
            alt='listing image'
            className='w-[85%] flex-shrink-0 snap-start object-cover rounded-lg'
          />
        ))}
      </section>
      <h1 className='text-lg font-normal'>
        Listing Title:{' '}
        <span className='font-semibold'>{leadData.data?.listing.title}</span>
      </h1>
      {leadData.data.total === 0 && (
        <EmptyView
          title='No Leads found for this listing'
          icon='search'
          description=''
        />
      )}
      <div className='space-y-4'>
        {leadData.data.leads.map((lead, index) => (
          <LeadItem lead={lead} index={index} storeId={storeId} />
        ))}
      </div>
      {leadData.data.leads.length < (leadData.data.total || 0) && (
        <Button
          onClick={() => {
            navigate({
              to: '/dashboard/stores/$id/leads/$listingId',
              params: {
                id: storeId,
                listingId: search.listingId,
              },
              search: {
                ...search,
                limit: (search.limit || 20) + 20,
              },
            }).then(() => {
              leadData.refetch();
            });
          }}
          isLoading={leadData.isRefetching}
          className='w-full rounded-full mt-4'
          variant='accent'
        >
          Load More
        </Button>
      )}
    </main>
  );
}
