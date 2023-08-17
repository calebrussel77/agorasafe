/* eslint-disable testing-library/render-result-naming-convention */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable no-unused-vars */
import {
  type ElementType,
  type MouseEventHandler,
  type ReactNode,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

import { MoreIndicator } from '../avatar/more-indicator';
import { Popover } from '../popover';
import { Tooltip } from '../tooltip/tooltip';
import { Avatar, type AvatarProps, type AvatarSize } from './avatar';
import {
  AvatarGroupItem,
  type AvatarGroupItemProps,
} from './avatar-group-item';

const MAX_COUNT = {
  grid: 11,
  stack: 5,
};

type AvatarMoreProps = AvatarProps & {
  name: string;
  enableTooltip?: boolean;
  key?: string | number;
  disabled?: boolean;
};

export interface AvatarGroupProps {
  /**
   * Indicates the layout of the avatar-group.
   * Avatars will either be overlapped in a stack, or
   * laid out in an even grid formation
   * Defaults to "stack".
   */
  appearance?: 'grid' | 'stack';

  /**
   * Component used to render each avatar
   */
  avatar?: ElementType<AvatarProps>;

  /**
   * The maximum number of avatars allowed in the list.
   * Defaults to 5 when displayed as a stack,
   * and 11 when displayed as a grid.
   */
  maxCount?: number;

  /**
   * Defines the size of the avatar.
   * Defaults to "medium".
   */
  size?: AvatarSize;

  /**
   * Typically the background color that the avatar is presented on.
   * Accepts any color argument that the CSS border-color property accepts.
   */
  borderColor?: string;

  /**
   * Array of avatar data passed to each `avatar` component.
   * These props will be spread on to the component passed into avatar.
   */
  data: Array<AvatarMoreProps>;

  /**
   * Handle the click event on the avatar item.
   * Note that if an onClick prop is provided as part of avatar data, it will take precedence over onAvatarClick.
   */
  onAvatarClick?: MouseEventHandler;

  /**
   * Take control of the click event on the more indicator.
   * This will cancel the default dropdown behavior.
   */
  onMoreClick?: MouseEventHandler;

  /**
   * Provide additional props to the MoreButton.
   * Example use cases: altering tab order by providing tabIndex;
   * adding onClick behaviour without losing the default dropdown
   */
  showMoreButtonProps?: Partial<React.HTMLAttributes<HTMLElement>>;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  //

  /**
   * Will set these elements when defined:
   * - Container element - `{testId}--avatar-group`
   * - Avatar items - `{testId}--avatar-{index}`
   * - Overflow menu button - `{testId}--overflow-menu--trigger`
   * - Overflow menu content - `{testId}--overflow-menu--content`
   */
  testId?: string;

  /**
   * Custom overrides for the composed components.
   */
  overrides?: AvatarGroupOverrides;

  /**
   * Disables tooltips
   */
  isTooltipDisabled?: boolean;

  /**
      Text to be used as aria-label for the list of avatars.
      Screen reader announcement with default label, which is `avatar group`, is `list, avatar group, X items`.
  
      The label should describe the `AvatarGroup`'s entities, for instance:
      - `label="team members"`, screen reader announcement would be `list team members, X items`
      - `label="reviewers"` screen reader announcement would be `list reviewers, X items`
  
      When there are several AvatarGroups on the page you should use a unique label to let users distinguish different lists.
     */
  name?: string;
}

interface AvatarGroupOverrides {
  AvatarGroupItem?: {
    render?: (
      Component: ElementType<AvatarGroupItemProps>,
      props: AvatarGroupItemProps,
      index: number
    ) => ReactNode;
  };
  Avatar?: {
    render?: (
      Component: ElementType<AvatarProps>,
      props: AvatarProps,
      index: number
    ) => ReactNode;
  };
}

type DeepRequired<T> = {
  [P in keyof T]-?: Required<T[P]>;
};

/**
   * ----- USAGE OF THE COMPONENT ------------
   * 
   *   const data = RANDOM_USERS.map((d, i) => ({
      email: d.email,
      key: d.email,
      name: d.name,
      href: '#',
      src: getFreeToUseAvatarImage(i),
    }));
   * 
  
      <AvatarGroup maxCount={4} data={data} size="xxl" />
   */

function getOverrides(
  overrides?: AvatarGroupOverrides
): DeepRequired<AvatarGroupOverrides> {
  return {
    AvatarGroupItem: {
      render: (Component, props, index) => (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        <Component {...props} key={composeUniqueKey(props.avatar, index)} />
      ),
      ...(overrides && overrides.AvatarGroupItem),
    },
    Avatar: {
      render: (Component, props, index) => (
        <Component {...props} key={composeUniqueKey(props, index)} />
      ),
      ...(overrides && overrides.Avatar),
    },
  };
}

const composeUniqueKey = (props: AvatarProps, index: number) => {
  if (props.key) {
    return props.key;
  }
  return index;
};

const AvatarGroup = ({
  appearance = 'stack',
  avatar = Avatar,
  data,
  isTooltipDisabled,
  maxCount,
  onAvatarClick,
  onMoreClick,
  overrides,
  showMoreButtonProps = {},
  size = 'md',
  name = 'avatar group',
}: AvatarGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onTogglePopover = () => setIsOpen(!isOpen);

  function renderMoreDropdown(max: number, total: number) {
    if (total <= max) {
      return null;
    }

    const renderMoreButton = (
      props: {
        'aria-controls'?: string;
        'aria-expanded'?: boolean;
        'aria-haspopup'?: boolean;
      } & {
        onClick: MouseEventHandler;
        isOpen?: boolean;
      }
    ) => {
      return (
        <MoreIndicator
          buttonProps={showMoreButtonProps}
          count={total - max}
          size={size}
          className={cn(
            'focus:ring-brand-primary-100 relative transform rounded-full ring-2 ring-slate-100 transition duration-200 focus:scale-95',
            props.isOpen && 'ring-brand-primary-100'
          )}
          {...props}
        />
      );
    };

    // bail if the consumer wants to handle onClick
    if (typeof onMoreClick === 'function') {
      return renderMoreButton({
        onClick: onMoreClick,
      });
    }

    return (
      <>
        <Popover open={isOpen} onOpenChange={onTogglePopover}>
          <Popover.Trigger>
            {renderMoreButton({
              onClick: onTogglePopover,
              isOpen,
            })}
          </Popover.Trigger>
          <Popover.Content className="flex flex-col gap-0.5">
            {data?.slice(max)?.map((avatar, index) =>
              getOverrides(overrides).AvatarGroupItem.render(
                AvatarGroupItem,
                {
                  avatar,
                  onAvatarClick,
                  index: index + max,
                },
                // This index holds the true index,
                // adding up the index of non-overflowed avatars and overflowed avatars.
                index + max
              )
            )}
          </Popover.Content>
        </Popover>
      </>
    );
  }

  const max =
    maxCount === undefined || maxCount === 0 ? MAX_COUNT[appearance] : maxCount;
  const total = data?.length;
  const maxAvatar = total > max ? max - 1 : max;
  // const Group = appearance === 'stack' ? Stack : Grid;

  if (!data) {
    return null;
  }

  return (
    <div
      aria-label={name}
      className={cn(
        appearance === 'stack' &&
          'isolate flex items-start -space-x-3 overflow-hidden p-0.5',
        appearance === 'grid' &&
          'isolate grid grid-cols-4 place-items-start gap-3'
      )}
    >
      {data?.slice(0, maxAvatar)?.map((avatarData, idx) => {
        const callback = avatarData.onClick || onAvatarClick;
        const finalAvatar = getOverrides(overrides).Avatar.render(
          avatar,
          {
            ...avatarData,
            size,
            onClick: callback ? callback : undefined,
            // style: {zIndex: `${idx - 4}`},
            className: 'relative inline-block rounded-full ring-2 ring-white',
          },
          idx
        );

        return !isTooltipDisabled && !avatarData.disabled ? (
          <Tooltip key={composeUniqueKey(avatarData, idx)}>
            <Tooltip.Trigger>{finalAvatar}</Tooltip.Trigger>
            <Tooltip.Content>{avatarData.name}</Tooltip.Content>
          </Tooltip>
        ) : (
          finalAvatar
        );
      })}
      {renderMoreDropdown(+maxAvatar, total)}
    </div>
  );
};

export { AvatarGroup, AvatarGroupItem };
