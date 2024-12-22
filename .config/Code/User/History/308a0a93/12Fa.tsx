import { createFileRoute, useSearch } from '@tanstack/react-router';
import { z } from 'zod';
import { DraftMainInfoPage } from './-components/edit-product-main.page';
import DraftAdditionalDetailsPage from './-components/edit-product-additional.page';

const searchSchema = z.object({
  step: z
    .enum(['additional-info', 'main-info'])
    .default('main-info')
    .catch('main-info'),
});

export const Route = createFileRoute(
  '/dashboard/catalog/product-listing/edit/$id'
)({
  validateSearch: searchSchema,
  component: DraftPage,
});

function DraftPage() {
  const search = useSearch({
    from: '/dashboard/catalog/product-listing/edit/$id',
  });

  if (search.step === 'main-info') return <DraftMainInfoPage />;
  return <DraftAdditionalDetailsPage />;
}
