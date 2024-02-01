/* eslint-disable no-undef */
import { ChevronsUpDown, X } from 'lucide-react';
import { type ComponentProps, type ReactElement } from 'react';
import {
  type GroupBase,
  type LoadingIndicatorProps,
  type MultiValueGenericProps,
  components,
} from 'react-select';
import makeAnimated from 'react-select/animated';
import { type SelectComponents } from 'react-select/dist/declarations/src/components';

import { ActionTooltip } from '@/components/action-tooltip';

import { cn } from '@/lib/utils';

import { Spinner } from '../../spinner';

const DefaultLoadingIndicator = ({ ...props }: LoadingIndicatorProps) => {
  return <Spinner size="sm" variant="ghost" />;
};

const MultiValueLabel = (
  props: MultiValueGenericProps<{ label: string; value: string }>
) => {
  return (
    <ActionTooltip
      asChild={false}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      label={props?.data?.label}
    >
      <components.MultiValueLabel {...props}>
        <div className="line-clamp-1 w-full flex-wrap whitespace-normal text-left">
          {props.children}
        </div>
      </components.MultiValueLabel>
    </ActionTooltip>
  );
};

const DefaultClearIndicator = (
  props: ComponentProps<typeof components.ClearIndicator>
) => {
  return (
    <components.ClearIndicator {...props} className={cn('!p-0')}>
      <span className="cursor-pointer rounded-full bg-gray-500 bg-opacity-40 p-0.5 text-white transition duration-200 hover:bg-opacity-70">
        <X className="h-3 w-3" />
      </span>
    </components.ClearIndicator>
  );
};

const DefaultDropdownIndicator = (
  props: ComponentProps<typeof components.DropdownIndicator>
) => {
  return (
    <components.DropdownIndicator {...props} className={cn('!mr-2 !p-0')}>
      <span className="text-slate-600 transition duration-200 hover:text-slate-700">
        <ChevronsUpDown className="h-4 w-4" />
      </span>
    </components.DropdownIndicator>
  );
};

const DefaultIndicatorsContainer = (
  props: ComponentProps<typeof components.IndicatorsContainer>
) => {
  return (
    <components.IndicatorsContainer {...props}>
      <div className="flex flex-shrink-0 items-center space-x-2">
        {props.children}
      </div>
    </components.IndicatorsContainer>
  );
};

const DefaultMenuList = (
  props: ComponentProps<typeof components.MenuList>
): ReactElement => {
  return (
    <components.MenuList className="scrollbar__custom" {...props}>
      {props.children}
    </components.MenuList>
  );
};

const DefaultNoOptionsMessage = (
  props: ComponentProps<typeof components.NoOptionsMessage>
): ReactElement => {
  return (
    <components.NoOptionsMessage className="font-bold" {...props}>
      {props.children}
    </components.NoOptionsMessage>
  );
};

const animatedComponents = makeAnimated();

export const defaultComponents: Partial<
  SelectComponents<unknown, boolean, GroupBase<unknown>>
> = {
  ...animatedComponents,
  LoadingIndicator: DefaultLoadingIndicator,
  IndicatorSeparator: null,
  ClearIndicator: DefaultClearIndicator,
  DropdownIndicator: DefaultDropdownIndicator,
  IndicatorsContainer: DefaultIndicatorsContainer,
  MenuList: DefaultMenuList,
  NoOptionsMessage: DefaultNoOptionsMessage,
  MultiValueLabel,
};
