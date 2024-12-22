import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAxios } from '@/lib/hooks/useAxios';
import { useMutation } from '@tanstack/react-query';
import { FormField } from '@/components/global/FormField';

import { toast } from 'sonner';
export const ApprovedStoreKycDialog: React.FC<{ storeId: string }> = ({
  storeId,
}) => {
  const axios = useAxios();

  const { mutate: approveStore, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.put(`/store/kyc/action/${storeId}`, {
        action: 'APPROVED',
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Store KYC Approved Successfully');
    },
    onError: (error) => {
      toast.error('Failed to Approve Store KYC', {
        description: error.message,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='default'>Approve Store</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Store KYC</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve this store's KYC?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => approveStore()}
            disabled={isPending}
          >
            {isPending ? 'Approving...' : 'Confirm Approval'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const RejectedStoreKycDialog: React.FC<{ storeId: string }> = ({
  storeId,
}) => {
  const [reason, setReason] = useState('');
  const axios = useAxios();

  const { mutate: rejectStore, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.put(`/store/kyc/action/${storeId}`, {
        action: 'REJECTED',
        reason,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Store KYC Rejected Successfully');
      setReason('');
    },
    onError: (error) => {
      toast.error('Failed to Reject Store KYC', {
        description: error.message,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>Reject Store</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Store KYC</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for rejecting this store's KYC.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormField label='Reason'>
          <Textarea
            placeholder='Enter revalidation reason (3-500 characters)'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </FormField>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => rejectStore()}
            disabled={isPending || reason.length < 3}
          >
            {isPending ? 'Rejecting...' : 'Confirm Rejection'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const RevalidateStoreKycDialog: React.FC<{ storeId: string }> = ({
  storeId,
}) => {
  const [reason, setReason] = useState('');
  const axios = useAxios();

  const { mutate: revalidateStore, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.put(`/store/kyc/action/${storeId}`, {
        action: 'REVALIDATE',
        reason,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Store KYC Revalidation Requested Successfully');
      setReason('');
    },
    onError: (error) => {
      toast.error('Failed to Request Revalidation', {
        description: error.message,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='secondary'>Request Revalidation</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='space-y-4'>
        <AlertDialogHeader>
          <AlertDialogTitle>Request Store KYC Revalidation</AlertDialogTitle>
          <AlertDialogDescription>
            Provide details for why this store needs revalidation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormField label='Reason'>
          <Textarea
            placeholder='Enter revalidation reason (3-500 characters)'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </FormField>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => revalidateStore()}
            disabled={isPending || reason.length < 3}
          >
            {isPending ? 'Requesting Revalidation...' : 'Confirm Revalidation'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
