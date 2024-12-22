import { useAxios } from '@/lib/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import {
  TCreateProductSchema,
  TProductListingUpdateSchema,
} from '../-utils/products-listing.schema';

export function useDraftProduct() {
  const axios = useAxios();
  const productId = useParams({
    from: '/dashboard/catalog/product-listing/draft/$id',
  }).id;
  return useQuery({
    queryKey: ['draft-product', productId],
    queryFn: async () => {
      const response = await axios.get(`/listing/draft/${productId}`);
      return response.data.data as Partial<TProductListingUpdateSchema> &
        TCreateProductSchema;
    },
    staleTime: Infinity,
  });
}

export function useDraftService() {
  const axios = useAxios();
  const productId = useParams({
    from: '/dashboard/catalog/service-listing/draft/$id',
  }).id;
  return useQuery({
    queryKey: ['draft-service', productId],
    queryFn: async () => {
      const response = await axios.get(`/listing/draft/${productId}`);
      return response.data.data as Partial<TProductListingUpdateSchema> &
        TCreateProductSchema;
    },
    staleTime: Infinity,
  });
}
