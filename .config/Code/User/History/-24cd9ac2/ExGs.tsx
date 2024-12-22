import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useAnalytics } from './-utils/useAnalytics';
import { LISTING_TYPES } from '../../catalog/-utils/products-listing.schema';
import { PageHeader } from '@/components/global/common-page-components';
import ListingExploredCard from './-components/cards/ListingExplored';
import ListingInteractions from './-components/cards/ListingInteractions';
import ListingFeedbackAnalytics from './-components/cards/ListingFeedback';
import SubscriptionSelector from './-components/cards/SubscriptionSelector';
import { formatDate } from 'date-fns';
const schema = z.object({
  listingType: z.enum(LISTING_TYPES),
  subscriptionId: z.string().length(24).optional(),
});

export const Route = createFileRoute(
  '/_dashboard/dashboard/listings/analytics/$id'
)({
  component: RouteComponent,
  validateSearch: schema,
});

function RouteComponent() {
  const analyticsQuery = useAnalytics();

  if (analyticsQuery.isLoading) {
    return <div>Loading</div>;
  }

  if (analyticsQuery.isError || !analyticsQuery.data) {
    return <div>Error</div>;
  }

  return (
    <main className='w-full px-4 py-6 space-y-6'>
      <PageHeader title='Listing Analytics' />
      <SubscriptionSelector />
      <div className='space-y-3'>
        <h2 className='text-lg font-medium'>
          {analyticsQuery.data.listing.title}
        </h2>
        <span className='text-sm text-muted-foreground'>
          Listed on:{' '}
          {formatDate(
            new Date(analyticsQuery.data.listing.createdAt),
            'dd/MM/yyyy'
          )}
        </span>
      </div>
      <div className='space-y-8'>
        <ListingExploredCard data={analyticsQuery.data} />
        <ListingInteractions data={analyticsQuery.data} />
        <ListingFeedbackAnalytics data={analyticsQuery.data} />
      </div>
    </main>
  );
}
