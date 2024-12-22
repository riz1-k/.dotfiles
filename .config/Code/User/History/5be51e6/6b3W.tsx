import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface MFALoginProps {
  code: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  setCode: (code: string) => void;
  onClicks: () => void;
}

export default function MfaCodeDialog(props: MFALoginProps) {
  const { code, open, setOpen, setCode, onClicks } = props;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-11/12 rounded-md'>
        <DialogHeader>
          <DialogTitle>Enter MFA Code </DialogTitle>
        </DialogHeader>
        <Input
          className='rounded-lg border-none bg-input/80'
          placeholder='Enter 6 Digit MFA code'
          required
          label='MFA Code'
          value={code}
          maxLength={6}
          type='number'
          onChange={(e) => setCode(e.target.value)}
        />
        <div className='flex items-center justify-end gap-x-3'>
          <Button
            className='w-1/3'
            variant={'destructive'}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button className='w-1/3' onClick={onClicks}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
