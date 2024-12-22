/*
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaKey } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from '@/lib/hooks/useSession';
import { getErrorMessage } from '@/lib/utils';
import { env } from '@/lib/utils/env';
import { TSession } from '@/types/Tsession';
import { toast } from 'sonner';
import Loader from '@/components/global/Loader';

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className='flex flex-col items-center rounded-t-[30px] bg-background p-4 text-foreground'>
      <h1 className='my-5 text-3xl font-bold'>Create an account</h1>
      <SignupForm />
      <div className='mt-4 flex w-full flex-col gap-4'>
        <div className='flex items-center justify-between gap-2'>
          <hr className='h-[0.1px] w-full bg-border' />
          <span>or</span>
          <hr className='h-[0.1px] w-full bg-border' />
        </div>
        <div className='flex w-full justify-center'>
          <GoogleLoginButton />
        </div>
        <div className='mt-4 flex items-center justify-center gap-2 font-medium  text-muted-foreground'>
          Already have an account?
          <Link to={'/login'} className='font-semibold text-foreground'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type TSignupForm = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const navigate = useNavigate();
  const { updateSession } = useSession();
  const [, setmfaDialog] = useState(false);

  const signupForm = useForm<TSignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: TSignupForm) => {
      const res = await axios.post(
        `/api/${env.ENVIRONMENT}/auth/seller-register`,
        val,
        {
          params: {
            authMode: 'COOKIE',
          },
        }
      );

      const data = res.data.data as TSession;
      updateSession(data);

      if (data.account.isMfaEnabled) {
        setmfaDialog(true);
        return;
      }

      toast.success('Signup Successful');

      navigate({
        to: '/verify-email',
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <>
      <Loader isLoading={onSubmit.isPending} />
      <form
        onSubmit={signupForm.handleSubmit((val) => {
          onSubmit.mutate(val);
        })}
        className='flex w-full flex-col gap-6'
      >
        <Input
          type='email'
          label='Enter your email'
          placeholder='Enter your email'
          className='rounded-full'
          {...signupForm.register('email')}
          error={signupForm.formState.errors?.email?.message}
          icon={<IoMail size={14} />}
        />

        <Input
          type='password'
          placeholder='Enter your password'
          label='Create a password'
          className='rounded-full'
          {...signupForm.register('password')}
          icon={<FaKey size={14} />}
          error={signupForm.formState.errors?.password?.message}
        />

        <Button
          type='submit'
          isLoading={onSubmit.isPending}
          className='h-12 rounded-full bg-ring text-lg text-primary-foreground'
        >
          Sign up
        </Button>
      </form>
    </>
  );
}

function GoogleLoginButton() {
  const router = useNavigate();
  const { updateSession } = useSession();
  const [, setmfaDialog] = useState(false);
  const onSuccess = useMutation({
    mutationFn: async (credential: any) => {
      const res = await axios.post(`/api/${env.ENVIRONMENT}/auth/login`, {
        googleId: credential.id_token,
        authMode: 'GOOGLE',
      });

      updateSession(res.data.data as TSession);
      const data = res.data.data as {
        isMfaEnabled: boolean;
      };

      if (data.isMfaEnabled) {
        setmfaDialog(true);
        return;
      }

      toast.success('Login Successful');
      router({
        to: '/dashboard',
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (credentialResponse.credential) {
          void onSuccess.mutate(credentialResponse.credential);
        } else {
          toast.error('No credential found.');
        }
      }}
      onError={() => {
        toast.error('Google login failed');
      }}
      useOneTap
      shape='circle'
      logo_alignment='center'
      width={'300px'}
      text='continue_with'
      size='large'
    />
  );
}
*/

//with mfa
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaKey } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from '@/lib/hooks/useSession';
import { getErrorMessage } from '@/lib/utils';
import { env } from '@/lib/utils/env';
import { TSession } from '@/types/Tsession';
import { toast } from 'sonner';
import Loader from '@/components/global/Loader';
import GoogleMfaCodeDialoge from '@/components/global/GoogleMfaCodeDialog';
import { GoogleLoginButton } from './login.route';

export const Route = createFileRoute('/_auth/signup')({
  component: SignupPage,
});

function SignupPage() {
  const { updateSession: setAuth } = useSession();
  const router = useNavigate();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const handleGoogleLogin = useMutation({
    mutationFn: async (token: string) => {
      const res = await axios.post(
        `/api/${env.ENVIRONMENT}/auth/login`,
        { token },
        { params: { authMode: 'GOOGLE' } }
      );

      if (res.data.data.isMFAEnabled) {
        setOpen(true);
        setToken(token);
        return;
      }

      setAuth(res.data.data as TSession);
      router({
        to: '/dashboard',
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <div className='flex flex-col items-center rounded-t-[30px] bg-background p-4 text-foreground'>
      <>
        <GoogleMfaCodeDialoge
          open={open}
          setOpen={setOpen}
          code={code}
          setCode={setCode}
          token={token}
        />
      </>
      <h1 className='my-5 text-3xl font-bold'>Create an account</h1>
      <SignupForm />
      <div className='mt-4 flex w-full flex-col gap-4'>
        <div className='flex items-center justify-between gap-2'>
          <hr className='h-[0.1px] w-full bg-border' />
          <span>or</span>
          <hr className='h-[0.1px] w-full bg-border' />
        </div>
        <div className='flex w-full justify-center'>
          <div className='flex w-full justify-center'>
            <GoogleLoginButton
              onSuccess={async (token) => {
                await handleGoogleLogin.mutateAsync(token);
              }}
            />
          </div>{' '}
        </div>
        <div className='mt-4 flex items-center justify-center gap-2 font-medium  text-muted-foreground'>
          Already have an account?
          <Link to={'/login'} className='font-semibold text-foreground'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type TSignupForm = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const navigate = useNavigate();
  const { updateSession } = useSession();
  const [, setmfaDialog] = useState(false);

  const signupForm = useForm<TSignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: TSignupForm) => {
      const res = await axios.post(
        `/api/${env.ENVIRONMENT}/auth/seller-register`,
        val,
        {
          params: {
            authMode: 'COOKIE',
          },
        }
      );

      const data = res.data.data as TSession;
      updateSession(data);

      if (data.account.isMfaEnabled) {
        setmfaDialog(true);
        return;
      }

      toast.success('Signup Successful');

      navigate({
        to: '/verify-email',
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <>
      <Loader isLoading={onSubmit.isPending} />
      <form
        onSubmit={signupForm.handleSubmit((val) => {
          onSubmit.mutate(val);
        })}
        className='flex w-full flex-col gap-6'
      >
        <Input
          type='email'
          label='Enter your email'
          placeholder='Enter your email'
          className='rounded-full'
          {...signupForm.register('email')}
          error={signupForm.formState.errors?.email?.message}
          icon={<IoMail size={14} />}
        />

        <Input
          type='password'
          placeholder='Enter your password'
          label='Create a password'
          className='rounded-full'
          {...signupForm.register('password')}
          icon={<FaKey size={14} />}
          error={signupForm.formState.errors?.password?.message}
        />

        <Button
          type='submit'
          isLoading={onSubmit.isPending}
          className='h-12 rounded-full bg-ring text-lg text-primary-foreground'
        >
          Sign up
        </Button>
      </form>
    </>
  );
}
