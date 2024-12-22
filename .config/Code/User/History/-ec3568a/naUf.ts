import { useAxios } from '@/lib/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

export function useCatalog() {
  const searchParams = useSearch({ from: '/dashboard/catalog/' });
  const axios = useAxios();

  return useQuery({
    queryKey: ['catalog', searchParams],
    queryFn: async () => {
      const response = await axios.get('/listing/' + searchParams.listType, {
        params: searchParams,
      });
      return response.data.data as TListProduct[];
    },
  });
}

type TListProduct = {
  _id: string;
  title: string;
  status: string;
  slug: string;
  visibility: string;
  category: {
    _id: string;
    title: string;
    id: string;
  };
  subCategory: {
    _id: string;
    title: string;
    id: string;
  };
};
