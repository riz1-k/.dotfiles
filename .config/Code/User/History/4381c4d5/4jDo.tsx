import { createFileRoute } from '@tanstack/react-router';
import { TableSkeleton } from '@/components/global/table-skeleton';
import { Pagination } from '@/components/global/pagination';
import { sellerListSearchSchema } from './-utils/constants';

import { StoreListTable } from './-components/store-list-table';
import PageHeader from '@/components/global/PageHeader';
import { useStoresList } from './-utils/useStore';

export const Route = createFileRoute('/_dashboard/dashboard/users/stores/')({
  component: RouteComponent,
  validateSearch: sellerListSearchSchema,
});

function RouteComponent() {
  const storeList = useStoresList();
  if (storeList.isLoading)
    return <TableSkeleton rows={10} columns={5} showHeader />;

  if (!storeList.data) return <div>No data</div>;

  return (
    <section className='flex flex-col gap-4'>
      <PageHeader breadcrumbs={[{ label: 'Stores', link: null }]} />
      <StoreListTable data={storeList.data.stores} />
      <Pagination total={storeList.data.total} />
    </section>
  );
}
