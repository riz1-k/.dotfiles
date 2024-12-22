import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import TimerComponent from '@/components/global/Timer';
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
import { env } from '@/lib/utils/env';
import { getErrorMessage } from '@/lib/utils';
import { useAxios } from '@/lib/hooks/useAxios';
import { useSession } from '@/lib/hooks/useSession';

import { UpdateIcons } from './UpdateIocns';
import { Navigate } from '@tanstack/react-router';
const validator = z.object({
  email: z.string().email().optional(),
});

export default function UpdateEmail() {
  const { data } = useSession();
  const account = data?.account;
  const axios = useAxios();
  const [email, setEmail] = useState(false);
  const [modal, setModal] = useState(false);

  const emailHookForm = useForm<z.infer<typeof validator>>({
    defaultValues: {
      email: account?.email,
    },
    resolver: zodResolver(validator),
  });

  const emailUpdateFun = useMutation({
    mutationFn: async (val: z.infer<typeof validator>) => {
      await axios.put(`${env.AUTH_URL}/account/${account?._id}`, {
        email: val.email,
      });
    },
    onSuccess: () => {
      setEmail(false);
      setModal(true);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
  return (
    <div>
      <VerifyEmail
        open={modal}
        setOpen={setModal}
        email={emailHookForm.getValues().email ?? ''}
        setValue={() => emailHookForm.reset()}
      />
      <form
        action=''
        onSubmit={emailHookForm.handleSubmit((val) => {
          emailUpdateFun.mutate(val);
        })}
        className='flex flex-col gap-y-5'
      >
        <div className='w-full'>
          <div className='mb-2 flex items-center gap-x-1'>
            <Label>Email</Label>
            {data?.account?.emailVerified ? (
              <p className='text-xs font-semibold text-success'>Verified</p>
            ) : (
              <p className='text-xs font-semibold text-destructive'>
                * Not Verified
              </p>
            )}
          </div>
          <Input
            placeholder='Enter your email'
            type='email'
            disabled={!email || emailUpdateFun.isPending}
            icon={
              <UpdateIcons
                open={email}
                setOpen={setEmail}
                setValue={() => emailHookForm.reset()}
                edit={emailHookForm.watch().email === account?.email}
              />
            }
            {...emailHookForm.register('email')}
          />
        </div>
      </form>
    </div>
  );
}

function VerifyEmail({
  open,
  setOpen,
  email,
  setValue,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  email: string;
  setValue: () => void;
}) {
  const validtor = z.object({
    otp: z.string().length(6, 'Invalid OTP'),
  });
  type TEmailForm = z.infer<typeof validtor>;
  const form = useForm<TEmailForm>({
    defaultValues: undefined,
    resolver: zodResolver(validtor),
  });

  const axios = useAxios();
  const { data, isLoading } = useSession();

  const account = useMemo(() => {
    if (data && !isLoading) {
      return data?.account;
    }
    return null;
  }, [data, isLoading]);

  const onSubmit = useMutation({
    mutationFn: async () => {
      await axios.post(
        `${env.FRONTEND_URL}/api/${env.ENVIRONMENT}/auth/change-email`,
        {
          newEmail: email,
          code: form.getValues().otp,
        },
        {
          withCredentials: true,
          params: {
            authMode: 'COOKIE',
          },
        }
      );
      toast.success('Email changed successfully');
    },
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const resendOtp = useMutation({
    mutationFn: async () => {
      await axios.put(`${env.AUTH_URL}/account/${account?._id}`, {
        email,
      });
      toast.success(`OTP Sent to ${email}`);
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
  }, [open]);

  if (!data) {
    return <Navigate to='/login' />;
  }

  return (
    <>
      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent>
          <CredenzaHeader className='text-left'>
            <CredenzaTitle className='my-5 text-center'>
              Verify Your Email Address
            </CredenzaTitle>
            <CredenzaDescription className='text-center'>
              Please verify your updated email address {email}
            </CredenzaDescription>
          </CredenzaHeader>
          <div>
            <>
              <form
                className='flex flex-col items-center gap-y-5'
                onSubmit={form.handleSubmit(() => {
                  onSubmit.mutate();
                })}
              >
                <Label className='mt-5'>Enter OTP</Label>
                <InputOTP
                  maxLength={6}
                  value={form.watch('otp')}
                  onChange={(value) => form.setValue('otp', value)}
                  className='mt-1 border border-foreground'
                >
                  <InputOTPGroup className='mt-5 gap-x-3'>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className='rounded-md border border-border'
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <p className='mt-1 text-sm text-destructive'>
                  {form.formState.errors.otp?.message}
                </p>
                <TimerComponent onClick={resendOtp.mutate} />
                <div className='flex w-full items-center justify-between gap-4 '>
                  <Button
                    type='button'
                    onClick={() => {
                      setValue();
                      setOpen(false);
                    }}
                    variant={'outline'}
                    className='w-full'
                  >
                    Close
                  </Button>
                  <Button
                    variant={'default'}
                    className='w-full'
                    type='submit'
                    isLoading={onSubmit.isPending}
                  >
                    Verify
                  </Button>
                </div>
              </form>
            </>
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
