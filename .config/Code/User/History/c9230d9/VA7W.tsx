import { createFileRoute, useParams } from '@tanstack/react-router';
import {
  requestCallbackSearchSchema,
  useRequestCallbacks,
} from './-utils/useRequestCallbacks';
import { LoaderScreen } from '@/components/global/loader-screen';
import StoreTabs from '../-components/StoreTabs';
import PageHeader from '@/components/global/PageHeader';
import { EmptyView } from '@/components/global/empty-view';
import { Pagination } from '@/components/global/pagination';
import { RequestCallbackTable } from './-components/requests-table';

export const Route = createFileRoute(
  '/_dashboard/dashboard/stores/$id/request-callbacks'
)({
  component: RouteComponent,
  validateSearch: requestCallbackSearchSchema,
});

function RouteComponent() {
  const requestCallbacks = useRequestCallbacks();
  const storeId = useParams({
    from: '/_dashboard/dashboard/stores/$id/request-callbacks',
  }).id;
  if (requestCallbacks.isLoading)
    return (
      <main className='w-full  space-y-4 '>
        <PageHeader
          breadcrumbs={[
            { label: 'Stores', link: { to: '/dashboard/stores' } },
            { label: 'Request Callbacks', link: null },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='request-callbacks' />
        <LoaderScreen />
      </main>
    );

  if (!requestCallbacks.data)
    return (
      <main className='w-full  space-y-4 '>
        <PageHeader
          breadcrumbs={[
            { label: 'Stores', link: { to: '/dashboard/stores' } },
            { label: 'Request Callbacks', link: null },
          ]}
        />
        <StoreTabs storeId={storeId} currentTab='request-callbacks' />
        <EmptyView
          icon='no-files'
          title='No request callbacks found'
          description='Your account has no request callbacks yet'
        />
      </main>
    );
  return (
    <main className='w-full  space-y-4 '>
      <PageHeader
        breadcrumbs={[
          { label: 'Stores', link: { to: '/dashboard/stores' } },
          { label: 'Request Callbacks', link: null },
        ]}
      />
      <StoreTabs storeId={storeId} currentTab='request-callbacks' />
      <RequestCallbackTable data={requestCallbacks.data.data} />
      <Pagination total={requestCallbacks.data.total} />
    </main>
  );
}
