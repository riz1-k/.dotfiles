import { useMutation } from '@tanstack/react-query';
import { type ReactNode, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from '@/components/ui/credenza';
import { getErrorMessage } from '@/lib/utils';
import { useAxios } from '@/lib/hooks/useAxios';
import { useSession } from '@/lib/hooks/useSession';
import { type TSession } from '@/types/Tsession';

import TimerComponent from '@/components/global/Timer';
import { Navigate, useRouter } from '@tanstack/react-router';
import { env } from '@/lib/utils/env';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function EmailVerficationModal(): ReactNode {
  const router = useRouter();
  const axios = useAxios();
  const [otp, setOtp] = useState('');
  const { data } = useSession();
  const email = data?.account.email;
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(!data?.account.emailVerified);

  const { updateSession } = useSession();

  const onSubmit = useMutation({
    mutationFn: async () => {
      if (!otp) {
        toast.error('Please enter the OTP');
        return;
      }
      const res = await axios.put(`${env.AUTH_URL}/auth/email`, {
        code: otp,
        type: 'CONSUMER',
      });
      updateSession(res.data.data as TSession);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const resendOtp = useMutation({
    mutationFn: async () => {
      await axios.post(`${env.AUTH_URL}/auth/email`, {
        email: data?.account?.email,
      });
      toast.success(`OTP Sent to ${data?.account?.email}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    //after 30 sec then resendOtp
    const timer = setTimeout(() => {
      if (open) {
        resendOtp.mutate();
      }
    }, 30000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!data) {
    return <Navigate to='/login' />;
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaContent>
        <CredenzaHeader className='text-left'>
          <CredenzaTitle>Verify Your Email Address?</CredenzaTitle>
          <CredenzaDescription>
            Your Email address is not verified. Please verify your email address{' '}
            {email}
          </CredenzaDescription>
          <CredenzaDescription>
            {!show && (
              <div className='flex items-center gap-x-2'>
                <p className='text-sm text-primary'>
                  Not <span className='font-medium'>{email}?</span>
                </p>
                <button
                  type='button'
                  className='text-sm text-primary underline'
                  onClick={() => setShow(true)}
                >
                  Change
                </button>
              </div>
            )}
            {show && <ChangeEmail setShow={setShow} />}
          </CredenzaDescription>
        </CredenzaHeader>
        <form
          action=''
          className='mt-7 flex flex-col items-center gap-y-8'
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit.mutate();
          }}
        >
          <div className='text-center'>
            <Label>OTP</Label>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              className='mt-1 border border-foreground'
            >
              <InputOTPGroup className='mt-5 gap-x-3'>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className='rounded-md border border-border'
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className='flex w-full items-center justify-center'>
            <TimerComponent onClick={resendOtp.mutate} />
          </div>
          <div className='flex w-full items-center justify-between gap-3'>
            <Button
              type='button'
              variant={'outline'}
              onClick={() => router.history.back()}
              className='!w-full'
            >
              Go to Homepage
            </Button>
            <Button
              variant={'default'}
              className='!w-full'
              type='submit'
              isLoading={onSubmit.isPending}
            >
              Verify
            </Button>
          </div>
        </form>
      </CredenzaContent>
    </Credenza>
  );
}

const TChangeEmail = z.object({
  newEmail: z
    .string()
    .email({ message: 'Please enter a new valid email address' }),
});
type TChangeEmail = z.infer<typeof TChangeEmail>;
function ChangeEmail({ setShow }: { setShow: (bool: boolean) => void }) {
  const { updateSession } = useSession();
  const axios = useAxios();

  const TChangeEmailForm = useForm<TChangeEmail>({
    resolver: zodResolver(TChangeEmail),
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (value: TChangeEmail) => {
      const res = await axios.post(`${env.AUTH_URL}/auth/switch-email`, {
        newEmail: value.newEmail,
      });
      return res.data.data as TSession;
    },
    onSuccess: (value) => {
      updateSession(value);
      toast.success('Email Changed Successfully');
      setShow(false);
    },

    onError: (error) => {
      console.error(error);
      toast.error(getErrorMessage(error));
    },
  });
  function onSubmit(data: TChangeEmail) {
    mutate(data);
  }

  return (
    <form onSubmit={TChangeEmailForm.handleSubmit(onSubmit)} className='mt-2'>
      <Input
        type='email'
        placeholder='New Email'
        {...TChangeEmailForm.register('newEmail')}
        error={TChangeEmailForm.formState.errors?.newEmail?.message}
      />
      <div className='mt-4 flex justify-between gap-4'>
        <Button
          type='button'
          variant='destructive'
          onClick={() => setShow(false)}
          className='w-full'
        >
          Cancel
        </Button>
        <Button
          type='submit'
          isLoading={isPending}
          variant={'default'}
          className='w-full'
        >
          Change Email
        </Button>
      </div>
    </form>
  );
}
