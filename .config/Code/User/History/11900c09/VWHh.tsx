import { useMutation } from '@tanstack/react-query';
import MultipleSelector from '../ui/multi-select';
import { FormField } from './FormField';
import { useAxios } from '@/lib/hooks/useAxios';
import { useEffect } from 'react';

interface Props {
  value: TSelect[];
  onChange: (value: TSelect[]) => void;
  error?: string;
}

type TSelect = {
  label: string;
  value: string;
};

type TRegion = {
  _id: string;
  geoType: 'COUNTRY' | 'STATE' | 'CITY';
  name: string;
  parentId: string | null;
};

export function CitySelector(
  props: Props & {
    selectedState: string;
  }
) {
  const axios = useAxios();
  const cityQuery = useMutation({
    mutationFn: async (stateName: string) => {
      const response = await axios.get('/static/geo/cities', {
        params: {
          stateName,
          page: 1,
          limit: 20,
        },
      });
      return response.data.data as TRegion[];
    },
  });
  useEffect(() => {
    if (props.selectedState) {
      cityQuery.mutate(props.selectedState);
    }
  }, [props.selectedState]);

  if (!props.selectedState) return null;

  return (
    <FormField label='City' error={props.error}>
      <MultipleSelector
        value={props.value}
        onChange={(values) => {
          props.onChange(values);
        }}
        options={cityQuery.data?.map((x) => ({
          value: x.name,
          label: x.name,
        }))}
        onSearch={async (value) => {
          const response = await cityQuery.mutateAsync(value);
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
