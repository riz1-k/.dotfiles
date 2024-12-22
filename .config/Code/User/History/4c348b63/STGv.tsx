import { FormField } from '@/components/global/FormField';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAxios } from '@/lib/hooks/useAxios';
import { getCountryName, getErrorMessage, handleFormError } from '@/lib/utils';
import { parsePhone, phoneSchema } from '@/lib/utils/phone-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import ContactInfoDialog from './add-contact-dialog';
import { TOnboardStep } from '../route';
import { US_TIME_ZONES } from './timezone.constant';
import {
  Credenza,
  CredenzaClose,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
  CredenzaContent,
  CredenzaDescription,
} from '@/components/ui/credenza';

export function OnboardProfileForm(props: {
  setStep: (step: TOnboardStep) => void;
}) {
  type FormData = z.infer<typeof onboardProfileSchema>;
  const axios = useAxios();

  const form = useForm<FormData>({
    resolver: zodResolver(onboardProfileSchema),
    defaultValues: {
      storeData: {
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

  const onSubmit = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axios.post(`/store/kyc`, data);
      console.log(res);
    },
    onSuccess: () => {
      props.setStep('files');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
  const liveValues = form.watch();

  return (
    <form
      onSubmit={form.handleSubmit(
        (vals) => onSubmit.mutate(vals),
        handleFormError
      )}
      className='flex flex-col gap-5'
    >
      <FormField
        label='I am listing as an'
        name='storeData.listingType'
        error={form.formState.errors.storeData?.listingType?.message}
      >
        <RadioGroup
          value={form.watch('storeData.listingType')}
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
          value={form.watch('country')}
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
            {...form.register('fullName')}
            error={form.formState.errors.fullName?.message}
          />

          <Input
            label='Local Phone'
            placeholder='Enter Local phone'
            {...form.register('phoneNumber', {
              required: true,
            })}
            error={form.formState.errors.phoneNumber?.message}
          />

          {form.watch('storeData.contactInfo').map((contactInfo) => (
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
                        (contact) => contact.fieldType !== contactInfo.fieldType
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
                  form.setValue('storeData.highlights.flexiblePricing', value);
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
                  form.setValue('storeData.highlights.emergencyService', value);
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
                form.watch('storeData.highlights.noOfEmployees')?.toString() ??
                ''
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
                {Array.from({ length: 100 }, (_, i) => i + 1).map((number) => (
                  <SelectItem
                    key={number}
                    className='capitalize'
                    value={number.toString()}
                  >
                    {number}
                  </SelectItem>
                ))}
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
              <span className='whitespace-pre'>Service & Work</span> Guaranteed
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
              Established in {liveValues.storeData.highlights.establishmentYear}
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
      <Credenza>
        <CredenzaTrigger asChild>
          <Button className='w-full' variant='accent'>
            Submit
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Submit Confirmation</CredenzaTitle>
            <CredenzaDescription>
              Once submitted, your profile can be updated only after its been
              approved, rejected by the admin.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button variant='destructive'>Cancel</Button>
            </CredenzaClose>
            <Button variant='default' type='submit'>
              Submit
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </form>
  );
}

const LISTING_TYPES = ['INDIVIDUAL', 'BUSINESS'] as const;
export const BUSINESS_CONTACT_TYPES = ['NUMBER', 'SOCIAL', 'WEBSITE'] as const;
const AVAILABLE_COUNTRIES = [
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

const onboardProfileSchema = z.object({
  country: z.enum(['IN', 'US', 'SA'], { message: 'Please select a country' }),
  storeName: z
    .string()
    .min(3, 'Must be atleast 3 characters')
    .max(150, 'Must be atmost 150 characters'),
  storeData: z
    .object({
      contactName: z
        .string()
        .min(3, 'Must be atleast 3 characters')
        .max(150, 'Must be atmost 150 characters'),
      businessEmail: z
        .string()
        .email({ message: 'Please enter a valid email address' }),
      businessPhone: phoneSchema,
      listingType: z.enum(LISTING_TYPES, { message: 'Select a listing type' }),
      contactInfo: z.array(
        z
          .object({
            fieldType: z.enum(BUSINESS_CONTACT_TYPES, {
              message: 'Please select a Contact type',
            }),
            value: z
              .string()
              .min(3, 'Must be atleast 3 characters')
              .max(150, 'Must be atmost 150 characters'),
            type: z
              .string()
              .min(3, 'Must be atleast 3 characters')
              .max(150, 'Must be atmost 150 characters')
              .optional(),
          })
          .superRefine((data, ctx) => {
            if (data.fieldType === 'SOCIAL') {
              if (!data.type) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  fatal: true,
                  message: 'Contact type required for social media',
                  path: ['type'],
                });
              }
              if (!z.string().url().safeParse(data.value).success) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  fatal: true,
                  message: 'Invalid URL',
                  path: ['value'],
                });
              }
            }
            if (data.fieldType === 'NUMBER') {
              const parsed = parsePhone(data.value);
              if (!parsed.isValid) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message:
                    'Invalid number. Number shound be less than 15 characters.',
                  path: ['value'],
                });
              }
            }
          })
      ),
      highlights: z.object({
        flexiblePricing: z.boolean().default(false),
        emergencyService: z.boolean().default(false),
        matchPrice: z.boolean().default(false),
        workGuarantee: z.boolean().default(false),
        establishmentYear: z.number({
          message: 'Establishment year is required',
        }),
        noOfEmployees: z.number().optional(),
        smse: z.boolean().default(false),
      }),
      timeZone: z.string(),
    })
    .strict(),
});
