import { useAxios } from '@/lib/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { z } from 'zod';
import { TListProduct } from '@/routes/_dashboard/dashboard/listings/-utils/useListings';
import { LISTING_TYPES } from '@/routes/_dashboard/dashboard/listings/-utils/product-schema';
import { TFile } from '@/lib/file-utils';

export const reviewPageSchema = z.object({
  listing: z.string().optional(),
  store: z.string().optional(),
  dates: z.tuple([z.coerce.date(), z.coerce.date()]).optional(),
  rating: z.number().optional(),
  account: z.string().optional(),
  withImages: z.enum(['true', 'false']).optional(),
  isBlocked: z.enum(['true', 'false']).optional(),
  isAnonymous: z.enum(['true', 'false']).optional(),
  listType: z.enum(['service', 'product']).default('service'),
});

export function useReviewAnalytics() {
  const axios = useAxios();
  const search = useSearch({
    from: '/_dashboard/dashboard/stores/$id/reviews/',
  });

  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const response = await axios.get<TResponse<TReviewAnalytics>>(
        '/a/review',
        {
          params: search,
        }
      );
      return response.data.data;
    },
  });
}

export type TReviewAnalytics = {
  totalReviews: number;
  recommendedCount: number;
  averageRatings: {
    _id: any;
    avgRating: number;
    avgProfessionalism: number;
    avgTimeliness: number;
    avgValueForMoney: number;
    avgServiceQuality: number;
  };
  starCounts: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
};

export function useReviewCatalog() {
  const searchParams = useSearch({
    from: '/_dashboard/dashboard/stores/$id/reviews/',
  });
  const axios = useAxios();
  const storeId = useParams({
    from: '/_dashboard/dashboard/stores/$id/reviews/',
  }).id;

  return useQuery({
    queryKey: ['review-catalog', storeId],
    queryFn: async () => {
      const response = await axios.get('/listing/' + searchParams.listType, {
        params: {
          ...searchParams,
          store: storeId,
        },
      });
      return response.data.data as {
        total: number;
        listings: TListProduct[];
      };
    },
  });
}

export const singleReviewSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  listingType: z.enum(LISTING_TYPES),
  sortBy: z
    .tuple([z.enum(['createdAt', 'rating']), z.enum(['asc', 'desc'])])
    .optional()
    .default(['createdAt', 'desc']),
  isBlocked: z.enum(['true', 'false']).optional(),
});

export function useSingleReview() {
  const listingId = useParams({
    from: '/_dashboard/dashboard/stores/$id/reviews/$reviewId',
  }).reviewId;
  const search = useSearch({
    from: '/_dashboard/dashboard/stores/$id/reviews/$reviewId',
  });
  const axios = useAxios();
  return useQuery({
    queryKey: ['single-review', listingId],
    queryFn: async () => {
      const response = await axios.get<TResponse<TSingleReview>>(
        `/review/listing/${listingId}`,
        {
          params: search,
        }
      );
      return response.data.data;
    },
  });
}

export interface TSingleReview {
  listing: Listing;
  reviews: Review[];
  total: number;
}

export interface Listing {
  _id: string;
  title: string;
  slug: string;
}

export interface Review {
  _id: string;
  store: string;
  listingType: string;
  listing: string;
  subject: string;
  rating: number;
  professionalism: number;
  timeliness: number;
  valueForMoney: number;
  serviceOuality: number;
  images: TFile[];
  isRecommended: boolean;
  comment: string;
  isBlocked: boolean;
  createdAt: string;
  HELPFUL: number;
  THANKS: number;
  GREAT: number;
  OH_NO: number;
  id: string;
}
