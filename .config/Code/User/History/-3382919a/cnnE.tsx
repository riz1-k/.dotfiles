import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAxios } from '@/lib/hooks/useAxios';
import { useSession } from '@/lib/hooks/useSession';
import { ISellerStore } from '@/types/Tsession';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboard/dashboard/account/business')({
  component: BusinessProfilePage,
});

function BusinessProfilePage() {
  const { data: storeData, isLoading } = useStoreData();

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
      const response = await axios.get(`/store/${currentStore._id}`);
      return response.data.data;
    },
    enabled: !!currentStore,
  });
}

export type TStoreData = ISellerStore & {
  storeData: {
    _id: string;
    listingType: string;
    about: string;
    contactInfo: unknown[];
    highlights: Highlights;
    timings: Record<TWeekdays, string | null>;
    specialities: string[];
    howCanWeHelp: string[];
    timezone: string;
  };
};

interface Highlights {
  flexiblePricing: boolean;
  emergencyService: boolean;
  matchPrice: boolean;
  workGuarantee: boolean;
  establishmentYear: number;
  smse: boolean;
}

type TWeekdays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';
