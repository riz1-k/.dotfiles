import PageHeader from '@/components/global/PageHeader';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { z } from 'zod';
import StoreTabs from '../-components/StoreTabs';
import { BusinessSubscriptionList } from './-components/business-subscriptionlist-table';
import { SealSubscriptionList } from './-components/seal-subscriptionlist-table';

export const Route = createFileRoute(
  '/_dashboard/dashboard/stores/$id/subscriptions'
)({
  component: SubscriptionList,
  validateSearch: z.object({
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
    subscriptionType: z.enum(['business', 'seal']).default('business'),
  }),
});

function SubscriptionList() {
  const search = useSearch({
    from: '/_dashboard/dashboard//stores/$id/subscriptions',
  });
  const storeId = useParams({
    from: '/_dashboard/dashboard//stores/$id/subscriptions',
  }).id;
  const navigate = useNavigate();
  return (
    <section className='space-y-5'>
      <PageHeader
        breadcrumbs={[
          { label: 'Stores', link: { to: '/dashboard//stores' } },
          { label: 'Subscriptions', link: null },
        ]}
      />
      <StoreTabs storeId={storeId} currentTab='subscriptions' />
      <Tabs
        value={search.subscriptionType}
        onValueChange={(value) => {
          navigate({
            to: '/dashboard//stores/$id/subscriptions',
            search: {
              ...search,
              subscriptionType: value as typeof search.subscriptionType,
            },
            params: { id: storeId },
          });
        }}
      >
        <TabsList>
          <TabsTrigger value='business'>Business Subscriptions</TabsTrigger>
          <TabsTrigger value='seal'>Seal Subscriptions</TabsTrigger>
        </TabsList>
      </Tabs>
      {search.subscriptionType === 'business' ? (
        <BusinessSubscriptionList />
      ) : (
        <SealSubscriptionList />
      )}
    </section>
  );
}
