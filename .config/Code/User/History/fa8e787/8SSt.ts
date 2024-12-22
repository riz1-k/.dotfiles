import { useAxios } from '@/lib/hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';

export type TBillingSubscriptionData = {
  subscriptions: Array<{
    _id: string;
    subscriptionID: string;
    subscriptionDetails: {
      price: number;
      currency: string;
      frequency: string;
      subscription: {
        _id: string;
        name: string;
        id: string;
      };
    };
    downgradedTo:
      | {
          _id: string;
          subscriptionDetails: TBillingSubscriptionData['subscriptions'][number]['subscriptionDetails'];
        }
      | undefined;
    paymentDetails: {
      paidAmount: number;
      paymentStatus: string;
      paymentRef: string;
    };
    downgradeDiscount: number;
    id: string;
    subscriptionHistory: TSubscriptionHistory[];
    createdAt: string;
    refundDetails:
      | {
          refundAmount: number;
          refundDate: string;
          refundStatus: string;
          refundRef: string;
        }
      | undefined
      | null;
  }>;
  total: number;
};

export type TSubscriptionHistory = {
  paymentDetails: TBillingSubscriptionData['subscriptions'][number]['paymentDetails'];
  subscriptionDetails: TBillingSubscriptionData['subscriptions'][number]['subscriptionDetails'];
  refundDetails: TBillingSubscriptionData['subscriptions'][number]['refundDetails'];
  endDate: Date;
};

export type TBillingTrustSealData = {
  subscriptions: Array<{
    _id: string;
    subscriptionID: string;
    subscriptionDetails: {
      price: number;
      currency: string;
      frequency: string;
      subscription: {
        _id: string;
        name: string;
        id: string;
      };
    };
    startDate: string;
    paymentDetails: {
      paidAmount: number;
      paymentStatus: string;
      paymentRef: string;
    };
    downgradeDiscount: number;
    refundDetails?: {
      refundAmount: number;
      refundDate: string;
      refundStatus: string;
      refundRef: string;
    };
    id: string;
    cancelDate?: string;
  }>;
  total: number;
};

export function useBillingSubscription() {
  const axios = useAxios();
  const search = useSearch({
    from: '/_dashboard/dashboard//stores/$id/subscriptions',
  });
  const storeId = useParams({
    from: '/_dashboard/dashboard//stores/$id/subscriptions',
  }).id;

  return useQuery({
    queryKey: ['billing-subscription'],
    queryFn: async () => {
      const response = await axios.get<TResponse<TBillingSubscriptionData>>(
        `/subscription/${storeId}/billing`,
        {
          params: search,
        }
      );
      return response.data.data;
    },
    enabled: !!storeId,
  });
}

export function useBillingTrustSeal() {
  const axios = useAxios();
  const search = useSearch({
    from: '/_dashboard/dashboard//stores/$id/subscriptions',
  });
  const storeId = useParams({
    from: '/_dashboard/dashboard//stores/$id/subscriptions',
  }).id;
  return useQuery({
    queryKey: ['billing-trust-seal'],
    queryFn: async () => {
      const response = await axios.get<TResponse<TBillingTrustSealData>>(
        `/trust-seal/subscription/${storeId}/billing`,
        {
          params: search,
        }
      );
      return response.data.data;
    },
    enabled: !!storeId,
  });
}
