import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BUSINESS_LISTING_TYPES,
  businessFormSchema,
} from '../-constants/business-form-schema';
import { z } from 'zod';
import { useAxios } from '@/lib/hooks/useAxios';
import { useParams } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormField } from '@/components/global/FormField';
import { Trash } from 'lucide-react';
import TimeRangeSelector from './time-range-selector';
import ImageUploader from '@/components/global/ImageUploader';
import { US_TIME_ZONES } from '../-constants/us-time-zones';
import { Checkbox } from '@/components/ui/checkbox';
import ContactInfoDialog from './contact-ino-dialog';
import {
  getCountryName,
  getErrorMessage,
  handleFormError,
  transformPayload,
} from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { TFile } from '@/lib/file-utils';
import { TCountryCode } from '@/lib/hooks/useRegion';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { alertConfirm } from '@/components/ui/alert-confirm-dialog';

const formSchema = businessFormSchema;

type TFormSchema = z.infer<typeof formSchema>;

export function BusinessProfileForm() {
  const { data: storeData, isLoading } = useStoreData();
  const [isEditing, setIsEditing] = useState(false);
  const storeId = useParams({
    from: '/_dashboard/dashboard//stores/$id/business-profile',
  }).id;
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
        contactInfo: [],
        highlights: {
          flexiblePricing: false,
          emergencyService: false,
          matchPrice: false,
          workGuarantee: false,
          establishmentYear: new Date().getFullYear(),
          noOfEmployees: undefined,
          smse: false,
        },
      },
    },
  });

  const liveValues = form.watch();

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

  const axios = useAxios();
  const queryClient = useQueryClient();

  const onSubmit = useMutation({
    mutationFn: async (data: TFormSchema) => {
      await axios.put('/store/' + storeId, transformPayload(data));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['store-data', storeId],
        exact: true,
      });
      toast.success('Business profile updated successfully');
      setIsEditing(false);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });

  const handleCancel = () => {
    setIsEditing(false);
    if (storeData) {
      form.reset({
        storeName: storeData.storeName,
        logo: storeData.logo,
        banner: storeData.banner,
        country: storeData.country,
        storeData: storeData.storeData,
      });
    }
  };

  if (isLoading) return 'Loading...';

  if (!storeData) return 'No store found';

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-2xl font-bold'>Business Profile</CardTitle>
        {!isEditing ? (
          <Button variant='outline' onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit((vals) => {
            alertConfirm({
              title: 'Are you sure you want to update this business profile?',
              description:
                'This will update the business profile and connot be undone.',
              onSubmit: () => onSubmit.mutate(vals),
              submitText: 'Update',
              cancelText: 'Cancel',
            });
          }, handleFormError)}
          className={`space-y-8 ${!isEditing ? 'pointer-events-none opacity-70' : ''}`}
        >
          <div className='grid gap-6 md:grid-cols-2'>
            <FormField
              label='Listed as an'
              name='storeData.listingType'
              error={form.formState.errors.storeData?.listingType?.message}
            >
              <RadioGroup
                value={liveValues.storeData.listingType}
                onValueChange={(value) => {
                  form.setValue(
                    'storeData.listingType',
                    value as (typeof BUSINESS_LISTING_TYPES)[number]
                  );
                  form.trigger('storeData.listingType');
                }}
                className='flex space-x-4 mt-2'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='INDIVIDUAL' id='individual' />
                  <Label htmlFor='individual'>Individual</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='BUSINESS' id='business' />
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
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
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
                    form.setValue('storeData.timezone', 'Asia/Kolkata');
                  } else if (val === 'SA') {
                    form.setValue('storeData.timezone', 'Asia/Riyadh');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Country'>
                    {liveValues.country
                      ? getCountryName(liveValues.country)
                      : ''}
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

            {liveValues.country === 'US' && (
              <FormField
                label='Timezone'
                error={form.formState.errors.storeData?.timezone?.message}
                name='storeData.timezone'
              >
                <Select
                  value={liveValues.storeData.timezone}
                  onValueChange={(value) => {
                    form.setValue('storeData.timezone', value);
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
          </div>

          <Separator />

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Contact Information</h3>
            <div className='grid gap-4 md:grid-cols-2'>
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
            </div>
            {liveValues.storeData.contactInfo?.map((contactInfo, index) => (
              <div className='relative' key={contactInfo.fieldType + index}>
                <Input
                  label={`${contactInfo.fieldType.toLowerCase()} ${contactInfo.type ? `(${contactInfo.type})` : ''}`}
                  value={contactInfo.value}
                  placeholder={contactInfo.type}
                />
                <button
                  type='button'
                  onClick={() => {
                    form.setValue(
                      'storeData.contactInfo',
                      liveValues.storeData.contactInfo.filter(
                        (_, i) => i !== index
                      )
                    );
                  }}
                  className='absolute -right-2 top-0 text-destructive'
                >
                  <Trash className='w-4 h-4' />
                </button>
              </div>
            ))}
            <div className='flex justify-end'>
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

          <Separator />

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Highlights</h3>
            <div className='grid gap-4 sm:grid-cols-2'>
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
                <Label>Flexible Pricing</Label>
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
                <Label>Emergency Service</Label>
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
                <Label>Beat or Match Price</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  checked={form.watch('storeData.highlights.workGuarantee')}
                  onCheckedChange={(value) => {
                    if (typeof value === 'boolean') {
                      form.setValue(
                        'storeData.highlights.workGuarantee',
                        value
                      );
                    }
                  }}
                />
                <Label>Service & Work Guarantee</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox checked />
                <Label className='whitespace-pre'>Year Established</Label>
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
                  <SelectTrigger className='w-24'>
                    <SelectValue placeholder='Select Year' />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: 100 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  checked={
                    (form.watch('storeData.highlights.noOfEmployees') ?? 0) > 0
                  }
                  onCheckedChange={(value) => {
                    if (typeof value !== 'boolean') return;
                    form.setValue(
                      'storeData.highlights.noOfEmployees',
                      value ? 1 : undefined
                    );
                  }}
                />
                <Label className='whitespace-pre'>Number of Employees</Label>
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
                  <SelectTrigger className='w-24'>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 100 }, (_, i) => i + 1).map(
                      (number) => (
                        <SelectItem key={number} value={number.toString()}>
                          {number}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex items-center space-x-2'>
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
                <Label>SMSE (Small Business)</Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Profile Media</h3>
            <div className='grid gap-6 md:grid-cols-2'>
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
                    storeId,
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
            </div>
          </div>

          <Textarea
            label='About the Business'
            placeholder='Enter your business description'
            {...form.register('storeData.about')}
            error={form.formState.errors.storeData?.about?.message}
          />

          {liveValues.storeData.timings && (
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold'>Hours of Operation</h3>
              <TimeRangeSelector
                timings={liveValues.storeData.timings}
                setTimings={(timings) => {
                  form.setValue('storeData.timings', timings);
                }}
              />
            </div>
          )}

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>How can we help?</h3>
            {liveValues.storeData.howCanWeHelp?.map((_, index) => (
              <div className='relative' key={index}>
                <Input
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
                  className='absolute -right-2 top-0 text-destructive'
                >
                  <Trash className='w-4 h-4' />
                </button>
              </div>
            ))}
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
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Specialities</h3>
            {liveValues.storeData.specialities?.map((_, index) => (
              <div className='relative' key={index}>
                <Input
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
                  className='absolute -right-2 top-0 text-destructive'
                >
                  <Trash className='w-4 h-4' />
                </button>
              </div>
            ))}
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
          </div>

          <div className='flex justify-end gap-5'>
            {isEditing && (
              <Button
                type='submit'
                variant='accent'
                isLoading={onSubmit.isPending}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function useStoreData() {
  const axios = useAxios();
  const storeId = useParams({
    from: '/_dashboard/dashboard//stores/$id/business-profile',
  }).id;

  return useQuery({
    queryKey: ['store-data', storeId],
    queryFn: async () => {
      const response = await axios.get<TResponse<TStoreData>>(
        `/store/${storeId}`
      );
      return response.data.data;
    },
    enabled: !!storeId,
  });
}

export type TStoreData = ISellerStore & {
  storeData: TFormSchema['storeData'] & {
    _id: string;
  };
};

interface ISellerStore {
  _id: string;
  storeID: string;
  country: TCountryCode;
  kycStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  storeName: string;
  storeURL: string;
  logo: TFile;
  banner: TFile;
  status: 'ACTIVE' | 'INACTIVE';
  storeType: string;
  isVerified: boolean;
}

export const AVAILABLE_COUNTRIES = [
  {
    label: 'India',
    value: 'IN',
  },
  {
    label: 'United States',
    value: 'US',
  },
  {
    label: 'Saudi Arabia',
    value: 'SA',
  },
] as const;
