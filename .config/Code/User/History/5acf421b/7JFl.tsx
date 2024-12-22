import { FormField } from '@/components/global/FormField';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  useCityList,
  useCountryList,
  useStateList,
} from '@/lib/hooks/useRegion';
import { COUNTRIES, getCountryName } from '@/lib/utils';
import { Trash } from 'lucide-react';
import { useEffect } from 'react';
import { UseFormReturn, UseFormSetValue } from 'react-hook-form';
import { TCreateServiceSchema } from '../-utils/service-listing.schema';
import { CitySelector } from '@/components/global/location-selectors';

interface Props {
  form: UseFormReturn<TCreateServiceSchema>;
}

export default function ServiceLocations(props: Props) {
  const { form } = props;
  const liveValues = form.watch();

  const updateForm: UseFormSetValue<TCreateServiceSchema> = (name, value) => {
    //@ts-ignore
    form.setValue(name, value);
  };

  return (
    <div className='flex flex-col space-y-5'>
      <FormField
        label='I deliver products (select 1 or more)'
        error={
          form.formState.errors?.myLocations?.message ||
          form.formState.errors?.customerLocations?.message ||
          form.formState.errors?.online?.message
        }
        name='delivery'
        className='flex flex-col gap-3'
      >
        <div className='flex items-center gap-2'>
          <Checkbox
            id='national'
            checked={!!liveValues.myLocations}
            onCheckedChange={(value) => {
              if (value === true) {
                updateForm('myLocations', []);
              } else {
                updateForm('myLocations', null);
              }
            }}
          />
          <Label htmlFor='national'>At My Location</Label>
        </div>
        <div className='flex items-center gap-2'>
          <Checkbox
            id='internationally'
            checked={!!liveValues.customerLocations}
            onCheckedChange={(value) => {
              if (value === true) {
                updateForm('customerLocations', []);
              } else {
                updateForm('customerLocations', undefined);
              }
            }}
          />
          <Label htmlFor='internationally'>At Customer Locations</Label>
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
          <Label htmlFor='online'>Online </Label>
        </div>
      </FormField>
      <Label className='font-bold'>
        Based on your selection above, select the locations delivered:
      </Label>
      <div id='at-my-location'>
        <Accordion type='multiple' className='space-y-5'>
          <AccordionItem
            value='my-location'
            className='border rounded-lg shadow-md px-3 aria-hidden:pointer-events-none aria-hidden:opacity-50'
            aria-hidden={!liveValues.myLocations}
          >
            <AccordionTrigger className='text-sm'>
              I offer my service at my location
            </AccordionTrigger>
            <AccordionContent className='space-y-5'>
              {liveValues.myLocations?.map((_, index) => (
                <LocationSelect key={index} index={index} form={form} />
              ))}
              <div className='flex justify-start'>
                <Button
                  onClick={() => {
                    const prev = form.getValues('myLocations') ?? [];
                    updateForm('myLocations', [
                      ...prev,
                      {
                        country: undefined,
                        locations: [],
                      },
                    ]);
                  }}
                  type='button'
                  variant='secondary'
                  size={'sm'}
                  className='rounded-full'
                >
                  + Add Country
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value='customer-locations'
            className='border rounded-lg shadow-md px-3 aria-hidden:pointer-events-none aria-hidden:opacity-50'
            aria-hidden={!liveValues.customerLocations}
          >
            <AccordionTrigger className='text-sm'>
              I offer my service at these locations
            </AccordionTrigger>
            <AccordionContent className='space-y-5'>
              {liveValues.customerLocations?.map((_, index) => (
                <CustomerLocaionSelector
                  key={index}
                  index={index}
                  form={form}
                />
              ))}
              <div className='flex justify-end'>
                <Button
                  onClick={() => {
                    const prev = form.getValues('customerLocations') ?? [];
                    updateForm('customerLocations', [
                      ...prev,
                      {
                        country: undefined,
                        locations: [],
                      },
                    ]);
                  }}
                  type='button'
                  variant='default'
                  className='rounded-full'
                >
                  + Add Location
                </Button>
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
                  name='online'
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

function LocationSelect(
  props: Props & {
    index: number;
  }
) {
  const { index, form } = props;
  const { data: countries } = useCountryList();
  const { mutate: getStates, stateList } = useStateList();
  const liveValues = form.watch();

  const selectedCountry = liveValues.myLocations?.[index]?.country;
  useEffect(() => {
    if (selectedCountry) {
      getStates({ countryCode: selectedCountry });
    }
  }, [selectedCountry]);

  return (
    <>
      <div className='space-y-3'>
        <FormField
          label={
            <div className='flex items-center justify-between'>
              <span>Country</span>
              <button
                type='button'
                onClick={() => {
                  const confirm = window.confirm(
                    'Are you sure you want to delete this Country location?'
                  );
                  if (!confirm) {
                    return;
                  }

                  const filterdLocations = liveValues?.myLocations?.filter(
                    (_, i) => i !== index
                  );

                  form.setValue('myLocations', filterdLocations ?? []);
                }}
                className='text-destructive'
              >
                Delete
              </button>
            </div>
          }
          error={form.formState.errors?.myLocations?.[index]?.country?.message}
          name={`myLocations.${index}.country`}
        >
          <Select
            value={liveValues?.myLocations?.[index]?.country}
            onValueChange={(val) => {
              if (liveValues?.myLocations?.[index]?.country) {
                const confirm = window.confirm(
                  'Changing country will reset the selected states and cities. Are you sure you want to continue?'
                );
                if (!confirm) {
                  return;
                }
              }

              form.setValue(
                `myLocations.${index}.country`,
                val as TCountryCode
              );
              const previousLocations =
                liveValues?.myLocations?.[index]?.locations ?? [];

              form.setValue(`myLocations.${index}.locations`, [
                ...previousLocations,
                { cities: [], state: '' },
              ]);

              form.trigger(`myLocations.${index}.locations`);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select country' />
            </SelectTrigger>
            <SelectContent>
              {countries?.map((country) => (
                <SelectItem key={country._id} value={country.countryCode}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <div className='space-y-5'>
          {stateList.length > 0 && (
            <>
              {liveValues?.myLocations?.[index]?.locations.map(
                (_, locationIndex) => (
                  <div
                    key={locationIndex}
                    className='flex flex-col gap-2 items-center w-full p-3 border-2 rounded-md'
                  >
                    <div className='flex items-center justify-between w-full'>
                      <span className='text-base font-semibold'>
                        Location {locationIndex + 1}
                      </span>
                      <button
                        type='button'
                        onClick={() => {
                          const confirm = window.confirm(
                            'Are you sure you want to delete this Location?'
                          );
                          if (!confirm) {
                            return;
                          }

                          const previousLocations = form.getValues(
                            `myLocations.${index}.locations`
                          );
                          form.setValue(
                            `myLocations.${index}.locations`,
                            previousLocations.filter(
                              (_, i) => i !== locationIndex
                            )
                          );
                        }}
                        className='text-destructive'
                      >
                        <Trash className='w-4 h-4' />
                      </button>
                    </div>
                    <FormField
                      label='State'
                      error={
                        form.formState.errors?.myLocations?.[index]
                          ?.locations?.[locationIndex]?.state?.message
                      }
                      name={`myLocations.${index}.locations.${locationIndex}.state`}
                      className='w-full'
                    >
                      <Select
                        value={
                          liveValues?.myLocations?.[index]?.locations?.[
                            locationIndex
                          ]?.state
                        }
                        onValueChange={(value) => {
                          form.setValue(
                            `myLocations.${index}.locations.${locationIndex}.state`,
                            value
                          );
                          form.trigger(
                            `myLocations.${index}.locations.${locationIndex}.state`
                          );
                        }}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select state' />
                        </SelectTrigger>
                        <SelectContent>
                          {stateList.map((state) => (
                            <SelectItem key={state._id} value={state.name}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                    <CitySelector
                      value={
                        liveValues?.myLocations?.[index]?.locations?.[
                          locationIndex
                        ]?.cities ?? []
                      }
                      selectedState={
                        liveValues?.myLocations?.[index]?.locations?.[
                          locationIndex
                        ]?.state
                      }
                      onChange={(cities) => {
                        form.setValue(
                          `myLocations.${index}.locations.${locationIndex}.cities`,
                          cities
                        );
                        form.trigger(
                          `myLocations.${index}.locations.${locationIndex}.cities`
                        );
                      }}
                      error={
                        form.formState.errors?.myLocations?.[index]
                          ?.locations?.[locationIndex]?.cities?.message
                      }
                    />
                  </div>
                )
              )}
            </>
          )}
          <div className='flex justify-end'>
            <Button
              type='button'
              variant={'outline'}
              size={'sm'}
              className='rounded-full'
              onClick={() => {
                const previousLocations = form.getValues(
                  `myLocations.${index}.locations`
                );
                form.setValue(`myLocations.${index}.locations`, [
                  ...previousLocations,
                  { cities: [], state: '' },
                ]);
                form.trigger(`myLocations.${index}.locations`);
              }}
            >
              + Add Location
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function CustomerLocaionSelector(props: Props & { index: number }) {
  const { index, form } = props;
  const { data: countries } = useCountryList();
  const { mutate: getStates, stateList } = useStateList();
  const { mutate: getCities, cityList } = useCityList();
  const liveValues = form.watch();

  useEffect(() => {
    if (liveValues.myLocations?.[index]?.country) {
      getStates({ countryCode: liveValues.myLocations?.[index]?.country });
    }
  }, [liveValues.myLocations?.[index]?.country]);

  return (
    <>
      <div className='space-y-3'>
        <FormField
          label={
            <div className='flex items-center justify-between'>
              <span>Country </span>
              <button
                type='button'
                onClick={() => {
                  const confirm = window.confirm(
                    'Are you sure you want to delete this Country location?'
                  );
                  if (!confirm) {
                    return;
                  }

                  const filterdLocations =
                    liveValues?.customerLocations?.filter(
                      (_, i) => i !== index
                    );

                  form.setValue('customerLocations', filterdLocations ?? []);
                }}
                className='text-destructive'
              >
                Delete
              </button>
            </div>
          }
          error={
            form.formState.errors?.customerLocations?.[index]?.country?.message
          }
          name={`customerLocations.${index}.country`}
        >
          <Select
            value={liveValues?.customerLocations?.[index]?.country}
            onValueChange={(val) => {
              if (liveValues?.customerLocations?.[index]?.country) {
                const confirm = window.confirm(
                  'Changing country will reset the selected states and cities. Are you sure you want to continue?'
                );
                if (!confirm) {
                  return;
                }
              }

              form.setValue(
                `customerLocations.${index}.country`,
                val as TCountryCode
              );
              const previousLocations =
                liveValues?.customerLocations?.[index]?.locations ?? [];

              form.setValue(`customerLocations.${index}.locations`, [
                ...previousLocations,
                { cities: [], state: '' },
              ]);

              form.trigger(`customerLocations.${index}.country`);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select country' />
            </SelectTrigger>
            <SelectContent>
              {countries?.map((country) => (
                <SelectItem key={country._id} value={country.countryCode}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <div className='space-y-5'>
          {stateList.length > 0 && (
            <>
              {liveValues?.customerLocations?.[index]?.locations.map(
                (_, locationIndex) => (
                  <div
                    key={locationIndex}
                    className='flex flex-col gap-2 items-center w-full p-3 border-2 rounded-md'
                  >
                    <div className='flex items-center justify-between w-full'>
                      <span className='text-base font-semibold'>
                        Location {locationIndex + 1}
                      </span>
                      <button
                        type='button'
                        onClick={() => {
                          const confirm = window.confirm(
                            'Are you sure you want to delete this Location?'
                          );
                          if (!confirm) {
                            return;
                          }

                          const previousLocations = form.getValues(
                            `customerLocations.${index}.locations`
                          );
                          form.setValue(
                            `customerLocations.${index}.locations`,
                            previousLocations.filter(
                              (_, i) => i !== locationIndex
                            )
                          );
                        }}
                        className='text-destructive'
                      >
                        <Trash className='w-4 h-4' />
                      </button>
                    </div>
                    <FormField
                      label='State'
                      error={
                        form.formState.errors?.customerLocations?.[index]
                          ?.locations?.[locationIndex]?.state?.message
                      }
                      name={`customerLocations.${index}.locations.${locationIndex}.state`}
                      className='w-full'
                    >
                      <Select
                        value={
                          liveValues?.customerLocations?.[index]?.locations?.[
                            locationIndex
                          ]?.state
                        }
                        onValueChange={(value) => {
                          form.setValue(
                            `customerLocations.${index}.locations.${locationIndex}.state`,
                            value
                          );
                          getCities({
                            countryCode: liveValues?.customerLocations?.[index]
                              ?.country as TCountryCode,
                            stateName: value,
                          });
                        }}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select state' />
                        </SelectTrigger>
                        <SelectContent>
                          {stateList.map((state) => (
                            <SelectItem key={state._id} value={state.name}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                    {cityList.length > 0 && (
                      <FormField
                        label='City'
                        error={
                          form.formState.errors?.customerLocations?.[index]
                            ?.locations?.[locationIndex]?.cities?.message
                        }
                        name={`customerLocations.${index}.locations.${locationIndex}.cities`}
                      >
                        <MultipleSelector
                          value={liveValues?.customerLocations?.[
                            index
                          ]?.locations?.[locationIndex]?.cities?.map((x) => ({
                            value: x,
                            label: x,
                          }))}
                          onChange={(values) => {
                            form.setValue(
                              `customerLocations.${index}.locations.${locationIndex}.cities`,
                              values.map((x) => x.value)
                            );
                          }}
                          options={cityList.map((x) => ({
                            value: x.name,
                            label: x.name,
                          }))}
                          placeholder='Select Cities (Select all country or specific)'
                        />
                      </FormField>
                    )}
                  </div>
                )
              )}
            </>
          )}
          <div className='flex justify-end'>
            <Button
              type='button'
              size='sm'
              variant='outline'
              className='rounded-full text-xs'
              onClick={() => {
                const newLocation = {
                  state: '',
                  cities: [],
                };
                const previousLocations = form.getValues(
                  `customerLocations.${index}.locations`
                );

                form.setValue(`customerLocations.${index}.locations`, [
                  ...previousLocations,
                  newLocation,
                ]);
              }}
            >
              Add More Country
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
