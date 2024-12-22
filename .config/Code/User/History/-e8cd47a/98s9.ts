import { useAxios } from '@/lib/hooks/useAxios';
import { TFile } from '@/lib/file-utils';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearch } from '@tanstack/react-router';
import { LISTING_TYPES } from '@/routes/_dashboard/dashboard/listings/-utils/product-schema';

export function useLeads() {
  const axios = useAxios();
  const search = useSearch({
    from: '/_dashboard/dashboard/stores/$id/leads/',
  });
  const storeId = useParams({
    from: '/_dashboard/dashboard/stores/$id/leads/',
  }).id;
  const { search: searchTerm, page, limit, leadType } = search;
  return useQuery({
    queryKey: ['leads-list'],
    queryFn: async () => {
      const response = await axios.get<
        TResponse<{ leads: TLead[]; total: number }>
      >(`/a/lead`, {
        params: {
          page,
          limit,
          search: searchTerm,
          leadType,
          store: storeId,
        },
      });
      return response.data.data;
    },
  });
}

export function useSingleLead() {
  const axios = useAxios();
  const leadId = useParams({
    from: '/_dashboard/dashboard/stores/$id/leads/$listingId',
  });
  const search = useSearch({
    from: '/_dashboard/dashboard/stores/$id/leads/$listingId',
  });

  return useQuery({
    queryKey: ['leads-single', leadId],
    queryFn: async () => {
      const response = await axios.get<
        TResponse<{
          listing: { _id: string; images: TFile[]; title: string };
          leads: TLead[];
          total: number;
        }>
      >(`/a/lead/listing/${search.listingId}`, {
        params: search,
      });
      return response.data.data;
    },
  });
}

export type TLead = {
  _id: string;
  subscription: string;
  store: string;
  entityType: (typeof LISTING_TYPES)[number];
  entity: {
    _id: string;
    storeName: string;
    storeURL: string;
    logo: TFile;
  };
  name: string;
  email: string;
  country: string;
  phone: string;
  whatsapp?: string;
  botim?: string;
  subject: string;
  message: string;
  isDisabled: boolean;
  createdAt: string;
};
