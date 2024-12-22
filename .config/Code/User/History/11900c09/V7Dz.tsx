import MultipleSelector from '../ui/multi-select';
import { FormField } from './FormField';

interface Props {
  value: TSelect[];
  onChange: (value: TSelect[]) => void;
  error?: string;
}

type TSelect = {
  label: string;
  value: string;
};

export function CitySelector(
  props: Props & {
    selectedState: string;
  }
) {
  return (
    <FormField label='City' error={props.error}>
      <MultipleSelector
        value={props.value}
        onChange={(values) => {
          props.onChange(values);
        }}
        options={cityList.map((x) => ({
          value: x.name,
          label: x.name,
        }))}
        placeholder='Select Cities (Select all country or specific)'
      />
    </FormField>
  );
}
