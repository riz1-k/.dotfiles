import { createFileRoute, useSearch } from '@tanstack/react-router';
import { z } from 'zod';
import { DraftMainInfoPage } from './-components/draft-main.page';
import DraftAdditionalDetailsPage from './-components/draft-additional.page';
import DraftFeaturedPage from './-components/draft-featured.page';

const searchSchema = z.object({
  step: z
    .enum(['additional-info', 'main-info', 'featured'])
    .default('main-info')
    .catch('main-info'),
});

export const Route = createFileRoute(
  '/dashboard/catalog/service-listing/edit/$id'
)({
  component: EditServicePage,
});
function EditServicePage() {
  const search = useSearch({
    from: '/dashboard/catalog/service-listing/draft/$id',
  });

  if (search.step === 'main-info') return <DraftMainInfoPage />;
  if (search.step === 'additional-info') return <DraftAdditionalDetailsPage />;
  return <DraftFeaturedPage />;
}
