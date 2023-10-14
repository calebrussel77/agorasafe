import { type LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { type FC, type ReactNode } from 'react';
import { format } from 'url';

import { isPathMatchRoute } from '@/utils/routing';

import { cn } from '@/lib/utils';

import { Anchor, type AnchorProps } from '../anchor';

interface ActiveLinkProps extends AnchorProps {
  className?: string;
  activeClassName: string;
}

const ActiveLink: FC<ActiveLinkProps> = ({
  children,
  href,
  activeClassName,
  className,
  ...rest
}) => {
  const { asPath } = useRouter();
  const isMatch = isPathMatchRoute(format(href), asPath);

  return (
    <Anchor
      href={href}
      className={cn(className, isMatch && activeClassName)}
      {...rest}
    >
      {children}
    </Anchor>
  );
};

export { ActiveLink };
