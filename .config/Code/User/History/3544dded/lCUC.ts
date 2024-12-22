import { useAxios } from '@/lib/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';

export function useAnalytics() {
  const axios = useAxios();
  const params = useParams({
    from: '/_dashboard/dashboard/listings/analytics/$id',
  });
  const search = useSearch({
    from: '/_dashboard/dashboard/listings/analytics/$id',
  });
  return useQuery({
    queryKey: ['analytics-listing'],
    queryFn: async () => {
      const response = await axios.get<TResponse<TAnalyticsResponse>>(
        `/analytics/listing/${params.id}`,
        {
          params: search,
        }
      );
      return response.data.data;
    },
  });
}

export const BUSINESS_ANALYTICS_EVENT_TYPE = [
  'SEARCH_APPEARANCE',
  'LISTING_CLICK',
  'SHARE_LISTING',
  'FAQ_CLICK',
  'FEATURED_PROJECT_CLICK',
  'CALL_CLICK',
  'CHAT_CLICK',
  'EMAIL_CLICK',
  'WEBSITE_CLICK',
  'SOCIAL_CLICK',
  'RATE_LISTING',
] as const;

export type TAnalyticsResponse = {
  eventAnalytics: Array<{
    totalCount: number;
    details: Array<{
      subEvent?: string;
      title?: string;
      count: number;
    }>;
    event: string;
  }>;
  savedCount: number;
  peakLeads: {
    leadCount: number;
    weekdayName: string;
  };
};
