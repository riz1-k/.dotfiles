import * as React from 'react';

import { cn } from '@/lib/utils';

import { Tooltip } from '../global/Tooltip';
import { Label } from './label';
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  important?: boolean;
  tooltip?: React.ReactNode;
  issetundefined?: 'true';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, important, tooltip, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.issetundefined && e.target.value === '') {
        return props.onChange?.({
          ...e,
          target: { ...e.target, value: undefined as unknown as string },
        });
      }

      if (type === 'date' && !isValidDate(e.target.value)) {
        return props.onChange?.({
          ...e,
          target: { ...e.target, value: undefined as unknown as string },
        });
      }

      props.onChange?.(e);
    };
    const isValidDate = (value: string) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    };

    const input = (
      <div className='w-full'>
        <input
          type={type}
          className={cn(
            'h-9 w-full rounded-md border inline-block bg-input px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
            error &&
              'bg-destructive/10  outline-destructive focus-visible:ring-destructive'
          )}
          ref={ref}
          {...props}
          onChange={handleChange}
        />
        {<p className='text-xs mt-0.5 text-destructive'>{error}</p>}
      </div>
    );

    if (label) {
      return (
        <div className='w-full flex flex-col gap-y-4'>
          <Label
            dir={props.dir}
            isRequired={props.required || important}
            htmlFor={props.id}
            className={cn(
              error && 'text-destructive',
              'w-fit capitalize font-bold'
            )}
          >
            {label} {tooltip && <Tooltip content={tooltip} />}
          </Label>

          {input}
        </div>
      );
    }
    return input;
  }
);
Input.displayName = 'Input';

export { Input };
