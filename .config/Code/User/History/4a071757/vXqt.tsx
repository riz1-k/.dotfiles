import { UseFormReturn } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/global/FormField';
import { Button } from '@/components/ui/button';
import { TProductListingUpdateSchema } from '../../-utils/product-schema';

export default function HighlightListing(props: {
  form: UseFormReturn<TProductListingUpdateSchema>;
}) {
  const liveValues = props.form.watch();
  return (
    <div className='space-y-5'>
      <FormField
        label='Highlights'
        error={props.form.formState.errors?.highlights?.message}
        name='highlights'
      >
        {liveValues.highlights?.map((_, index) => (
          <div className='relative' key={index}>
            <Input
              key={index}
              placeholder='About your product highlights'
              error={props.form.formState.errors?.highlights?.[index]?.message}
              {...props.form.register(`highlights.${index}`)}
            />
            <button
              type='button'
              onClick={() => {
                props.form.setValue(
                  'highlights',
                  liveValues.highlights?.filter((_, i) => i !== index)
                );
              }}
              className='absolute -right-1 -top-5 flex h-full flex-col items-center justify-center text-destructive'
            >
              <Trash className='w-4 h-4' />
            </button>
          </div>
        ))}
      </FormField>

      <div className='flex justify-end'>
        <Button
          type='button'
          variant='outline'
          className='rounded-full text-xs'
          onClick={() => {
            props.form.setValue('highlights', [
              ...(liveValues.highlights ?? []),
              '',
            ]);
          }}
        >
          + Add More
        </Button>
      </div>
    </div>
  );
}
