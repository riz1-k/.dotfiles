import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useAnalytics } from './-utils/useAnalytics';
import { LISTING_TYPES } from '../../catalog/-utils/products-listing.schema';
import { PageHeader } from '@/components/global/common-page-components';

const schema = z.object({
  listingType: z.enum(LISTING_TYPES),
});

export const Route = createFileRoute(
  '/_dashboard/dashboard/listings/analytics/$id'
)({
  component: RouteComponent,
  validateSearch: schema,
});

function RouteComponent() {
  useAnalytics();
  return (
    <main>
      <PageHeader title='Listing Analytics' />
    </main>
  );
}
