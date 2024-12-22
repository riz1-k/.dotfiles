/*
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';

import { GoogleLogin } from '@react-oauth/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaKey } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { z } from 'zod';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCurrentStore, useSession } from '@/lib/hooks/useSession';
import { getErrorMessage } from '@/lib/utils';
import { TSession } from '@/types/Tsession';
import { env } from '@/lib/utils/env';

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className='flex flex-col items-center rounded-t-[30px] bg-background p-4 text-foreground'>
      <h1 className='my-5 text-3xl font-bold'>Welcome Back</h1>
      <LoginForm />
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
          New User? Join now!
          <Link to={'/signup'} className='font-semibold text-foreground'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

const loginSchema = z.object({
  username: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  code: z.string().length(6, 'Invalid code').optional(),
});

type TLoginForm = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { updateSession } = useSession();
  const [, setmfaDialog] = useState(false);

  const loginForm = useForm<TLoginForm>({
    defaultValues: undefined,
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: TLoginForm) => {
      const res = await axios.post(
        `/api/${env.ENVIRONMENT}/auth/seller-login`,
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

      toast.success('Login Successful');

      const store = getCurrentStore(data);

      if (!store) {
        navigate({
          to: '/onboard',
        });
      } else {
        navigate({
          to: '/dashboard',
        });
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <>
      <form
        onSubmit={loginForm.handleSubmit((val) => {
          onSubmit.mutate(val);
        })}
        className='flex w-full flex-col gap-6'
      >
        <Input
          type='email'
          label='Enter your email'
          placeholder='Enter your email'
          className='rounded-full'
          {...loginForm.register('username')}
          error={loginForm.formState.errors?.username?.message}
          icon={<IoMail size={14} />}
        />

        <Input
          type='password'
          placeholder='Enter your password'
          label='Create a password'
          className='rounded-full'
          {...loginForm.register('password')}
          icon={<FaKey size={14} />}
          error={loginForm.formState.errors?.password?.message}
        />

        <Link
          to={'/forgot-password'}
          className='ml-auto text-sm font-medium text-ring '
        >
          Forgot password?
        </Link>
        <Button
          type='submit'
          className='h-12 rounded-full bg-ring text-lg text-primary-foreground'
        >
          Sign in
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
        isMFAEnabled: boolean;
      };

      if (data.isMFAEnabled) {
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

// with mfa

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';

import { GoogleLogin } from '@react-oauth/google';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaKey } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { z } from 'zod';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCurrentStore, useSession } from '@/lib/hooks/useSession';
import { getErrorMessage } from '@/lib/utils';
import { TSession } from '@/types/Tsession';
import { env } from '@/lib/utils/env';
import Loader from '@/components/global/Loader';
import MfaCodeDialog from '@/components/global/MfaCodeDialog';
import GoogleMfaCodeDialog from '@/components/global/GoogleMfaCodeDialog';

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const router = useNavigate();
  const [mfaDialog, setmfaDialog] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { updateSession: setAuth } = useSession();
  const [code, setCode] = useState('');

  const handleGoogleLogin = useMutation({
    mutationFn: async (token: string) => {
      const res = await axios.post(
        `/api/${env.ENVIRONMENT}/auth/login`,
        { token },
        { params: { authMode: 'GOOGLE' } }
      );
      if (res.data.data.isMFAEnabled) {
        setmfaDialog(true);
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
        <GoogleMfaCodeDialog
          open={mfaDialog}
          setOpen={setmfaDialog}
          code={code}
          setCode={setCode}
          token={token}
        />
      </>
      <h1 className='my-5 text-3xl font-bold'>Welcome Back</h1>
      <LoginForm />
      <div className='mt-4 flex w-full flex-col gap-4'>
        <div className='flex items-center justify-between gap-2'>
          <hr className='h-[0.1px] w-full bg-border' />
          <span>or</span>
          <hr className='h-[0.1px] w-full bg-border' />
        </div>
        <div className='flex w-full justify-center'>
          <GoogleLoginButton
            onSuccess={async (token) => {
              await handleGoogleLogin.mutateAsync(token);
            }}
          />
        </div>
        <div className='mt-4 flex items-center justify-center gap-2 font-medium  text-muted-foreground'>
          New User? Join now!
          <Link to={'/signup'} className='font-semibold text-foreground'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

const loginSchema = z.object({
  username: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  code: z.string().length(6, 'Invalid code').optional(),
});

type TLoginForm = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const { updateSession } = useSession();
  const [mfaDialog, setmfaDialog] = useState(false);
  const [code, setCode] = useState('');

  const loginForm = useForm<TLoginForm>({
    defaultValues: undefined,
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useMutation({
    mutationFn: async (val: TLoginForm) => {
      const res = await axios.post(
        `/api/${env.ENVIRONMENT}/auth/seller-login`,
        val,
        {
          params: {
            authMode: 'COOKIE',
          },
        }
      );
      updateSession(res.data.data as TSession);
      const data = res.data.data as TSession;
      if (data.isMFAEnabled) {
        console.log('mfa enabled');
        setmfaDialog(true);
        return;
      }

      toast.success('Login Successful');

      const store = getCurrentStore(data);

      if (!store) {
        navigate({
          to: '/onboard',
        });
      } else {
        navigate({
          to: '/dashboard',
        });
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(getErrorMessage(error));
    },
  });

  const MFALogin = useMutation({
    mutationFn: async ({ code, password, username }: TLoginForm) => {
      const res = await axios.post(
        `/api/${env.ENVIRONMENT}/auth/login`,
        { username, password, code },
        {
          params: { authMode: 'COOKIE' },
        }
      );
      const data = res.data.data as TSession;
      updateSession(data);

      const store = getCurrentStore(data);

      if (!store) {
        navigate({
          to: '/onboard',
        });
      } else {
        navigate({
          to: '/dashboard',
        });
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
  return (
    <>
      <Loader isLoading={onSubmit.isPending || MFALogin.isPending} />
      <MfaCodeDialog
        open={mfaDialog}
        setOpen={setmfaDialog}
        code={code}
        setCode={setCode}
        onClicks={() => {
          MFALogin.mutate({ ...loginForm.getValues(), code });
        }}
      />
      <form
        onSubmit={loginForm.handleSubmit((val) => {
          onSubmit.mutate(val);
        })}
        className='flex w-full flex-col gap-6'
      >
        <Input
          type='email'
          label='Enter your email'
          placeholder='Enter your email'
          className='rounded-full'
          {...loginForm.register('username')}
          error={loginForm.formState.errors?.username?.message}
          icon={<IoMail size={14} />}
        />

        <Input
          type='password'
          placeholder='Enter your password'
          label='Create a password'
          className='rounded-full'
          {...loginForm.register('password')}
          icon={<FaKey size={14} />}
          error={loginForm.formState.errors?.password?.message}
        />

        <Link
          to={'/forgot-password'}
          className='ml-auto text-sm font-medium text-ring '
        >
          Forgot password?
        </Link>
        <Button
          type='submit'
          className='h-12 rounded-full bg-ring text-lg text-primary-foreground'
        >
          Sign in
        </Button>
      </form>
    </>
  );
}

interface IProps {
  onSuccess: (token: string) => Promise<void>;
}
export function GoogleLoginButton(props: IProps) {
  const { onSuccess } = props;
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (credentialResponse.credential) {
          void onSuccess(credentialResponse.credential);
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
