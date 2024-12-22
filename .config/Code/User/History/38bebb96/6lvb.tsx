import { UseFormReturn } from 'react-hook-form';
import { TProductListingUpdateSchema } from '../../-utils/product-schema';
import { Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/global/FormField';
import { Button } from '@/components/ui/button';

export default function SpecialyListing(props: {
  form: UseFormReturn<TProductListingUpdateSchema>;
}) {
  const liveValues = props.form.watch();
  return (
    <div className='space-y-5'>
      <FormField
        label='Specialities'
        error={props.form.formState.errors?.speciality?.message}
        name='speciality'
      >
        {liveValues.speciality?.map((_, index) => (
          <div className='relative' key={index}>
            <Input
              key={index}
              error={props.form.formState.errors?.speciality?.[index]?.message}
              placeholder='Enter Speciality (upto 10)'
              {...props.form.register(`speciality.${index}`)}
            />
            <button
              type='button'
              onClick={() => {
                props.form.setValue(
                  'speciality',
                  liveValues.speciality?.filter((_, i) => i !== index)
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
          disabled={liveValues.speciality?.length >= 10}
          className='rounded-full text-xs'
          onClick={() => {
            props.form.setValue('speciality', [
              ...(liveValues.speciality ?? []),
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
