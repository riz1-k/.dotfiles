import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAxios } from '@/lib/hooks/useAxios';
import { useSession } from '@/lib/hooks/useSession';
import {
  getErrorMessage,
  handleFormError,
  transformPayload,
} from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import FeaturedProjects from '../../-components/featured-projects';
import {
  serviceListingFeaturedSchema,
  TServiceFeaturedSchema,
} from '../../-utils/service-listing.schema';
import FAQSection from '../../../-components/faq-section';
import MediaListing from '../../../-components/media-listing';
import { useDraftService } from '../../../-hooks/useDraftData';

export default function EditServiceFeaturedPage() {
  const form = useForm<TServiceFeaturedSchema>({
    resolver: zodResolver(serviceListingFeaturedSchema),
    defaultValues: {
      faqs: [],
      featuredProjects: [],
      catalog: [],
    },
  });
  const productId = useParams({
    from: '/dashboard/catalog/service-listing/edit/$id',
  }).id;
  const navigate = useNavigate();
  const axios = useAxios();
  const store = useSession().currentStore;
  const productData = useDraftService();

  const formSubmitMutation = useMutation({
    mutationFn: async (data: TServiceFeaturedSchema) => {
      await axios.put(
        '/listing/service/' + productId,
        transformPayload({
          ...data,
          store: store?._id,
          online: data.online ?? [],
          myLocations: data.myLocations ?? [],
          customerLocations: data.customerLocations ?? [],
        })
      );
    },
    onSuccess: () => {
      navigate({
        to: '/dashboard/catalog/service-listing/edit/$id',
        params: { id: productId },
        search: {
          step: 'main-info',
        },
      });
      toast.success('Service added successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  useEffect(() => {
    if (!productData.data) return;
    form.reset({
      ...form.getValues(),
      ...productData.data,
      _id: productId,
      faqs: productData.data.faqs ?? [],
      catalog: productData.data.catalog ?? [],
    });
  }, [productData.data]);

  return (
    <main className='space-y-5 px-3 py-5'>
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
          <h5>Step 3 of 3: One last Step</h5>
          <Slider value={[2]} max={2} />
        </div>
      </div>
      <form
        onSubmit={form.handleSubmit(
          (vals) => formSubmitMutation.mutate(vals),
          handleFormError
        )}
        className='space-y-5'
      >
        {/* @ts-ignore */}
        <FAQSection form={form} />
        <FeaturedProjects form={form} />
        {/* @ts-ignore */}
        <MediaListing form={form} />
        <div className='flex justify-evenly items-center'>
          <Button
            variant='outline'
            size='sm'
            className='rounded-full text-sm'
            onClick={() =>
              navigate({
                to: '/dashboard/catalog/service-listing/edit/$id',
                search: {
                  step: 'additional-info',
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
            isLoading={formSubmitMutation.isPending}
            className='rounded-full text-sm'
          >
            Submit
          </Button>
        </div>
      </form>
    </main>
  );
}
