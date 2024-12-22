import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { CiCircleCheck } from 'react-icons/ci';
import { IoClose } from 'react-icons/io5';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { env } from '~/lib/config/env';
import { useAxios } from '~/lib/hooks/useAxios';
import { type TTrustCertificate } from '~/types/TTrustCertificate';

import { Skeleton } from '../ui/skeleton';

interface ISeal {
  storeURL?: string;
  children: React.ReactNode;
}

export default function VerifiedSealCard({ storeURL, children }: ISeal) {
  const axios = useAxios();
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, isRefetching } = useQuery({
    queryKey: ['verified'],
    queryFn: async () => {
      const res = await axios.get(
        `${env.BACKEND_URL}/trust-seal/public/${storeURL}`
      );
      console.log('res', res.data.data);
      return res.data.data as TTrustCertificate;
    },
    enabled: open,
  });

  if (!data) return null;

  if (isLoading || isRefetching) {
    return <DialogeSkeleton open={open} setOpen={setOpen} />;
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center'> STORE NOT FOUND!</div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseIcon={false}
        className='!min-h-[70%] !w-[88%] !rounded-3xl !border-none !p-2 px-5'
      >
        <DialogHeader className='!border-none'>
          <DialogTitle className='!flex !h-20 !w-full items-center  gap-3 px-3'>
            <div className='h-14 w-14 rounded-full'>
              <img
                alt='logo'
                src='/common/verified-logo.svg'
                className='h-full w-full object-cover'
              />
            </div>
            <span className='text-2xl font-bold'>TRUST CERTIFICATE</span>
            <div className='-mt-5 ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary'>
              <IoClose onClick={() => setOpen(false)} size={25} />
            </div>
          </DialogTitle>

          <section className='mt-5 flex flex-col items-center justify-center gap-3 !text-foreground'>
            <section className='flex flex-col items-center gap-2'>
              <h1 className='w-fit rounded-xl bg-chart-1/10 px-4 py-2 text-xs font-semibold -tracking-tight text-chart-1'>
                Gold Certified
              </h1>
              <h1 className='text-base font-bold'>{data?.businessName}</h1>
              <h1 className='text-base font-semibold text-chart-1'>
                {data?.city} , {data?.state} , {data?.country}
              </h1>
              <h1 className='text-center text-lg font-bold'>
                has been verified as a trusted <br /> cert member of Cartibuy
                Business
              </h1>
              <h3 className='flex border-b pb-3 text-sm font-normal text-foreground/60'>
                Following details of the company/ <br />
                individual have been verified{' '}
                <CiCircleCheck className='-ml-4 mt-5 text-[8px] text-chart-2' />
              </h3>
            </section>
            <div className='flex gap-1'>
              <CiCircleCheck className='mt-[3px] text-sm text-chart-2' />
              <h3 className='text-sm font-bold text-foreground/80'>
                Owner/Director/Manager: <br />
                <span className='font-normal text-muted-foreground'>
                  {data.isBusinessFullNamePrivate
                    ? 'Private Data'
                    : data.fullName}
                </span>
              </h3>
            </div>
            <h3 className='mx-auto mt-1 flex gap-1 text-sm font-bold'>
              <CiCircleCheck className='mt-[3px] text-sm text-chart-2' />
              {data?.businessAddress.label}
            </h3>
            <span className='-mt-2 text-sm font-normal text-foreground/80'>
              <span className='font-normal text-muted-foreground'>
                {data?.isBusinessAddressPrivate
                  ? 'Private Data'
                  : `${data?.businessAddress.street}, ${data?.businessAddress.street2},${data?.businessAddress.postalCode}, ${data?.city} , ${data?.state} , ${data?.country}`}
              </span>
            </span>
            <div className='mt-2 flex items-center gap-10 border-b pb-3'>
              <div className='flex flex-col gap-1'>
                <h3 className='flex gap-1 text-sm font-bold'>
                  <CiCircleCheck className='mt-[3px] text-sm text-chart-2' />
                  Email
                </h3>
                <span className='text-xs font-normal'>
                  {data.isBusinessEmailPrivate
                    ? 'Private Data'
                    : data.businessEmail}
                </span>
              </div>
              <div className='flex flex-col items-center gap-1'>
                <h3 className='flex gap-1 text-sm font-bold'>
                  <CiCircleCheck className='mt-[3px] text-sm text-chart-2' />
                  Phone
                </h3>
                <span className='text-xs font-normal'>
                  {data.isBusinessPhonePrivate
                    ? 'Private Data'
                    : data.businessPhone}
                </span>
              </div>
            </div>

            <div className='flex flex-col gap-2 border-b pb-3'>
              <h3 className='flex items-center gap-1 text-sm font-bold'>
                Date Earned :
                <span className='font-normal text-muted-foreground'>
                  {new Date(data?.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </h3>
              <h3 className='flex items-center gap-1 text-sm font-bold'>
                Date Expired :
                <span className='font-normal text-muted-foreground'>
                  {new Date(data?.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </h3>
            </div>
          </section>
        </DialogHeader>
        <DialogFooter>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col items-center gap-1'>
              <img
                src='/common/trust-globe.png'
                alt='logo'
                className='h-6 w-6 object-contain'
              />
              <h3 className='text-[8px] font-normal'>business.cartibuy.com</h3>
            </div>
            <div className='-mt-4'>
              <img
                src='/common/trust-cartibuy.png'
                alt='logo'
                className='h-10 w-full object-cover'
              />
            </div>
            <div className='flex flex-col items-center gap-1'>
              <img
                src='/common/trust-edit.png'
                alt='logo'
                className='h-8 w-8 object-contain'
              />
              <h3 className='text-[8px] font-normal'>business.cartibuy.com</h3>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DialogeSkeleton({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button onClick={() => setOpen(true)} className='hidden' />
      </DialogTrigger>
      <DialogContent className='!min-h-[70%] !w-[88%] !rounded-3xl !p-2 px-5'>
        <DialogHeader className='!border-none'>
          <DialogTitle className='!flex !h-20 !w-full items-center gap-3 px-3'>
            <Skeleton className='h-14 w-14 rounded-full' />
            <Skeleton className='h-5 w-24' />
            <div className='ml-auto'>
              <Skeleton className='h-12 w-12 rounded-full' />
            </div>
          </DialogTitle>
          <section className='!-mt-5 flex flex-col items-center gap-3'>
            <Skeleton className='h-5 w-32 rounded-xl' />
            <Skeleton className='h-4 w-40' />
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-5 w-64' />
            <Skeleton className='h-4 w-52' />
            <div className='mt-4 flex gap-1'>
              <Skeleton className='h-3 w-3' />
              <Skeleton className='h-4 w-40' />
            </div>
            <div className='mt-2 flex flex-col gap-2 border-b pb-3'>
              <Skeleton className='h-3 w-28' />
              <Skeleton className='h-3 w-20' />
            </div>
            <div className='mt-4 flex items-center justify-between'>
              <Skeleton className='h-6 w-6 rounded-full' />
              <Skeleton className='h-10 w-16' />
              <Skeleton className='h-8 w-8 rounded-full' />
            </div>
          </section>
        </DialogHeader>
        <DialogFooter>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-5 w-12' />
            <Skeleton className='h-5 w-12' />
            <Skeleton className='h-5 w-12' />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
