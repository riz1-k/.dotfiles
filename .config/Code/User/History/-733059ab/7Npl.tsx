import { FormField } from '@/components/global/FormField';
import ImageUploader from '@/components/global/ImageUploader';
import TimeRangeSelector, {
  timingsSchema,
} from '@/components/global/TimingSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAxios } from '@/lib/hooks/useAxios';
import { useSession } from '@/lib/hooks/useSession';
import {
  getErrorMessage,
  handleFormError,
  transformPayload,
} from '@/lib/utils';
import { fileValidator } from '@/lib/utils/file-utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export function OnboardFilesForm() {
  const axios = useAxios();
  const { currentStore } = useSession();
  const navigate = useNavigate();

  type FormData = z.infer<typeof onboardFilesSchema>;
  const form = useForm<FormData>({
    resolver: zodResolver(onboardFilesSchema),
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

  const onSubmit = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = transformPayload(data);
      await axios.put(`/store/kyc/${currentStore?._id}`, payload);
    },
    onSuccess: () => {
      navigate({
        to: '/dashboard',
      }).then(() => {});
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
  return (
    <form
      onSubmit={form.handleSubmit(
        (vals) => onSubmit.mutate(vals),
        handleFormError
      )}
      className='flex flex-col gap-5'
    >
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
      <Button isLoading={onSubmit.isPending} variant='accent' type='submit'>
        Submit
      </Button>
    </form>
  );
}

export const onboardFilesSchema = z.object({
  logo: fileValidator,
  banner: fileValidator,
  storeData: z.object({
    about: z
      .string()
      .min(3, 'Must be atleast 3 characters')
      .max(5000, 'Must be atmost 5000 characters')
      .optional(),
    timings: timingsSchema.optional(),
    specialities: z
      .array(
        z
          .string()
          .min(3, {
            message: 'Speciality must be atleast 3 characters',
          })
          .max(150, {
            message: 'Speciality must be atmost 150 characters',
          })
      )
      .optional(),
    howCanWeHelp: z
      .array(
        z
          .string()
          .min(3, {
            message: 'How can we help must be atleast 3 characters',
          })
          .max(500, {
            message: 'How can we help must be atmost 500 characters',
          })
      )
      .optional(),
  }),
});
