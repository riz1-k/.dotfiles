import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/global/FormField';
import ImageUploader from '@/components/global/ImageUploader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAxios } from '@/lib/hooks/useAxios';
import {
  getErrorMessage,
  handleFormError,
  transformPayload,
} from '@/lib/utils';
import { useEffect } from 'react';
import { toast } from 'sonner';
import FAQSection from '../../-components/faq-section';
import HighlightListing from '../../-components/highlight-listing';
import MediaListing from '../../-components/media-listing';
import PaymentMethods from '../../-components/payment-listing';
import ServiceCharge from '../../-components/service-charge';
import SpecialyListing from '../../-components/speciality-listing';
import { useMutation } from '@tanstack/react-query';
import { useEditProduct } from '../../../-utils/useListings';
import {
  createProductSchema,
  productListingUpdateSchema,
  TProductListingUpdateSchema,
} from '../../../-utils/product-schema';

export default function EditProductAdditionalDetailsPage() {
  const axios = useAxios();
  const navigate = useNavigate();
  const search = useSearch({
    from: '/_dashboard/dashboard/listings/edit/product/$id',
  });
  const store = useEditProduct().data?.store;
  const form = useForm<TProductListingUpdateSchema>({
    resolver: zodResolver(productListingUpdateSchema),
    defaultValues: {
      catalog: [],
      highlights: [''],
      speciality: [''],
      faqs: [],
      images: [],
    },
  });
  const liveValues = form.watch();
  const { id: productId } = useParams({
    from: '/_dashboard/dashboard/listings/edit/product/$id',
  });
  const productData = useEditProduct();
  const formSubmitMutation = useMutation({
    mutationFn: async (data: TProductListingUpdateSchema) => {
      const response = await axios.put(
        '/listing/product/' + productId,
        transformPayload({
          ...data,
          store: store,
          internationally: data.internationally ?? [],
          online: data.online ?? [],
          draftData: undefined,
        })
      );
      return response.data.data as { _id: string };
    },
    onSuccess: () => {
      navigate({
        to: '/dashboard/listings',
        search: {
          limit: 10,
          listType: 'product',
          page: 1,
        },
      }).then(() => {
        sessionStorage.removeItem(`edit-product-${productId}`);
        toast.success('Product updated successfully');
      });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  useEffect(() => {
    if (!productData.data) return;
    try {
      const firstStepData = sessionStorage.getItem(`edit-product-${productId}`);
      if (firstStepData) {
        const data = createProductSchema.parse(JSON.parse(firstStepData));
        form.reset({
          ...productData.data,
          catalog: productData.data.catalog ?? [],
          ...data,
          _id: productId,
          internationally: data.internationally ?? undefined,
          online: data.online ?? undefined,
        });
      } else {
        throw new Error('Something went wrong, please try again');
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      navigate({
        to: '/dashboard/listings/edit/product/$id',
        search: {
          step: 'main-info',
        },
        params: { id: productId },
      });
    }
  }, [productData.data]);

  return (
    <form
      onSubmit={form.handleSubmit(
        (vals) => formSubmitMutation.mutate(vals),
        handleFormError
      )}
      aria-disabled={!search.isEdit}
      className='px-3 py-5 space-y-5 aria-disabled:opacity-50 aria-disabled:pointer-events-none'
    >
      <div className='gap-5 flex flex-col '>
        <h1 className='text-xl font-bold'>Product Listing</h1>
      </div>
      <FormField
        label='Main Listing Image'
        error={form.formState.errors?.images?.message}
        name='images'
      >
        <ImageUploader
          files={liveValues.images ?? []}
          title='Upload Images (upto 5)'
          maxFiles={5 - liveValues.images.length}
          onChange={(files) => {
            form.setValue('images', [...files]);
            form.trigger('images');
          }}
          fileMetadata={{
            purpose: 'MAIN_LISTING',
            listingId: productId,
          }}
        />
      </FormField>
      <FormField
        label='Description'
        error={form.formState.errors?.description?.message}
        name='description'
      >
        <Textarea
          {...form.register('description')}
          placeholder='Type the description'
        />
      </FormField>
      <HighlightListing form={form} />
      <SpecialyListing form={form} />
      <PaymentMethods form={form} />
      <ServiceCharge form={form} />
      <FAQSection form={form} />
      <MediaListing form={form} />
      <div
        aria-hidden={!search.isEdit}
        className='flex justify-end items-center aria-hidden:hidden'
      >
        <Button
          variant='default'
          size='sm'
          className=' text-sm'
          onClick={() => {
            navigate({
              to: '/dashboard/listings/edit/product/$id',
              search: {
                step: 'main-info',
              },
              params: { id: productId },
            });
          }}
        >
          Go Back
        </Button>

        <Button
          type='submit'
          size='sm'
          aria-hidden={!search.isEdit}
          variant='accent'
          className='rounded-full text-sm'
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
