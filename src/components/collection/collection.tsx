import OneKeyMap from '@essentials/one-key-map';
import { Fragment, type PropsWithChildren, useCallback, useState } from 'react';
import trieMemoize from 'trie-memoize';

import { cn } from '@/lib/utils';

import { Badge, type BadgeProps } from '../ui/badge';

export function Collection<T>({
  items,
  renderItem,
  limit = 5,
  spacing = 'sm',
  grouped = false,
  badgeProps,
}: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  if (!items.length) return null;

  const displayedItems = items.slice(0, limit);
  const collapsedItems = items.slice(limit);

  const renderedItems = (
    <>
      {displayedItems.map((item, index) => (
        <Fragment key={`displayed_${index}`}>
          {createRenderElement(renderItem, index, item)}
        </Fragment>
      ))}
      {collapsedItems.length > 0 && isOpen
        ? collapsedItems.map((item, index) => (
            <Fragment key={`collapsed_${index}`}>
              {createRenderElement(renderItem, index, item)}
            </Fragment>
          ))
        : null}
      {collapsedItems.length > 0 &&
        (!isOpen ? (
          <Badge
            as="button"
            variant="primary"
            size="sm"
            className="cursor-pointer"
            content={`+ ${collapsedItems.length}`}
            {...badgeProps}
            onClick={onOpen}
          />
        ) : (
          <Badge
            as="button"
            variant="primary"
            size="sm"
            className="cursor-pointer"
            content={`- Hide`}
            {...badgeProps}
            onClick={onClose}
          />
        ))}
    </>
  );

  return grouped ? (
    <Group spacing={spacing}>{renderedItems}</Group>
  ) : (
    renderedItems
  );
}

type Props<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  limit?: number;
  spacing?: 'xs' | 'sm' | 'md';
  grouped?: boolean;
  badgeProps?: Omit<BadgeProps, 'content'>;
};

// supposedly ~5.5x faster than createElement without the memo
const createRenderElement = trieMemoize(
  [OneKeyMap, {}, WeakMap],
  (RenderComponent, index: number, item) => (
    <RenderComponent index={index} {...item} />
  )
);

const Group = ({
  children,
  appearance,
  spacing,
}: PropsWithChildren<{
  appearance?: 'stack' | 'grid';
  spacing: 'xs' | 'sm' | 'md';
}>) => {
  return (
    <div
      className={cn(
        appearance === 'stack' &&
          'isolate flex items-start overflow-hidden p-0.5',
        spacing === 'xs' && '-space-x-1.5',
        spacing === 'sm' && '-space-x-2.5',
        spacing === 'md' && '-space-x-3.5'
      )}
    >
      {children}
    </div>
  );
};
