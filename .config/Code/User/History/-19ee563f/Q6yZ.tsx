import { Switch } from '../ui/switch';

export function ListingToggle(props: {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className='flex justify-center'>
      <div className='flex items-center gap-4'>
        <span className='font-semibold'>Service</span>
        <Switch
          className='data-[state=checked]:bg-primary data-[state=unchecked]:bg-accent'
          checked={props.checked}
          onCheckedChange={props.onCheckedChange}
        />
        <span className='font-semibold'>Product</span>
      </div>
    </div>
  );
}
