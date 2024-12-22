import PageHeader from '@/components/global/PageHeader';
import { Pagination } from '@/components/global/pagination';
import { TableSkeleton } from '@/components/global/table-skeleton';
import { ListingTable } from '@/routes/_dashboard/dashboard/listings/-components/listing-table';
import { listingsSearchSchema } from '@/routes/_dashboard/dashboard/listings/-utils/constants';
import { TListProduct } from '@/routes/_dashboard/dashboard/listings/-utils/useListings';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams, useSearch } from '@tanstack/react-router';
import StoreTabs from './-components/StoreTabs';
import { StoreListingToggle } from './-components/StoreListingToggle';
import { useAxios } from '@/lib/hooks/useAxios';

export const Route = createFileRoute(
  '/_dashboard/dashboard/stores/$id/listings'
)({
  component: RouteComponent,
  validateSearch: listingsSearchSchema,
});
function RouteComponent() {
  const listingQuery = useStoreListings();
  const storeId = useParams({
    from: '/_dashboard/dashboard/stores/$id/listings',
  }).id;
  const search = useSearch({
    from: '/_dashboard/dashboard/stores/$id/listings',
  });
  if (listingQuery.isLoading)
    return (
      <section className='flex flex-col gap-4'>
        <PageHeader
          breadcrumbs={[
            { label: 'Stores', link: { to: '/dashboard/stores' } },
            { label: 'Listings', link: null },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='listings' />
        <TableSkeleton rows={10} columns={5} showHeader />;
      </section>
    );
  if (!listingQuery.data) return <div>No data</div>;
  return (
    <section className='flex flex-col gap-4'>
      <PageHeader
        breadcrumbs={[
          { label: 'Stores', link: { to: '/dashboard/stores' } },
          { label: 'Listings', link: null },
        ]}
      />
      <StoreTabs storeId={storeId} currentTab='listings' />
      <StoreListingToggle />
      <ListingTable data={listingQuery.data.listings} search={search} />
      <Pagination total={listingQuery.data.total} />
    </section>
  );
}

export function useStoreListings() {
  const searchParams = useSearch({
    from: '/_dashboard/dashboard/stores/$id/listings',
  });
  const axios = useAxios();
  const storeId = useParams({
    from: '/_dashboard/dashboard/stores/$id/listings',
  }).id;

  return useQuery({
    queryKey: ['catalog', searchParams],
    queryFn: async () => {
      const response = await axios.get<
        TResponse<{
          total: number;
          listings: TListProduct[];
        }>
      >('/listing/' + searchParams.listType, {
        params: { ...searchParams, store: storeId },
      });
      return response.data.data;
    },
  });
}
