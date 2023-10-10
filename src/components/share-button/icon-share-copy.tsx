import { Copy, CopyCheck } from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';


export function IconCopy({
  copied,
  className,
}: {
  copied: boolean;
  className?: string;
}) {
  const _className = cn(
    'h-5 w-5',
    copied ? 'text-green-600' : 'text-gray-600',
    className
  );

  return (
    <>
      {copied ? (
        <CopyCheck className={_className} />
      ) : (
        <Copy className={_className} />
      )}
    </>
  );
}
