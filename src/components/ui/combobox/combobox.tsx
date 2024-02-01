/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useMeasure } from 'react-use';

import { Button } from '@/components/ui/button';
import { Command } from '@/components/ui/command';
import { Popover } from '@/components/ui/popover';

import { wrapChildren } from '@/utils/wrap-children';

import { cn } from '@/lib/utils';

import { useDebounce } from '@/hooks/use-debounce';

import { Truncate } from '../truncate';

export type OptionItem<T extends Record<string, unknown>> = {
  label: string;
  value: string;
} & T;

type ComboBoxProps<T extends Record<string, unknown>> = {
  isLoading?: boolean;

  defaultOpen?: boolean;

  value: OptionItem<T> | null;

  search: string;

  onSearchChange: (value: string) => void;

  options: OptionItem<T>[] | undefined;

  onChange: (item: OptionItem<T>) => void;

  itemToString?: (item: OptionItem<T> | null) => string;

  debounceMs?: number;

  enableDebounce?: boolean;

  placeholder?: string;

  placeholderSearch?: string;

  renderItem?: (
    item: OptionItem<T> | undefined
  ) => React.ReactElement | JSX.Element;

  iconAfter?: React.ReactElement | JSX.Element;

  emptyState?: (query?: string) => React.ReactElement | JSX.Element;

  disabled?: boolean;

  className?: string;

  shouldFilter?: boolean;
};

function getItemLabel<T extends Record<string, unknown>>(
  item: ComboBoxProps<T>['value'],
  itemToString: ComboBoxProps<T>['itemToString']
) {
  if (itemToString) {
    return itemToString(item);
  }
  return item?.label;
}

function getPlaceholder<T extends Record<string, unknown>>(
  placeholder: ComboBoxProps<T>['placeholder']
) {
  return placeholder ? placeholder : 'Selectionnez un element...';
}

const ComboBox = <T extends Record<string, unknown>>({
  value,
  isLoading,
  onChange,
  options,
  placeholder,
  renderItem,
  debounceMs = 600,
  disabled,
  shouldFilter = false,
  enableDebounce = true,
  search,
  className,
  onSearchChange,
  placeholderSearch = 'Recherchez un element...',
  itemToString,
  emptyState = () => <p>Aucun résultats trouvés</p>,
  iconAfter,
  defaultOpen = false,
}: ComboBoxProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [debounceValue, setDebounceValue] = React.useState(search || '');

  const [ref, { width }] = useMeasure();
  const itemValue = value ? getItemLabel(value, itemToString) : '';
  const selectedValue = itemValue || getPlaceholder(placeholder);
  const wrappedIcon = wrapChildren(iconAfter, 'ml-2 shrink-0 opacity-60');

  useDebounce(
    () => {
      onSearchChange && onSearchChange(debounceValue);
    },
    enableDebounce ? debounceMs : 0,
    [debounceValue]
  );

  React.useEffect(() => {
    setDebounceValue(search);
  }, [search]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger ref={ref as never} asChild className={className}>
        <Button
          variant="outline"
          role="comboBox"
          aria-expanded={isOpen}
          disabled={disabled}
          className="w-full justify-between"
        >
          {selectedValue && (
            <Truncate className="flex-1 text-left">{selectedValue}</Truncate>
          )}
          {iconAfter ? (
            wrappedIcon
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className="w-auto p-0"
        style={{ width: `${width + 26}px` }}
      >
        <Command shouldFilter={shouldFilter}>
          <Command.Input
            value={debounceValue}
            onValueChange={setDebounceValue}
            placeholder={placeholderSearch}
            className="h-9"
          />

          {!isLoading && options?.length === 0 ? (
            <Command.Empty>{emptyState(search)}</Command.Empty>
          ) : null}

          {isLoading ? <Command.Loading>Chargement...</Command.Loading> : null}

          <Command.List>
            {options &&
              options?.map(option => (
                <Command.Item
                  key={option?.value}
                  value={option?.value}
                  onSelect={() => {
                    onChange(option as never);
                    setIsOpen(false);
                  }}
                >
                  {renderItem ? renderItem(option) : option?.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4 flex-shrink-0',
                      value?.value === option?.value
                        ? 'text-brand-500 opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </Command.Item>
              ))}
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover>
  );
};

export { ComboBox };
