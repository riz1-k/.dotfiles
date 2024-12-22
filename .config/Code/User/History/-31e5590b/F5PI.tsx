import {
  createFileRoute,
  useNavigate,
  useParams,
  useSearch,
} from '@tanstack/react-router';
import { z } from 'zod';
import { EditProductMainInfoPage } from './-components/product-main-info';
import EditProductAdditionalDetailsPage from './-components/product-additional';
import PageHeader from '@/components/global/PageHeader';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute(
  '/_dashboard/dashboard/listings/edit/product/$id'
)({
  component: EditProductPage,
  validateSearch: z.object({
    step: z
      .enum(['additional-info', 'main-info'])
      .default('main-info')
      .catch('main-info'),
    isEdit: z.boolean().default(true).optional(),
  }),
});
function EditProductPage() {
  const search = useSearch({
    from: '/_dashboard/dashboard/listings/edit/product/$id',
  });
  const navigate = useNavigate();
  const params = useParams({
    from: '/_dashboard/dashboard/listings/edit/product/$id',
  });
  return (
    <section>
      <PageHeader
        breadcrumbs={[
          {
            link: {
              to: '/dashboard/listings',
            },
            label: 'Listings',
          },
          {
            label: 'Edit Product Listing',
            link: null,
          },
        ]}
        rightContent={
          <Button
            variant='default'
            size='sm'
            onClick={() => {
              if (search.isEdit) {
                const confirm = window.confirm(
                  'Are you sure you want to discard changes?'
                );
                if (!confirm) return;
                navigate({
                  to: '/dashboard/listings/edit/product/$id',
                  search: {
                    ...search,
                    isEdit: false,
                  },
                  params: { id: params.id },
                }).then(() => {
                  sessionStorage.removeItem(`edit-product-${params.id}`);
                  window.location.reload();
                });
              } else {
                navigate({
                  to: '/dashboard/listings/edit/product/$id',
                  search: {
                    ...search,
                    isEdit: true,
                  },
                  params: { id: params.id },
                });
              }
            }}
          >
            {search.isEdit ? 'Discard Changes' : 'Enable Edit'}
          </Button>
        }
      />
      {search.step === 'main-info' ? (
        <EditProductMainInfoPage />
      ) : (
        <EditProductAdditionalDetailsPage />
      )}
    </section>
  );
}
