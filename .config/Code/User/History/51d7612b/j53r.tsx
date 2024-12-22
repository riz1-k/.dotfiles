import { createFileRoute, useSearch } from '@tanstack/react-router';
import { listingsSearchSchema } from './-utils/constants';
import { ListingTable } from './-components/listing-table';
import { useListings } from './-utils/useListings';
import { TableSkeleton } from '@/components/global/table-skeleton';
import { Pagination } from '@/components/global/pagination';

export const Route = createFileRoute('/_dashboard/dashboard/listings/')({
  component: RouteComponent,
  validateSearch: listingsSearchSchema,
});

function RouteComponent() {
  const listingQuery = useListings();
  const search = useSearch({
    from: '/_dashboard/dashboard/listings/',
  });
  if (listingQuery.isLoading)
    return <TableSkeleton rows={10} columns={5} showHeader />;
  if (!listingQuery.data) return <div>No data</div>;

  return (
    <section className='flex flex-col gap-4'>
      <ListingTable data={listingQuery.data.listings} search={search} />
      <Pagination total={listingQuery.data.total} />
    </section>
  );
}
