'use client';

import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import * as React from 'react';
import { forwardRef, useEffect } from 'react';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

interface GroupOption {
  [key: string]: Option[];
}

interface SingleSelectorProps {
  value?: Option;
  defaultOptions?: Option[];
  /** manually controlled options */
  options?: Option[];
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>;
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   **/
  onSearchSync?: (value: string) => Option[];
  onChange?: (option: Option | undefined) => void;
  disabled?: boolean;
  /** Group the options base on provided key. */
  groupBy?: string;
  className?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    'value' | 'placeholder' | 'disabled'
  >;
}

export interface SingleSelectorRef {
  selectedValue: Option | undefined;
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) return {};
  if (!groupBy) return { '': options };

  const groupOption: GroupOption = {};
  options.forEach((option) => {
    const key = (option[groupBy] as string) || '';
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
}

const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn('py-6 text-center text-sm', className)}
      cmdk-empty=''
      role='presentation'
      {...props}
    />
  );
});

CommandEmpty.displayName = 'CommandEmpty';

const SingleSelector = React.forwardRef<SingleSelectorRef, SingleSelectorProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Select an option',
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      disabled,
      groupBy,
      className,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
    }: SingleSelectorProps,
    ref: React.Ref<SingleSelectorRef>
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const [selected, setSelected] = React.useState<Option | undefined>(value);
    const [options, setOptions] = React.useState<GroupOption>(
      transToGroupOption(arrayDefaultOptions, groupBy)
    );
    const [inputValue, setInputValue] = React.useState('');
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: selected,
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected(undefined),
      }),
      [selected]
    );

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setInputValue('');
        inputRef.current.blur();
      }
    };

    useEffect(() => {
      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchend', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchend', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchend', handleClickOutside);
      };
    }, [open]);

    useEffect(() => {
      if (value !== undefined) {
        setSelected(value);
      }
    }, [value]);

    useEffect(() => {
      if (!arrayOptions || onSearch) return;
      const newOption = transToGroupOption(arrayOptions || [], groupBy);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

    useEffect(() => {
      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
      };

      const exec = () => {
        if (!onSearchSync || !open) return;
        if (triggerSearchOnFocus || debouncedSearchTerm) {
          doSearchSync();
        }
      };

      exec();
    }, [
      debouncedSearchTerm,
      groupBy,
      onSearchSync,
      open,
      triggerSearchOnFocus,
    ]);

    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
        setIsLoading(false);
      };

      const exec = async () => {
        if (!onSearch || !open) return;
        if (triggerSearchOnFocus || debouncedSearchTerm) {
          await doSearch();
        }
      };

      void exec();
    }, [debouncedSearchTerm, groupBy, onSearch, open, triggerSearchOnFocus]);

    const CreatableItem = () => {
      if (!creatable || !inputValue.length) return undefined;

      if (
        Object.values(options)
          .flat()
          .some((option) => option.value === inputValue)
      ) {
        return undefined;
      }

      return (
        <CommandItem
          value={inputValue}
          className='cursor-pointer'
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onSelect={(value: string) => {
            const newOption = { value, label: value };
            setSelected(newOption);
            setInputValue('');
            onChange?.(newOption);
            setOpen(false);
          }}
        >
          Create "{inputValue}"
        </CommandItem>
      );
    };

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined;
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value='-' disabled>
            {emptyIndicator}
          </CommandItem>
        );
      }
      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        className={cn(
          'h-auto overflow-visible bg-transparent',
          commandProps?.className
        )}
        shouldFilter={
          commandProps?.shouldFilter !== undefined
            ? commandProps.shouldFilter
            : !onSearch
        }
      >
        <div
          className={cn(
            'group rounded-md border border-input bg-background text-sm ring-offset-background',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
        >
          <div className='flex items-center justify-between px-3'>
            <CommandPrimitive.Input
              ref={inputRef}
              {...inputProps}
              value={open ? inputValue : selected?.label || ''}
              disabled={disabled}
              onValueChange={(value) => {
                setInputValue(value);
                inputProps?.onValueChange?.(value);
              }}
              onBlur={(event) => {
                inputProps?.onBlur?.(event);
              }}
              onFocus={(event) => {
                setOpen(true);
                triggerSearchOnFocus && onSearch?.(debouncedSearchTerm);
                inputProps?.onFocus?.(event);
              }}
              placeholder={placeholder}
              className={cn(
                'flex-1 bg-transparent py-2 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
                inputProps?.className
              )}
            />
            <div className='flex gap-1'>
              {selected && !disabled && (
                <button
                  type='button'
                  onClick={() => {
                    setSelected(undefined);
                    onChange?.(undefined);
                  }}
                  className='rounded-full p-1 hover:bg-accent'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
              <ChevronsUpDown className='h-4 w-4 opacity-50' />
            </div>
          </div>
        </div>
        <div className='relative mt-1'>
          {open && (
            <CommandList className='absolute z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in'>
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {CreatableItem()}
                  {!selectFirstItem && (
                    <CommandItem value='-' className='hidden' />
                  )}
                  {Object.entries(options).map(([key, groupOptions]) => (
                    <CommandGroup
                      key={key}
                      heading={key}
                      className='h-full overflow-auto'
                    >
                      {groupOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disable}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onSelect={() => {
                            setSelected(option);
                            setInputValue('');
                            onChange?.(option);
                            setOpen(false);
                          }}
                          className={cn(
                            'cursor-pointer',
                            option.disable &&
                              'cursor-default text-muted-foreground'
                          )}
                        >
                          {option.label}
                          {option.value === selected?.value && (
                            <Check className='ml-auto h-4 w-4' />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    );
  }
);

SingleSelector.displayName = 'SingleSelector';
export default SingleSelector;
