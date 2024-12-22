import { useAxios } from '@/lib/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import {
  TCreateProductSchema,
  TProductListingUpdateSchema,
} from '../-utils/products-listing.schema';
import {
  TCreateServiceSchema,
  TServiceAdditionalSchemaSchema,
  TServiceFeaturedSchema,
} from '../service-listing/-utils/service-listing.schema';

export function useEditProduct() {
  const axios = useAxios();
  const productId = useParams({
    from: '/dashboard/catalog/product-listing/edit/$id',
  }).id;
  return useQuery({
    queryKey: ['draft-product', productId],
    queryFn: async () => {
      const response = await axios.get(`/listing/product/${productId}`);
      return response.data.data as Partial<TProductListingUpdateSchema> &
        TCreateProductSchema;
    },
    staleTime: Infinity,
  });
}

export function useEditService() {
  const axios = useAxios();
  const productId = useParams({
    from: '/dashboard/catalog/service-listing/edit/$id',
  }).id;
  return useQuery({
    queryKey: ['draft-service', productId],
    queryFn: async () => {
      const response = await axios.get(`/listing/service/${productId}`);
      return response.data.data as TServiceAdditionalSchemaSchema &
        TCreateServiceSchema &
        TServiceFeaturedSchema;
    },
    staleTime: Infinity,
  });
}
