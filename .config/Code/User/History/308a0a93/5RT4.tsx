import { createFileRoute, useSearch } from '@tanstack/react-router';
import { z } from 'zod';
import { EditProductMainInfoPage } from './-components/edit-main.page';
import EditProductAdditionalDetailsPage from './-components/edit-additional.page';

const searchSchema = z.object({
  step: z
    .enum(['additional-info', 'main-info'])
    .default('main-info')
    .catch('main-info'),
});

export const Route = createFileRoute(
  '/dashboard/catalog/product-listing/edit/$id'
)({
  component: EditProductPage,
  validateSearch: searchSchema,
});

function EditProductPage() {
  const search = useSearch({
    from: '/dashboard/catalog/product-listing/edit/$id',
  });

  if (search.step === 'main-info') return <EditProductMainInfoPage />;
  return <EditProductAdditionalDetailsPage />;
}
