import { FormField } from '@/components/global/FormField';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TProductListingUpdateSchema } from '../../-utils/product-schema';

export default function ServiceCharge(props: {
  form: UseFormReturn<TProductListingUpdateSchema>;
}) {
  const liveValues = props.form.watch();
  return (
    <div className='space-y-5'>
      <FormField
        label='How much will you charge?'
        error={
          props.form.formState.errors?.price?.message ||
          props.form.formState.errors?.pricingType?.message
        }
        name='price'
      >
        <div className='grid grid-cols-2  '>
          <Input
            {...props.form.register('price')}
            placeholder='Enter the Price'
            type='number'
            className='rounded-r-none'
          />
          <Select
            value={liveValues.pricingType}
            onValueChange={(value) => {
              props.form.setValue('pricingType', value);
              props.form.trigger('pricingType');
            }}
          >
            <SelectTrigger className='rounded-l-none w-full'>
              <SelectValue placeholder='Select Charge Type' />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormField>
    </div>
  );
}

const units = [
  'Per Yard',
  'Per Meter',
  'Per Carton',
  'Per Gram',
  'Per ml',
  'Per Stripe',
  'Per Set',
  'Per Sheet',
  'Per Pair',
  'Per Pack',
  'Per Ream',
  'Per Roll',
  'Estimated Per Unit',
  'Estimated Total',
  'Range',
  'Ask Price',
  'Get Quote',
  'Per KG',
  'Per Liter',
  'Per lb',
  'Per Gallon',
  'Per Ton',
] as const;
