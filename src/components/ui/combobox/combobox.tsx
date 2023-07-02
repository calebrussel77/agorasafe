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

import { Spinner } from '../spinner';

//@TODO need to find a way to properly type this
export type OptionItem = {
  label: string;
  value: string;
} & unknown;

interface ComboBoxProps {
  isLoading?: boolean;

  defaultOpen?: boolean;

  value: OptionItem | undefined;

  search: string;

  onSearchChange: (value: string) => void;

  options: OptionItem[] | undefined;

  onChange: (item: never) => void;

  itemToString?: (item: OptionItem | undefined) => string;

  debounce?: number;

  placeholder?: string;

  placeholderSearch?: string;

  renderItem?: (
    item: OptionItem | undefined
  ) => React.ReactElement | JSX.Element;

  iconAfter?: React.ReactElement | JSX.Element;

  emptyState?: React.ReactElement | JSX.Element;
}

function getItemLabel(
  item: ComboBoxProps['value'],
  itemToString: ComboBoxProps['itemToString']
) {
  if (itemToString) {
    return itemToString(item);
  }
  return item?.label;
}

function getPlaceholder(placeholder: ComboBoxProps['placeholder']) {
  return placeholder ? placeholder : 'Selectionnez un element...';
}

const ComboBox: React.FC<ComboBoxProps> = ({
  value,
  isLoading,
  onChange,
  options,
  placeholder,
  renderItem,
  debounce = 500,
  search,
  onSearchChange,
  placeholderSearch = 'Recherchez un element...',
  itemToString,
  emptyState = 'Aucun résultats trouvés.',
  iconAfter,
  defaultOpen = false,
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const [debounceValue, setDebounceValue] = React.useState(search || '');

  const [ref, { width }] = useMeasure();
  const itemValue = value ? getItemLabel(value, itemToString) : '';
  const selectedValue = itemValue || getPlaceholder(placeholder);
  const wrappedIcon = wrapChildren(iconAfter, 'ml-2 shrink-0 opacity-60');

  useDebounce(
    () => {
      onSearchChange && onSearchChange(debounceValue);
    },
    debounce,
    [debounceValue]
  );

  React.useEffect(() => {
    setDebounceValue(search);
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger ref={ref as never} asChild>
        <Button
          variant="outline"
          role="comboBox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValue}
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
        <Command>
          <Command.Input
            value={debounceValue}
            onValueChange={setDebounceValue}
            placeholder={placeholderSearch}
            className="h-9"
          />

          {isLoading ? (
            <Command.Loading>Chargement...</Command.Loading>
          ) : (
            <Command.Empty>{emptyState}</Command.Empty>
          )}
          <Command.List>
            {options &&
              options?.map(option => (
                <Command.Item
                  key={option?.value}
                  value={option?.value}
                  onSelect={() => {
                    onChange(option as never);
                    setOpen(false);
                  }}
                >
                  {renderItem ? renderItem(option) : option?.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value?.value === option?.value
                        ? 'opacity-100 text-primary'
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
