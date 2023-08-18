import React, { type FC, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface FixedFooterFormProps {
  className?: string;
  children: ReactNode;
}

const FixedFooterForm: FC<FixedFooterFormProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-10 mt-16 w-full border-t border-gray-200 bg-white px-6 py-3 shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-end gap-6">{children}</div>
    </div>
  );
};

export { FixedFooterForm };
