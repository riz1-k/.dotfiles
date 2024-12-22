import { useAxios } from '@/lib/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { z } from 'zod';

export const requestCallbackSearchSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(40),
});

export function useRequestCallbacks() {
  const storeId = useParams({
    from: '/_dashboard/dashboard/stores/$id/request-callbacks',
  }).id;
  const searchParams = useSearch({
    from: '/_dashboard/dashboard/stores/$id/request-callbacks',
  });

  const axios = useAxios();

  return useQuery({
    queryKey: ['request-callbacks', storeId],
    queryFn: async () => {
      const response = await axios.get<
        TResponse<{
          total: number;
          data: TRequestCallback[];
        }>
      >('/support', {
        params: { ...searchParams, store: storeId, supportType: 'SELLER' },
      });
      return response.data.data;
    },
  });
}

export type TRequestCallback = {
  _id: string;
  store: {
    _id: string;
    storeName: string;
    storeURL: string;
  };
  email: string;
  name: string;
  phone: string;
  subject: string;
  description: string;
  createdAt: string;
};
