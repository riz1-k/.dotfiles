'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { env } from '@/lib/utils/env';
import { getErrorMessage } from '@/lib/utils';
import { useSession } from '@/lib/hooks/useSession';
import { type TSession } from '@/types/Tsession';
import { useNavigate } from '@tanstack/react-router';

interface IMfaProps {
  open: boolean;
  code: string;
  token?: string | null;
  setOpen: (open: boolean) => void;
  setCode: (code: string) => void;
}

export default function GoogleMfaCodeDialog(props: IMfaProps) {
  const router = useNavigate();
  const { open, setOpen, code, setCode, token } = props;
  const { updateSession: setAuth } = useSession();

  const handeGoogleLoginMfa = useMutation({
    mutationFn: async ({ token, code }: { token: string; code: string }) => {
      const res = await axios.post(
        `/api/${env.ENVIRONMENT}/auth/login`,
        { token, code },
        { params: { authMode: 'COOKIE' } }
      );
      const data = res.data.data as TSession;
      setAuth(data);
      router({
        to: '/dashboard',
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-11/12 rounded-md'>
        <DialogHeader>
          <DialogTitle>Enter MFA Code</DialogTitle>
        </DialogHeader>
        <Input
          label='MFA Code'
          className='rounded-lg border-none bg-input/80'
          placeholder='Enter 6 Digit MFA code'
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <div className='flex items-center justify-end gap-x-3'>
          <Button
            className='w-full'
            variant={'destructive'}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            onClick={() => {
              token && handeGoogleLoginMfa.mutate({ token, code });
            }}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
