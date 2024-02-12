import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { type FC, type ReactNode } from 'react';

import { isString } from '@/utils/type-guards';

import { cn } from '@/lib/utils';

export interface AnchorProps extends NextLinkProps {
  // children: ReactElement | string | JSX.Element;
  children: ReactNode;
  className?: string;
}

const Anchor: FC<AnchorProps> = ({
  children,
  href,
  onClick,
  className,
  ...rest
}) => {
  const isChildrenString = isString(children);

  return (
    <NextLink
      href={href}
      passHref={!isChildrenString}
      className={cn(className)}
      {...rest}
    >
      <a className={cn(className)} onClick={onClick}>
        {children}
      </a>
    </NextLink>
  );
};

export { Anchor };
