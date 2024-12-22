import { useAxios } from '@/lib/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

export function useStoresList() {
  const searchParams = useSearch({
    from: '/_dashboard/dashboard/stores/',
  });
  const axios = useAxios();

  return useQuery({
    queryKey: ['catalog', searchParams],
    queryFn: async () => {
      const response = await axios.get<
        TResponse<{
          total: number;
          stores: TStore[];
        }>
      >('/store', {
        params: searchParams,
      });
      return response.data.data;
    },
  });
}
export interface TStore {
  _id: string;
  account: string;
  storeID: string;
  country: string;
  kycStatus: string;
  storeName: string;
  storeURL: string;
  logo: string;
  banner: string;
  isDeleted: boolean;
  status: string;
  isDisabled: boolean;
  history: TStoreHistory[];
  storeType: string;
  storeData: TStoreData;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TStoreHistory {
  action: string;
  comment: string;
  date: string;
  actorType: string;
  actor: string;
}

export interface TStoreData {
  _id: string;
  contactName: string;
  businessEmail: string;
  businessPhone: string;
}
