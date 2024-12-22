import { FormField } from '@/components/global/FormField';
import ImageUploader from '@/components/global/ImageUploader';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useAxios } from '@/lib/hooks/useAxios';
import { useSession } from '@/lib/hooks/useSession';
import { getErrorMessage, handleFormError } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  serviceListingAdditionalSchema,
  TServiceAdditionalSchemaSchema,
} from '../../-utils/service-listing.schema';
import HighlightListing from '../../../-components/highlight-listing';
import PaymentMethods from '../../../-components/payment-methods';
import ServiceCharge from '../../../-components/service-charge';
import SpecialyListing from '../../../-components/specialy-listing';
import { useDraftService } from '../../../-hooks/useDraftData';

export default function EditServiceFeaturedPage() {
  const axios = useAxios();
  const navigate = useNavigate();
  const store = useSession().currentStore;
  const queryClient = useQueryClient();
  const form = useForm<TServiceAdditionalSchemaSchema>({
    resolver: zodResolver(serviceListingAdditionalSchema),
    defaultValues: {
      highlights: [''],
      speciality: [''],
    },
  });
  const liveValues = form.watch();
  const { id: productId } = useParams({
    from: '/dashboard/catalog/service-listing/draft/$id',
  });
  const productData = useDraftService();

  const formSubmitMutation = useMutation({
    mutationFn: async (data: TServiceAdditionalSchemaSchema) => {
      await axios.put('/listing/draft/' + productId, {
        ...data,
        store: store?._id,
        draftData: data,
        online: data.online ?? [],
        myLocations: data.myLocations ?? [],
        customerLocations: data.customerLocations ?? [],
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['draft-service', productId],
        exact: true,
      });
      navigate({
        to: '/dashboard/catalog/service-listing/draft/$id',
        params: { id: productId },
        search: {
          step: 'featured',
        },
      });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  useEffect(() => {
    if (!productData.data) return;
    form.reset({
      ...form.getValues(),
      ...productData.data,
      _id: productId,
    });
  }, [productData.data]);

  return (
    <form
      onSubmit={form.handleSubmit(
        (vals) => formSubmitMutation.mutate(vals),
        handleFormError
      )}
      className='px-3 py-5 space-y-5'
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

          <h1 className='text-xl font-bold'>Add Service Listing</h1>
        </div>
        <div className='flex flex-col gap-4'>
          <h5>Step 2 of 3: Your are almost there!</h5>
          <Slider value={[0]} max={2} />
        </div>
      </div>
      <FormField
        label='Main Listing Image'
        error={form.formState.errors?.images?.message}
        name='images'
      >
        <ImageUploader
          files={liveValues.images ?? []}
          title='Upload Images (upto 5)'
          maxFiles={5}
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
      {/* @ts-ignore */}
      <HighlightListing form={form} />
      {/* @ts-ignore */}
      <SpecialyListing form={form} />
      {/* @ts-ignore */}
      <PaymentMethods form={form} />
      {/* @ts-ignore */}
      <ServiceCharge form={form} />
      <div className='flex justify-evenly items-center'>
        <Button
          variant='outline'
          size='sm'
          className='rounded-full text-sm'
          onClick={() =>
            navigate({
              to: '/dashboard/catalog/service-listing/draft/$id',
              search: {
                step: 'main-info',
              },
              params: { id: productId },
            })
          }
        >
          Go Back
        </Button>
        <Button
          type='button'
          size='sm'
          onClick={() => {}}
          className='rounded-full text-sm'
        >
          Save as Draft
        </Button>

        <Button
          type='submit'
          size='sm'
          variant='accent'
          className='rounded-full text-sm'
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
