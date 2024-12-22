import { FormField } from '@/components/global/FormField';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn, UseFormSetValue } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import MultipleSelector from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TCountryCode,
  useCountryList,
  useStateList,
} from '@/lib/hooks/useRegion';
import { COUNTRIES, getCountryName } from '@/lib/utils';
import { useEffect } from 'react';
import {
  TCreateProductSchema,
  TProductListingUpdateSchema,
} from '../../-utils/product-schema';

interface Props {
  form:
    | UseFormReturn<TProductListingUpdateSchema>
    | UseFormReturn<TCreateProductSchema>;
}

export default function DeliveryLocations(props: Props) {
  const { form } = props;
  const liveValues = form.watch();
  const { data: countries } = useCountryList();
  const {
    mutate: getStates,
    stateList,
    isPending: statePending,
  } = useStateList();
  const updateForm: UseFormSetValue<
    TProductListingUpdateSchema | TCreateProductSchema
  > = (name, value) => {
    // @ts-expect-error It is what it is
    form.setValue(name, value);
  };

  useEffect(() => {
    if (liveValues.nationally?.country) {
      getStates({ countryCode: liveValues.nationally?.country });
    }
  }, [liveValues.nationally?.country]);

  return (
    <div className='flex flex-col space-y-5'>
      <FormField
        label='I deliver products (select 1 or more)'
        error={
          form.formState.errors?.nationally?.message ||
          form.formState.errors?.internationally?.message ||
          form.formState.errors?.online?.message
        }
        name='delivery'
        className='flex flex-col gap-3'
      >
        <div className='flex items-center gap-2'>
          <Checkbox
            id='national'
            checked={!!liveValues.nationally}
            onCheckedChange={(value) => {
              if (value === true) {
                // @ts-expect-error It is what it is
                updateForm('nationally', {});
              } else {
                updateForm('nationally', null);
              }
            }}
          />
          <Label htmlFor='national'>Nationally</Label>
        </div>
        <div className='flex items-center gap-2'>
          <Checkbox
            id='internationally'
            checked={!!liveValues.internationally}
            onCheckedChange={(value) => {
              if (value === true) {
                updateForm('internationally', []);
              } else {
                updateForm('internationally', undefined);
              }
            }}
          />
          <Label htmlFor='internationally'>Internationally</Label>
        </div>
        <div className='flex items-center gap-2'>
          <Checkbox
            id='online'
            checked={!!liveValues.online}
            onCheckedChange={(value) => {
              if (value === true) {
                updateForm('online', []);
              } else {
                updateForm('online', undefined);
              }
            }}
          />
          <Label htmlFor='online'>Online (for digital products)</Label>
        </div>
      </FormField>
      <Label className='font-bold'>
        Based on your selection above, select the locations delivered:
      </Label>
      <div id='national-delivery-locations'>
        <Accordion type='multiple' className='space-y-5'>
          <AccordionItem
            value='national'
            className='border rounded-lg shadow-md px-3 aria-hidden:pointer-events-none aria-hidden:opacity-50'
            aria-hidden={!liveValues.nationally}
            isError={Object.keys(form.formState.errors).includes('nationally')}
          >
            <AccordionTrigger className='text-sm'>
              I deliver products Nationally
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-3'>
                <FormField
                  label='Select the country'
                  error={form.formState.errors?.nationally?.country?.message}
                  name='nationally.country'
                >
                  <Select
                    value={liveValues.nationally?.country}
                    onValueChange={(value: TCountryCode) => {
                      if (liveValues.nationally?.country) {
                        const confirm = window.confirm(
                          'Changing the country will remove the selected state. Are you sure?'
                        );
                        if (!confirm) return;
                        form.trigger('nationally');
                      }
                      updateForm('nationally.country', value);
                      updateForm('nationally.states', []);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select country' />
                    </SelectTrigger>
                    <SelectContent>
                      {countries?.map((country) => (
                        <SelectItem
                          value={country.countryCode}
                          key={country._id}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                {stateList?.length > 0 && (
                  <FormField
                    label='State'
                    error={form.formState.errors?.nationally?.states?.message}
                    name='nationally.states'
                  >
                    <MultipleSelector
                      disabled={statePending}
                      value={liveValues.nationally?.states?.map((x) => ({
                        value: x,
                        label: x,
                      }))}
                      onChange={(values) => {
                        updateForm(
                          'nationally.states',
                          values.map((x) => x.value)
                        );
                        form.trigger('nationally');
                      }}
                      options={stateList.map((x) => ({
                        value: x.name,
                        label: x.name,
                      }))}
                      placeholder='Select Countries (Select all country or specific)'
                    />
                  </FormField>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='delivery-locations-international'
            className='border rounded-lg shadow-md px-3 aria-hidden:pointer-events-none aria-hidden:opacity-50'
            aria-hidden={!liveValues.internationally}
          >
            <AccordionTrigger className='text-sm'>
              Internationally (Country)
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2'>
                <FormField
                  label='Country'
                  error={form.formState.errors?.internationally?.message}
                  name='internationally'
                >
                  <MultipleSelector
                    value={liveValues.internationally?.map((x) => ({
                      value: x,
                      label: getCountryName(x),
                    }))}
                    onChange={(values) => {
                      updateForm(
                        'internationally',
                        values.map((x) => x.value) as TCountryCode[]
                      );
                      form.trigger('internationally');
                    }}
                    options={COUNTRIES.map((x) => ({
                      value: x.value,
                      label: x.label,
                    }))}
                    placeholder='Select Countries (Select all country or specific)'
                  />
                </FormField>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='delivery-locations-online'
            className='border rounded-lg shadow-md px-3 aria-hidden:pointer-events-none aria-hidden:opacity-50'
            aria-hidden={!liveValues.online}
          >
            <AccordionTrigger className='text-sm'>
              Online(Country)
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2'>
                <FormField
                  label='Country'
                  error={form.formState.errors?.online?.message}
                  name='internationally'
                >
                  <MultipleSelector
                    value={liveValues.online?.map((x) => ({
                      value: x,
                      label: getCountryName(x),
                    }))}
                    onChange={(values) => {
                      updateForm(
                        'online',
                        values.map((x) => x.value) as TCountryCode[]
                      );
                      form.trigger('online');
                    }}
                    options={COUNTRIES.map((x) => ({
                      value: x.value,
                      label: x.label,
                    }))}
                    placeholder='Select Countries (Select all country or specific)'
                  />
                </FormField>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
