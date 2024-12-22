import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { z } from 'zod';
import { useAnalytics } from './-utils/useAnalytics';
import { LISTING_TYPES } from '../../catalog/-utils/products-listing.schema';
import { PageHeader } from '@/components/global/common-page-components';
import { ListingToggle } from '@/components/global/ListingToggle';

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
  const params = useParams({
    from: '/_dashboard/dashboard/listings/analytics/$id',
  });
  const search = useSearch({
    from: '/_dashboard/dashboard/listings/analytics/$id',
  });
  const navigate = useNavigate();
  return (
    <main className='w-full px-4 py-6 space-y-6'>
      <PageHeader title='Listing Analytics' />
      <ListingToggle
        checked={search.listingType === 'BServiceListing'}
        onCheckedChange={(value) => {
          navigate({
            to: '/dashboard/listings/analytics/$id',
            params: { id: params.id },
            search: {
              ...search,
              listingType: value ? 'BServiceListing' : 'BProductListing',
            },
          });
        }}
      />
    </main>
  );
}
