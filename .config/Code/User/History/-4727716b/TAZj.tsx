import { FormField } from '@/components/global/FormField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import {
  LISTING_VISIBILITY,
  TCreateProductSchema,
  TProductListingUpdateSchema,
} from '../../-utils/product-schema';

export default function VisibilitySelector({
  form,
  isService,
}: {
  form:
    | UseFormReturn<TProductListingUpdateSchema>
    | UseFormReturn<TCreateProductSchema>;
  isService?: boolean;
}) {
  return (
    <FormField
      label={isService ? 'Service Visibility' : 'Product Visibility'}
      error={form.formState.errors?.visibility?.message}
      name='title'
    >
      <Select
        // @ts-ignore
        value={form.watch('visibility')}
        onValueChange={(value) => {
          // @ts-ignore
          form.setValue(
            'visibility',
            value as (typeof LISTING_VISIBILITY)[number]
          );
          // @ts-ignore
          form.trigger('visibility');
        }}
      >
        {/* @ts-ignore */}
        <SelectTrigger {...form.register('visibility')}>
          <SelectValue
            placeholder={
              isService
                ? 'Select Service Visibility'
                : 'Select Product Visibility'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {LISTING_VISIBILITY.map((item, index) => (
            <SelectItem key={index} value={item}>
              <span className='capitalize'>{item.replace('_', ' ')}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}
