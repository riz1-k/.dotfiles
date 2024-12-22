import { createFileRoute, useSearch } from '@tanstack/react-router';
import { z } from 'zod';
import { EditServiceMainPage } from './-components/edit-main.page';
import EditServiceAdditionalPage from './-components/edit-additional.page';
import EditServiceFeaturedPage from './-components/edit-featured.page';

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
  validateSearch: searchSchema,
});

function EditServicePage() {
  const search = useSearch({
    from: '/dashboard/catalog/service-listing/draft/$id',
  });

  if (search.step === 'main-info') return <EditServiceMainPage />;
  if (search.step === 'additional-info') return <EditServiceAdditionalPage />;
  return <EditServiceFeaturedPage />;
}
