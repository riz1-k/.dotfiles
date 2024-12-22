import { useMutation } from '@tanstack/react-query';
import MultipleSelector from '../ui/multi-select';
import { FormField } from './FormField';
import { useAxios } from '@/lib/hooks/useAxios';
import { useEffect } from 'react';
import SingleSelector from '../ui/single-select';

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

type TRegion = {
  _id: string;
  geoType: 'COUNTRY' | 'STATE' | 'CITY';
  name: string;
  parentId: string | null;
};

export function CitySelector(
  props: Props & {
    selectedState?: string;
    countryCode?: string;
  }
) {
  const axios = useAxios();
  const cityQuery = useMutation({
    mutationFn: async ({
      stateName,
      countryCode,
      search,
    }: {
      stateName: string;
      countryCode: string;
      search?: string;
    }) => {
      const response = await axios.get('/static/geo/cities', {
        params: {
          stateName,
          countryCode,
          page: 1,
          limit: 20,
          search,
        },
      });
      return response.data.data as TRegion[];
    },
  });
  useEffect(() => {
    if (props.selectedState && props.countryCode) {
      cityQuery.mutate({
        stateName: props.selectedState,
        countryCode: props.countryCode,
      });
    }
  }, [props.selectedState]);

  if (!props.selectedState) return null;

  return (
    <FormField label='City' error={props.error}>
      <MultipleSelector
        value={props.value.map((x) => ({ label: x, value: x }))}
        onChange={(values) => {
          props.onChange(values.map((x) => x.value));
        }}
        options={cityQuery.data?.map((x) => ({
          value: x.name,
          label: x.name,
        }))}
        triggerSearchOnFocus={false}
        onSearch={async (value) => {
          if (!props.countryCode || !props.selectedState) return [];
          const response = await cityQuery.mutateAsync({
            stateName: props.selectedState,
            countryCode: props.countryCode,
            search: value,
          });
          return response.map((x) => ({
            label: x.name,
            value: x.name,
          }));
        }}
        placeholder='Select Cities (Select all country or specific)'
      />
    </FormField>
  );
}

export function StateSelector(props: {
  countryCode?: string;
  value: string;
  onChange: (value?: string) => void;
  error?: string;
}) {
  const axios = useAxios();
  const stateQuery = useMutation({
    mutationFn: async ({
      countryCode,
      search,
    }: {
      countryCode: string;
      search?: string;
    }) => {
      const response = await axios.get('/static/geo/states', {
        params: {
          countryCode,
          page: 1,
          limit: 20,
          search,
        },
      });
      return response.data.data as TRegion[];
    },
  });
  useEffect(() => {
    if (props.countryCode) {
      stateQuery.mutate({
        countryCode: props.countryCode,
      });
    }
  }, [props.countryCode]);
  return (
    <FormField label='State' error={props.error}>
      <SingleSelector
        value={{ label: props.value, value: props.value }}
        onChange={(values) => {
          props.onChange(values?.value);
        }}
        options={stateQuery.data?.map((x) => ({
          value: x.name,
          label: x.name,
        }))}
        triggerSearchOnFocus={false}
        onSearch={async (value) => {
          if (!props.countryCode) return [];
          const response = await stateQuery.mutateAsync({
            countryCode: props.countryCode,
            search: value,
          });
          return response.map((x) => ({
            label: x.name,
            value: x.name,
          }));
        }}
        placeholder='Select States (Select all country or specific)'
      />
    </FormField>
  );
}
