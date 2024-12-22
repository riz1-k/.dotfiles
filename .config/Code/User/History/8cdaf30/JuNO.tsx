import { FormField } from '@/components/global/FormField';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage, handleFormError } from '@/lib/utils.ts';
import { toast } from 'sonner';
import VisibilitySelector from '../../-components/visibilty-selector';
import CategorySelector from '../../-components/category-selector';
import DeliveryLocations from '../../-components/delivery-location';
import { useEffect } from 'react';
import { useEditProduct } from '../../../-utils/useListings';
import {
  createProductSchema,
  TCreateProductSchema,
} from '../../../-utils/product-schema';

export function EditProductMainInfoPage() {
  const navigate = useNavigate();
  const productData = useEditProduct();
  const store = productData.data?.store;
  const productId = useParams({
    from: '/_dashboard/dashboard/listings/edit/product/$id',
  }).id;
  const queryClient = useQueryClient();
  const search = useSearch({
    from: '/_dashboard/dashboard/listings/edit/product/$id',
  });

  const form = useForm<TCreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      listingType: 'BProductListing',
    },
  });

  const formSubmitMutation = useMutation({
    mutationFn: async (data: TCreateProductSchema) => {
      sessionStorage.setItem(
        `edit-product-${productId}`,
        JSON.stringify({
          ...productData.data,
          ...data,
          store: store,
        })
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['edit-product', productId],
        exact: true,
      });
      await navigate({
        to: '/dashboard/listings/edit/product/$id',
        params: { id: productId },
        search: {
          step: 'additional-info',
        },
      });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  useEffect(() => {
    if (!productData.data) return;
    const firstStepData = sessionStorage.getItem(`edit-product-${productId}`);
    form.reset({
      ...form.getValues(),
      ...productData.data,
      internationally:
        (productData.data.internationally?.length ?? 0 > 0)
          ? productData.data.internationally
          : undefined,
      online:
        (productData.data.online?.length ?? 0 > 0)
          ? productData.data.online
          : undefined,
    });
    if (firstStepData) {
      const data = createProductSchema.parse(JSON.parse(firstStepData));
      form.reset({
        ...form.getValues(),
        ...data,
      });
    }
  }, [productData.data]);

  return (
    <main className='px-3 py-5'>
      <form
        onSubmit={form.handleSubmit(
          (vals) => formSubmitMutation.mutate(vals),
          handleFormError
        )}
        aria-disabled={!search.isEdit}
        className='space-y-5 aria-disabled:opacity-50 aria-disabled:pointer-events-none'
      >
        <div className='gap-5 flex flex-col '>
          <div className='flex gap-3 items-center'>
            <svg
              width='27'
              height='27'
              viewBox='0 0 27 27'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M13.3333 0.166626C5.97333 0.166626 0 6.13996 0 13.5C0 20.86 5.97333 26.8333 13.3333 26.8333C20.6933 26.8333 26.6667 20.86 26.6667 13.5C26.6667 6.13996 20.6933 0.166626 13.3333 0.166626ZM6.66667 6.83329H16V9.49996H6.66667V6.83329ZM10.6667 17.5H6.66667V14.8333H10.6667V17.5ZM6.66667 13.5V10.8333H16V13.5H6.66667ZM22.6667 17.5H20V20.1666H17.3333V17.5H14.6667V14.8333H17.3333V12.1666H20V14.8333H22.6667V17.5Z'
                fill='#E41C5A'
              />
            </svg>

            <h1 className='text-xl font-bold'>Product Listing</h1>
          </div>
        </div>
        <FormField
          label='Listing Name/Title'
          error={form.formState.errors?.title?.message}
          name='title'
        >
          <Input
            {...form.register('title')}
            placeholder='Type the name of your product'
          />
        </FormField>
        <VisibilitySelector form={form} />
        <CategorySelector form={form} categoryType='BProductListing' />
        <DeliveryLocations form={form} />
        <div className='flex items-center justify-end'>
          <Button
            variant='accent'
            type='submit'
            aria-hidden={!search.isEdit}
            isLoading={formSubmitMutation.isPending}
          >
            Save & Next
          </Button>
        </div>
      </form>
      <div className='flex items-center justify-end mt-5'>
        <Button
          type='button'
          variant='accent'
          aria-hidden={search.isEdit}
          onClick={() => {
            const formData = form.getValues();
            sessionStorage.setItem(
              `edit-product-${productId}`,
              JSON.stringify({
                ...productData.data,
                ...formData,
                store: store,
              })
            );
            navigate({
              to: '/dashboard/listings/edit/product/$id',
              search: {
                ...search,
                step: 'additional-info',
              },
              params: { id: productId },
            });
          }}
        >
          Next : Additional Info
        </Button>
      </div>
    </main>
  );
}
