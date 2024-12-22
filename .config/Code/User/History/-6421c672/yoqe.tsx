import { UseFormReturn } from 'react-hook-form';
import { TServiceFeaturedSchema } from '../-utils/service-listing.schema';
import { FormField } from '@/components/global/FormField';
import { Input } from '@/components/ui/input';
import ImageUploader from '@/components/global/ImageUploader';
import { Button } from '@/components/ui/button';
import { useSellerSubscription } from '@/lib/hooks/useSession';
import { useMemo } from 'react';

export default function FeaturedProjects(props: {
  form: UseFormReturn<TServiceFeaturedSchema>;
}) {
  const liveValues = props.form.watch();
  const activeSubscription = useSellerSubscription();
  const limit =
    activeSubscription.data?.activeSubscription?.subscriptionDetails.limits
      .featuredProjects ?? 0;

  const remainingLimit = useMemo(() => {
    return limit - (liveValues.featuredProjects?.length ?? 0);
  }, [limit, liveValues.featuredProjects?.length]);

  return (
    <FormField
      label={`Featured Projects (${remainingLimit} remaining)`}
      error={props.form.formState.errors?.featuredProjects?.message}
      className='space-y-5'
    >
      {liveValues.featuredProjects?.map((_, index) => (
        <div key={index} className='space-y-4'>
          <Input
            placeholder='Project Name'
            {...props.form.register(`featuredProjects.${index}.projectName`)}
            error={
              props.form.formState.errors?.featuredProjects?.[index]
                ?.projectName?.message
            }
          />
          <ImageUploader
            files={liveValues.featuredProjects?.[index]?.projectMedia ?? []}
            fileMetadata={{
              purpose: 'CATALOG_MEDIA',
              listingId: liveValues._id,
            }}
            maxFiles={5}
            title='Upload Images (upto 5 in each Project)'
            onChange={(files) => {
              props.form.setValue(
                `featuredProjects.${index}.projectMedia`,
                files
              );
            }}
          />
        </div>
      ))}
      <div className='flex justify-end'>
        <Button
          type='button'
          variant='outline'
          className='rounded-full'
          disabled={remainingLimit === 0}
          onClick={() => {
            props.form.setValue('featuredProjects', [
              ...(props.form.getValues('featuredProjects') ?? []),
              {
                projectName: '',
                projectMedia: [],
              },
            ]);
          }}
        >
          + Add Project
        </Button>
      </div>
    </FormField>
  );
}
