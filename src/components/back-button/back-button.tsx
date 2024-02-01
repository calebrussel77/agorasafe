import { MoveLeft } from 'lucide-react';
import { type LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React, { type PropsWithChildren, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Anchor } from '../anchor';
import { Spinner } from '../ui/spinner';

interface BackButtonProps {
  className?: string;
  isLoading?: boolean;
  label?: ReactNode;
  href?: LinkProps['href'];
  asLink?: LinkProps['as'];
}

const BackButton = ({
  className,
  href,
  asLink,
  label = 'Retour',
  isLoading,
  children,
}: PropsWithChildren<BackButtonProps>) => {
  const router = useRouter();
  const finalClassName = cn(
    className,
    'inline-flex flex-nowrap items-center gap-2 px-2 py-1.5 -mx-2 text-gray-600 hover:bg-gray-100 rounded-md'
  );
  const content = (
    <>
      <MoveLeft className="h-5 w-5" />
      {label}
    </>
  );

  if (isLoading)
    return <Spinner size="sm" variant="ghost" className={className} />;

  if (href) {
    return (
      <Anchor href={href} as={asLink} className={finalClassName}>
        {content}
      </Anchor>
    );
  }

  return (
    <button onClick={router.back} className={finalClassName}>
      {content}
    </button>
  );
};

export { BackButton };
