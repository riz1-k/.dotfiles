import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAxios } from '@/lib/hooks/useAxios';
import { useSession } from '@/lib/hooks/useSession';
import { onboardFilesSchema } from '@/routes/onboard/-components/onboard-files-form';
import {
  AVAILABLE_COUNTRIES,
  LISTING_TYPES,
  onboardProfileSchema,
} from '@/routes/onboard/-components/onboard-profile-form';
import { ISellerStore } from '@/types/Tsession';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormField } from '@/components/global/FormField';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCountryName, getErrorMessage, handleFormError } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { US_TIME_ZONES } from '@/routes/onboard/-components/timezone.constant';
import ContactInfoDialog from '@/routes/onboard/-components/add-contact-dialog';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/global/ImageUploader';
import { Textarea } from '@/components/ui/textarea';
import TimeRangeSelector from '@/components/global/TimingSelector';

export const Route = createFileRoute('/_dashboard/dashboard/account/business')({
  component: BusinessProfilePage,
});

const formSchema = onboardProfileSchema.and(onboardFilesSchema);
type TFormSchema = z.infer<typeof formSchema>;

function BusinessProfilePage() {
  const { data: storeData, isLoading } = useStoreData();
  const session = useSession();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: undefined,
      banner: undefined,
      storeData: {
        about: undefined,
        timings: {
          monday: '09:00-18:00',
          tuesday: '09:00-18:00',
          wednesday: '09:00-18:00',
          thursday: '09:00-18:00',
          friday: '09:00-18:00',
          saturday: '09:00-18:00',
          sunday: null,
        },
        specialities: [],
        howCanWeHelp: [],
      },
    },
  });

  const liveValues = form.watch();

  useEffect(() => {
    if (!session.data) return;
    form.reset({
      ...liveValues,
      storeData: {
        ...liveValues.storeData,
        businessEmail: session.data.account.email,
      },
    });
  }, [session.data]);

  useEffect(() => {
    if (!storeData) return;
    form.reset({
      ...liveValues,
      storeName: storeData.storeName,
      logo: storeData.logo,
      banner: storeData.banner,
      country: storeData.country,
      storeData: storeData.storeData,
    });
  }, [storeData]);

  if (isLoading || session.isLoading) return 'Loading...';

  if (!storeData) return 'No store found';

  return (
    <main className='space-y-2 p-4'>
      <div className='flex items-center justify-between'>
        <Label className='text-xl text-card-foreground font-bold'>
          My Profile
        </Label>
      </div>
      <Separator />
      <form onSubmit={form.handleSubmit(() => {}, handleFormError)}>
        <FormField
          label='I am listing as an'
          name='storeData.listingType'
          error={form.formState.errors.storeData?.listingType?.message}
        >
          <RadioGroup
            value={liveValues.storeData.listingType}
            onValueChange={(value) => {
              form.setValue(
                'storeData.listingType',
                value as (typeof LISTING_TYPES)[number]
              );
            }}
            className='flex space-x-4 mt-2'
            {...form.register('storeData.listingType')}
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='INDIVIDUAL' id='individual' />
              <Label htmlFor='individual'>Individual</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='business' id='business' />
              <Label htmlFor='business'>Business</Label>
            </div>
          </RadioGroup>
        </FormField>

        <Input
          placeholder='Enter your name or business name'
          label='Individual or Business Name'
          {...form.register('storeName')}
          error={form.formState.errors.storeName?.message}
        />
        <FormField
          label='Individual or Business Origin Country'
          name='country'
          error={form.formState.errors.country?.message}
        >
          <Select
            value={liveValues.country}
            onValueChange={(
              val: (typeof AVAILABLE_COUNTRIES)[number]['value']
            ) => {
              form.setValue('country', val);
              if (val === 'IN') {
                form.setValue('storeData.timeZone', 'Asia/Kolkata');
              } else if (val === 'SA') {
                form.setValue('storeData.timeZone', 'Asia/Riyadh');
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Country'>
                {liveValues.country ? getCountryName(liveValues.country) : ''}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_COUNTRIES.map((country) => (
                <SelectItem
                  value={country.value}
                  key={country.value}
                  className='capitalize'
                >
                  {country.label.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <div className='space-y-2'>
          <Label htmlFor='contact-informaton'>Contact Information</Label>
          <div className='flex flex-col gap-5'>
            <Input
              label='Full Name'
              placeholder='Enter Contact person full name'
              {...form.register('storeData.contactName')}
              error={form.formState.errors.storeData?.contactName?.message}
            />

            <Input
              label='Local Phone'
              placeholder='Enter Local phone'
              {...form.register('storeData.businessPhone', {
                required: true,
              })}
              error={form.formState.errors.storeData?.businessPhone?.message}
            />

            <Input
              label='Business Email'
              placeholder='Enter Business Email'
              {...form.register('storeData.businessEmail', {
                required: true,
              })}
              error={form.formState.errors.storeData?.businessEmail?.message}
            />

            {liveValues.storeData.contactInfo?.map((contactInfo) => (
              <div className='relative' key={contactInfo.fieldType}>
                <Input
                  label={
                    contactInfo.fieldType.toLowerCase() +
                    ' ' +
                    (contactInfo.type ? `(${contactInfo.type})` : '')
                  }
                  disabled
                  value={contactInfo.value}
                  placeholder={contactInfo.type}
                />
                <button
                  type='button'
                  onClick={() => {
                    form.setValue(
                      'storeData.contactInfo',
                      form
                        .getValues('storeData.contactInfo')
                        .filter(
                          (contact) =>
                            contact.fieldType !== contactInfo.fieldType
                        )
                    );
                  }}
                  className='absolute -right-0 -top-5 flex h-full flex-col items-center justify-center text-destructive'
                >
                  <Trash className='w-4 h-4' />
                </button>
              </div>
            ))}
          </div>
          <div className='flex justify-end pt-4'>
            <ContactInfoDialog
              onAdd={(contactInfo) => {
                form.setValue(
                  'storeData.contactInfo',
                  form
                    .getValues('storeData.contactInfo')
                    .concat(contactInfo as any)
                );
              }}
            />
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='highlights'>Highlights</Label>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                checked={form.watch('storeData.highlights.flexiblePricing')}
                onCheckedChange={(value) => {
                  if (typeof value === 'boolean') {
                    form.setValue(
                      'storeData.highlights.flexiblePricing',
                      value
                    );
                  }
                }}
              />
              <Label htmlFor='flexiblePricing'>Flexible Pricing</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox
                checked={form.watch('storeData.highlights.emergencyService')}
                onCheckedChange={(value) => {
                  if (typeof value === 'boolean') {
                    form.setValue(
                      'storeData.highlights.emergencyService',
                      value
                    );
                  }
                }}
              />
              <Label htmlFor='emergencyService'>Emergency Service</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox
                checked={form.watch('storeData.highlights.matchPrice')}
                onCheckedChange={(value) => {
                  if (typeof value === 'boolean') {
                    form.setValue('storeData.highlights.matchPrice', value);
                  }
                }}
              />
              <Label htmlFor='matchPrice'>Beat or Match Price</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox
                checked={form.watch('storeData.highlights.workGuarantee')}
                onCheckedChange={(value) => {
                  if (typeof value === 'boolean') {
                    form.setValue('storeData.highlights.workGuarantee', value);
                  }
                }}
              />
              <Label htmlFor='workGuarantee'>Service & Work Guarantee</Label>
            </div>
            <div className='flex items-center space-x-2 -my-1'>
              <Checkbox checked />

              <Label htmlFor='establishmentYear' className='whitespace-pre'>
                Year Established
              </Label>

              <Select
                value={
                  form
                    .watch('storeData.highlights.establishmentYear')
                    ?.toString() ?? ''
                }
                onValueChange={(value) => {
                  form.setValue(
                    'storeData.highlights.establishmentYear',
                    Number(value)
                  );
                }}
              >
                <SelectTrigger className='h-6 '>
                  <SelectValue placeholder='Select Year' />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: 100 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <SelectItem
                      key={year}
                      className='capitalize'
                      value={year.toString()}
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center space-x-2 -my-1'>
              <Checkbox
                checked={
                  (form.watch('storeData.highlights.noOfEmployees') ?? 0) > 0
                }
                onCheckedChange={(value) => {
                  if (typeof value !== 'boolean') return;
                  if (!value) {
                    form.setValue(
                      'storeData.highlights.noOfEmployees',
                      undefined
                    );
                    return;
                  }
                  form.setValue(
                    'storeData.highlights.noOfEmployees',
                    value ? 1 : undefined
                  );
                }}
              />

              <Label htmlFor='establishmentYear' className='whitespace-pre'>
                Number of Employees
              </Label>

              <Select
                value={
                  form
                    .watch('storeData.highlights.noOfEmployees')
                    ?.toString() ?? ''
                }
                onValueChange={(value) => {
                  form.setValue(
                    'storeData.highlights.noOfEmployees',
                    Number(value)
                  );
                }}
              >
                <SelectTrigger className='h-6 '>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map(
                    (number) => (
                      <SelectItem
                        key={number}
                        className='capitalize'
                        value={number.toString()}
                      >
                        {number}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center space-x-2 -my-1'>
              <Checkbox
                checked={
                  (form.watch('storeData.highlights.smse') ?? false) === true
                }
                onCheckedChange={(value) => {
                  if (typeof value === 'boolean') {
                    form.setValue('storeData.highlights.smse', value);
                  }
                }}
              />
              <Label htmlFor='smse'>SMSE (Small Business)</Label>
            </div>
          </div>
        </div>
        <div
          aria-hidden={Object.entries(liveValues.storeData.highlights)
            .filter(([key]) => key !== 'noOfEmployees')
            .every(([_, value]) => !value)}
          className='my-2 flex items-center justify-center gap-5 place-items-center rounded-md aria-hidden:hidden ring-2 ring-yellow-500 p-2'
        >
          {liveValues.storeData.highlights.flexiblePricing && (
            <div className='space-y-1 flex flex-col items-center'>
              <img
                src='/images/onboard/flexible.svg'
                alt='flexible pricing'
                height={30}
                width={30}
                className='h-[30px] w-[30px]'
              />
              <p className='text-[8px] text-center whitespace-break-spaces'>
                Flexible Pricing
              </p>
            </div>
          )}
          {liveValues.storeData.highlights.emergencyService && (
            <div className='space-y-1 flex flex-col items-center'>
              <img
                src='/images/onboard/emergency.svg'
                alt='emergency service'
                height={30}
                width={30}
                className='h-[30px] w-[30px]'
              />
              <p className='text-[8px] text-center whitespace-break-spaces'>
                Emergency Service
              </p>
            </div>
          )}
          {liveValues.storeData.highlights.matchPrice && (
            <div className='space-y-1 flex flex-col items-center'>
              <img
                src='/images/onboard/match-price.svg'
                alt='beat or match price'
                height={30}
                width={30}
                className='h-[30px] w-[30px]'
              />
              <p className='text-[8px] text-center whitespace-break-spaces'>
                <span className='whitespace-pre'>Beat or Match</span> Price
              </p>
            </div>
          )}
          {liveValues.storeData.highlights.workGuarantee && (
            <div className='space-y-1 flex flex-col items-center'>
              <img
                src='/images/onboard/service.svg'
                alt='work guarantee'
                height={30}
                width={30}
                className='h-[30px] w-[30px]'
              />
              <p className='text-[8px] text-center whitespace-break-spaces'>
                <span className='whitespace-pre'>Service & Work</span>{' '}
                Guaranteed
              </p>
            </div>
          )}
          {liveValues.storeData.highlights.establishmentYear && (
            <div className='space-y-1 flex flex-col items-center'>
              <img
                src='/images/onboard/established.svg'
                alt='employees'
                height={30}
                width={30}
                className='h-[30px] w-[30px]'
              />
              <p className='text-[8px] text-center whitespace-break-spaces'>
                Established in{' '}
                {liveValues.storeData.highlights.establishmentYear}
              </p>
            </div>
          )}
          {liveValues.storeData.highlights.smse && (
            <div className='space-y-1 flex flex-col items-center'>
              <img
                src='/images/onboard/small-business.svg'
                alt='sms'
                height={30}
                width={30}
                className='h-[30px] w-[30px]'
              />
              <p className='text-[8px] text-center whitespace-break-spaces'>
                Small Business
              </p>
            </div>
          )}
        </div>
        {liveValues.country === 'US' && (
          <FormField
            label='Timezone'
            error={form.formState.errors.storeData?.timeZone?.message}
            name='storeData.timeZone'
          >
            <Select
              value={liveValues.storeData.timeZone}
              onValueChange={(value) => {
                form.setValue('storeData.timeZone', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent>
                {US_TIME_ZONES.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}
        <FormField
          label='Profile Logo'
          name='logo'
          error={form.formState.errors.logo?.message}
        >
          <ImageUploader
            files={liveValues.logo ? [liveValues.logo] : []}
            onChange={(files) => {
              form.setValue('logo', files[0]);
            }}
            title='Upload Profile Image'
            maxFiles={1}
            fileMetadata={{
              purpose: 'STORE_ASSETS',
            }}
          />
        </FormField>
        <FormField
          label='Banner'
          name='banner'
          error={form.formState.errors.banner?.message}
        >
          <ImageUploader
            files={liveValues.banner ? [liveValues.banner] : []}
            onChange={(files) => {
              form.setValue('banner', files[0]);
            }}
            title='Upload Banner Image'
            maxFiles={1}
            fileMetadata={{
              purpose: 'STORE_ASSETS',
            }}
            aspectRatio={16 / 9}
          />
        </FormField>
        <Textarea
          label='About the Business'
          placeholder='Enter your business description'
          {...form.register('storeData.about')}
          error={form.formState.errors.storeData?.about?.message}
        />
        {liveValues.storeData.timings && (
          <div className='space-y-2'>
            <Label htmlFor='storeData.timings'>Hours of Operation</Label>
            <TimeRangeSelector
              timings={liveValues.storeData.timings}
              setTimings={(timings) => {
                form.setValue('storeData.timings', timings);
              }}
            />
          </div>
        )}
        <FormField label='How can i help' name='how_can_i_help'>
          {liveValues.storeData.howCanWeHelp?.map((_, index) => (
            <div className='relative' key={index}>
              <Input
                key={index}
                placeholder='Enter how your business can help'
                {...form.register(`storeData.howCanWeHelp.${index}`)}
              />
              <button
                type='button'
                onClick={() => {
                  form.setValue(
                    'storeData.howCanWeHelp',
                    liveValues.storeData.howCanWeHelp?.filter(
                      (_, i) => i !== index
                    )
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
              form.setValue('storeData.howCanWeHelp', [
                ...(liveValues.storeData.howCanWeHelp ?? []),
                '',
              ]);
            }}
          >
            + Add More
          </Button>
        </div>
        <FormField label='Specialities' name='specialities'>
          {liveValues.storeData.specialities?.map((_, index) => (
            <div className='relative' key={index}>
              <Input
                key={index}
                placeholder='Enter your business specialities'
                {...form.register(`storeData.specialities.${index}`)}
              />
              <button
                type='button'
                onClick={() => {
                  form.setValue(
                    'storeData.specialities',
                    liveValues.storeData.specialities?.filter(
                      (_, i) => i !== index
                    )
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
              form.setValue('storeData.specialities', [
                ...(liveValues.storeData.specialities ?? []),
                '',
              ]);
            }}
          >
            + Add More
          </Button>
        </div>
      </form>
    </main>
  );
}

export function useStoreData() {
  const axios = useAxios();
  const currentStore = useSession().currentStore;

  return useQuery({
    queryKey: ['store-data'],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store found');
      const response = await axios.get<TResponse<TStoreData>>(
        `/store/${currentStore._id}`
      );
      return response.data.data;
    },
    enabled: !!currentStore,
  });
}

export type TStoreData = ISellerStore & {
  storeData: TFormSchema['storeData'] & {
    _id: string;
  };
};
