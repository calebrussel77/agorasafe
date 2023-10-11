import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { type FC, type ReactNode } from 'react';
import { format } from 'url';

import { isPathMatchRoute } from '@/utils/routing';

import { cn } from '@/lib/utils';

import { usePathWithSearchParams } from '@/hooks/use-path-with-search-params';

interface ActiveLinkProps extends NextLinkProps {
  children: ReactNode;
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
  const path = usePathWithSearchParams();
  const isMatch = isPathMatchRoute(format(href), path);

  return (
    <NextLink
      href={href}
      className={cn(className, isMatch && activeClassName)}
      {...rest}
    >
      {children}
    </NextLink>
  );
};

export { ActiveLink };
