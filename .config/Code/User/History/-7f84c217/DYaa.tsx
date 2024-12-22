import { UseFormReturn } from 'react-hook-form';
import { FormField } from '@/components/global/FormField';
import { Button } from '@/components/ui/button';
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { TProductListingUpdateSchema } from '../../-utils/product-schema';

export default function PaymentMethods(props: {
  form: UseFormReturn<TProductListingUpdateSchema>;
}) {
  const liveValues = props.form.watch();
  return (
    <div className='space-y-5'>
      <FormField
        label='Payment Methods Accepted'
        error={props.form.formState.errors?.paymentMethods?.message}
        name='paymentMethod'
        className='space-y-4'
      >
        <>
          {liveValues.paymentMethods?.map((paymentMethod, index) => (
            <div className='relative p-2 px-5 rounded-full shadow-md border border-border'>
              <span className='text-sm'>{paymentMethod}</span>

              <button
                type='button'
                onClick={() => {
                  props.form.setValue(
                    'paymentMethods',
                    liveValues.paymentMethods?.filter((_, i) => i !== index)
                  );
                }}
                className='absolute -right-1 -top-5 flex h-full flex-col items-center justify-center text-destructive'
              >
                <Trash className='w-4 h-4' />
              </button>
            </div>
          ))}
        </>
      </FormField>
      <div className='flex justify-end'>
        <AddPaymentMethod form={props.form} />
      </div>
    </div>
  );
}

function AddPaymentMethod(props: {
  form: UseFormReturn<TProductListingUpdateSchema>;
}) {
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  function addPaymentMethod() {
    if (!newPaymentMethod.length) return;
    props.form.setValue('paymentMethods', [
      ...(props.form.getValues('paymentMethods') ?? []),
      newPaymentMethod,
    ]);
    props.form.trigger('paymentMethods');
    setNewPaymentMethod('');
    setIsOpen(false);
  }

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className='rounded-full text-xs'
        >
          + Add Payment Method
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Payment Method</CredenzaTitle>
        </CredenzaHeader>
        <div className='space-y-5'>
          <Input
            type='text'
            placeholder='Enter payment method name'
            value={newPaymentMethod}
            onChange={(event) => setNewPaymentMethod(event.target.value)}
          />
          <Button
            type='button'
            variant='default'
            className='w-full'
            onClick={addPaymentMethod}
          >
            Add
          </Button>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
