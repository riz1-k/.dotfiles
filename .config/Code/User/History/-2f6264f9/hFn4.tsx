import { FormField } from '@/components/global/FormField';
import { useMemo, useState } from 'react';
import ImageUploader from '@/components/global/ImageUploader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useSellerSubscription } from '@/lib/hooks/useSubscription';
import {
  LISTING_CATALOG,
  TProductListingUpdateSchema,
} from '../../-utils/product-schema';
import { useEditProduct } from '../../-utils/useListings';
import { TFile } from '@/lib/file-utils';

export default function MediaListing(props: {
  form: UseFormReturn<TProductListingUpdateSchema>;
}) {
  const [selectedMediaType, setSelectedMediaType] =
    useState<(typeof LISTING_CATALOG)[number]>('MEDIA');
  const productData = useEditProduct();
  const activeSubscription = useSellerSubscription(productData.data?.store);
  const liveValues = props.form.watch();

  const cataloglimit =
    activeSubscription.data?.activeSubscription?.subscriptionDetails.limits
      .catalogs ?? 0;

  const remainingLimit = useMemo(() => {
    return cataloglimit - (liveValues.catalog?.length ?? 0);
  }, [cataloglimit, liveValues.catalog?.length]);

  return (
    <div className='space-y-5'>
      <FormField
        label={`Add Media (${remainingLimit} remaining)`}
        error={props.form.formState.errors?.catalog?.message}
        name='media'
      >
        <div className='flex items-center gap-8'>
          <div className='flex items-center space-x-2'>
            <input
              type='radio'
              checked={selectedMediaType === 'MEDIA'}
              onChange={() => setSelectedMediaType('MEDIA')}
              className='peer'
              id='media-type-media'
            />
            <label
              htmlFor='media-type-media'
              className='cursor-pointer text-sm'
            >
              Upload Media
            </label>
          </div>
          <div className='flex items-center space-x-2'>
            <input
              type='radio'
              checked={selectedMediaType === 'URL'}
              onChange={() => setSelectedMediaType('URL')}
              className='peer'
              id='media-type-url'
            />
            <label htmlFor='media-type-url' className='cursor-pointer text-sm'>
              Add Weblinks
            </label>
          </div>
        </div>
        {selectedMediaType === 'MEDIA' && (
          <MediaUploader form={props.form} remainingLimit={remainingLimit} />
        )}
        {selectedMediaType === 'URL' && (
          <UrlUploader form={props.form} remainingLimit={remainingLimit} />
        )}
      </FormField>
    </div>
  );
}

function MediaUploader(props: {
  form: UseFormReturn<TProductListingUpdateSchema>;
  remainingLimit: number;
}) {
  const liveValues = props.form.watch();
  const limit = props.remainingLimit;
  const catalogMedia = liveValues.catalog
    ?.map((x) => x.catalogMedia)
    .filter((x) => x) as TFile[];

  console.log({ limit });

  return (
    <ImageUploader
      files={catalogMedia}
      onChange={(files) => {
        props.form.setValue(
          'catalog',
          files.map((x) => ({ catalogMedia: x, catalogType: 'MEDIA' })) as any
        );
      }}
      maxFiles={limit}
      title='Media Upload'
      fileMetadata={{
        purpose: 'CATALOG_MEDIA',
        listingId: liveValues._id,
      }}
    />
  );
}

function UrlUploader(props: {
  form: UseFormReturn<TProductListingUpdateSchema>;
  remainingLimit: number;
}) {
  const liveValues = props.form.watch();
  const limit = props.remainingLimit;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>
          Media URL
          <CardDescription>
            Add your media URLs here. You can add up to {limit} URLs.
          </CardDescription>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {liveValues.catalog?.map((catalog, index) => (
          <>
            {catalog.catalogType === 'URL' && (
              <div className='relative' key={index}>
                <Input
                  placeholder='Enter Media URL'
                  key={index}
                  {...props.form.register(`catalog.${index}.catalogURL`)}
                  error={
                    props.form.formState.errors?.catalog?.[index]?.catalogURL
                      ?.message
                  }
                />
                <button
                  type='button'
                  onClick={() => {
                    props.form.setValue(
                      'catalog',
                      liveValues.catalog?.filter((_, i) => i !== index)
                    );
                  }}
                  className='absolute -right-0 -top-5 flex h-full flex-col items-center justify-center text-destructive'
                >
                  <Trash className='w-4 h-4' />
                </button>
              </div>
            )}
          </>
        ))}
      </CardContent>
      <CardFooter className='flex justify-end'>
        <Button
          size='sm'
          aria-disabled={limit === 0}
          onClick={() => {
            if (limit === 0) {
              let message = '';
              if (
                liveValues.catalog?.filter((x) => x.catalogType === 'MEDIA')
                  .length > 0
              ) {
                message =
                  'Either remove Uploaded Media or Upgrade your plan to add more URLs';
              } else {
                message = 'Upgrade your plan to add more URLs';
              }
              alert(message);
              return;
            }
            props.form.setValue('catalog', [
              ...(liveValues.catalog ?? []),
              { catalogURL: '', catalogType: 'URL' },
            ]);
          }}
        >
          Add More
        </Button>
      </CardFooter>
    </Card>
  );
}
