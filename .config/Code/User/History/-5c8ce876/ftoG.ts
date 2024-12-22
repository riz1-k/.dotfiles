import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAxios } from './useAxios';

type TRegion = {
  _id: string;
  geoType: 'COUNTRY' | 'STATE' | 'CITY';
  name: string;
  parentId: string | null;
};

export type TCountryCode = 'US' | 'IN' | 'SA';

type TCountry = TRegion & { countryCode: TCountryCode };

export function useCountryList() {
  const axios = useAxios();
  return useQuery({
    queryKey: ['business-coutries'],
    queryFn: async () => {
      const response = await axios.get('/static/geo/countries');
      return response.data.data as TCountry[];
    },
    staleTime: Infinity,
  });
}

interface TStateListProps {
  countryCode: TCountryCode;
  search?: string;
}

export function useStateList() {
  const axios = useAxios();
  const [stateList, setStateList] = useState<TRegion[]>([]);
  const mutation = useMutation({
    mutationFn: async (data: TStateListProps) => {
      const response = await axios.get(`/static/geo/states`, {
        params: {
          ...data,
          page: 1,
          limit: 100,
        },
      });
      return response.data.data as TRegion[];
    },
    onSuccess: (data) => {
      setStateList(data);
    },
    onError: (error) => {
      const message = 'Something went while fetching states, please try again';
      toast.error(message);
      console.error(error);
    },
  });
  return {
    stateList,
    ...mutation,
  };
}

interface TCityListProps {
  stateName: string;
  countryCode: string;
  search?: string;
}

export function useCityList() {
  const axios = useAxios();
  const [cityList, setCityList] = useState<TRegion[]>([]);
  const mutation = useMutation({
    mutationFn: async (data: TCityListProps) => {
      const response = await axios.get(`/static/geo/cities`, {
        params: {
          ...data,
          page: 1,
          limit: 100,
        },
      });
      return response.data.data as TRegion[];
    },
    onSuccess: (data) => {
      setCityList(data);
    },
    onError: (error) => {
      const message = 'Something went while fetching cities, please try again';
      toast.error(message);
      console.error(error);
    },
  });
  return {
    cityList,
    ...mutation,
  };
}
