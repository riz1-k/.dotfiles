import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/utils';
import { useAxios } from '@/lib/hooks/useAxios';
import { env } from '@/lib/utils/env';

const validator = z
  .object({
    oldPassword: z.string().min(8, 'Invalid Password'),
    newPassword: z.string().min(8, 'Invalid Password'),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine(
    (val) => {
      if (val.newPassword !== val.confirmPassword) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: 'confirm password & new password must be same',
      path: ['confirmPassword'],
    }
  );

export default function UpdatePassword() {
  const [open, setOpen] = useState(false);

  const passwordHook = useForm<z.infer<typeof validator>>({
    defaultValues: undefined,
    resolver: zodResolver(validator),
  });

  const axios = useAxios();

  const onSubmit = useMutation({
    mutationFn: async (val: z.infer<typeof validator>) => {
      await axios.post(`${env.AUTH_URL}/auth/change-password`, val);
      toast.success('Password changed successfully');
      setOpen(false);
      passwordHook.reset();
    },
    onError: (error) => {
      const err = getErrorMessage(error);
      toast.error(err);
    },
  });

  return (
    <>
      {open ? (
        <form
          action=''
          onSubmit={passwordHook.handleSubmit((values) => {
            onSubmit.mutate(values);
          })}
          className='flex flex-col gap-y-5'
        >
          <Input
            label='Old Password'
            placeholder='Enter your old password'
            type='password'
            {...passwordHook.register('oldPassword')}
            error={passwordHook.formState.errors.oldPassword?.message}
          />
          <Input
            label='New Password'
            placeholder='Enter your new password'
            type='password'
            {...passwordHook.register('newPassword')}
            error={passwordHook.formState.errors.newPassword?.message}
          />

          <Input
            label='Confirm Password'
            placeholder='Enter your confirm password'
            type='password'
            {...passwordHook.register('confirmPassword')}
            error={passwordHook.formState.errors.confirmPassword?.message}
          />

          <div className='mt-10 flex items-center gap-x-5'>
            <Button
              type='button'
              variant={'outline'}
              onClick={() => setOpen(false)}
              className='w-1/2'
            >
              Cancel
            </Button>
            <Button
              variant={'default'}
              className='w-1/2'
              type='submit'
              isLoading={onSubmit.isPending}
            >
              Update Password
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant={'default'}
          onClick={() => {
            console.log('clicked');
            setOpen(true);
          }}
        >
          Change Password
        </Button>
      )}
    </>
  );
}
