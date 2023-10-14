import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { type FC, type ReactElement } from 'react';

import { isString } from '@/utils/type-guards';

import { cn } from '@/lib/utils';

export interface AnchorProps extends NextLinkProps {
  children: ReactElement | string | JSX.Element;
  className?: string;
}

const Anchor: FC<AnchorProps> = ({ children, href, className, ...rest }) => {
  const isChildrenString = isString(children);

  return (
    <NextLink
      href={href}
      passHref={!isChildrenString}
      className={cn(className)}
      {...rest}
    >
      <a className={cn(className)}>{children}</a>
    </NextLink>
  );
};

export { Anchor };
