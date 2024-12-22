import { FormField } from '@/components/global/FormField';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button.tsx';
import { Slider } from '@/components/ui/slider';
import { useAxios } from '@/lib/hooks/useAxios.ts';
import { useSession } from '@/lib/hooks/useSession.ts';
import { getErrorMessage, handleFormError } from '@/lib/utils.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import ServiceLocations from '../../-components/service-locations';
import {
  createServiceSchema,
  TCreateServiceSchema,
} from '../../-utils/service-listing.schema';
import CategorySelector from '../../../-components/category-selector';
import VisibilitySelector from '../../../-components/visibility-selector';
import { useEditService } from '../../../-hooks/useEditData';

export function EditServiceMainPage() {
  const axios = useAxios();
  const navigate = useNavigate();
  const store = useSession().currentStore;
  const productData = useEditService();
  const productId = useParams({
    from: '/dashboard/catalog/service-listing/draft/$id',
  }).id;
  const queryClient = useQueryClient();

  const form = useForm<TCreateServiceSchema>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      listingType: 'BServiceListing',
    },
  });

  const formSubmitMutation = useMutation({
    mutationFn: async (data: TCreateServiceSchema) => {
      await axios.put(`/listing/draft/${productId}`, {
        ...data,
        store: store?._id,
        draftData: data,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['draft-product', productId],
        exact: true,
      });
      await navigate({
        to: '/dashboard/catalog/service-listing/draft/$id',
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
    form.reset({
      ...form.getValues(),
      ...productData.data,
    });
  }, [productData.data]);

  return (
    <main className='px-3 py-5 space-y-5'>
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
          <h5>Step 1 of 3: Get Started</h5>
          <Slider value={[0]} max={2} />
        </div>
      </div>
      <form
        onSubmit={form.handleSubmit(
          (vals) => formSubmitMutation.mutate(vals),
          handleFormError
        )}
        className='space-y-5'
      >
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
        <VisibilitySelector form={form} isService />
        <CategorySelector form={form} categoryType='BServiceListing' />
        <ServiceLocations form={form} />
        <div className='flex items-center justify-evenly'>
          <Button className='rounded-full'>Save as Draft</Button>
          <Button
            variant='accent'
            type='submit'
            isLoading={formSubmitMutation.isPending}
          >
            Save & Next
          </Button>
        </div>
      </form>
    </main>
  );
}
