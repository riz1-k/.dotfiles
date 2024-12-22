import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAxios } from '@/lib/hooks/useAxios';
import { useSession } from '@/lib/hooks/useSession';
import { onboardFilesSchema } from '@/routes/onboard/-components/onboard-files-form';
import { onboardProfileSchema } from '@/routes/onboard/-components/onboard-profile-form';
import { ISellerStore } from '@/types/Tsession';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Route = createFileRoute('/_dashboard/dashboard/account/business')({
  component: BusinessProfilePage,
});

const formSchema = onboardProfileSchema.and(onboardFilesSchema);
type TFormSchema = z.infer<typeof formSchema>;

function BusinessProfilePage() {
  const { data: storeData, isLoading } = useStoreData();
  const session = useSession();

  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });

  const liveValues = form.watch();

  useEffect(() => {
    if (!session.data) return;
    form.reset({
      ...liveValues,
      storeData: {
        ...liveValues.storeData,
        businessEmail: session.data.account.email,
      },
    });
  }, [session.data]);

  useEffect(() => {
    if (!storeData) return;
    form.reset({
      ...liveValues,
      storeName: storeData.storeName,
      logo: storeData.logo,
      banner: storeData.banner,
      country: storeData.country,
      storeData: storeData.storeData,
    });
  }, [storeData]);

  if (isLoading) return 'Loading...';

  if (!storeData) return 'No store found';

  return (
    <main className='space-y-2 p-4 '>
      <div className='flex items-center justify-between'>
        <Label className='text-xl text-card-foreground font-bold'>
          My Profile
        </Label>
      </div>
      <Separator />
    </main>
  );
}

export function useStoreData() {
  const axios = useAxios();
  const currentStore = useSession().currentStore;

  return useQuery({
    queryKey: ['store-data'],
    queryFn: async () => {
      if (!currentStore) throw new Error('No store found');
      const response = await axios.get<TResponse<TStoreData>>(
        `/store/${currentStore._id}`
      );
      return response.data.data;
    },
    enabled: !!currentStore,
  });
}

export type TStoreData = ISellerStore & {
  storeData: TFormSchema['storeData'] & {
    _id: string;
  };
};
