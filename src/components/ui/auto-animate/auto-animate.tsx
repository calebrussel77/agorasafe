import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { type ElementType, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface Props extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

const AutoAnimate: React.FC<Props> = ({
  as: Tag = 'div',
  children,
  className,
  ...rest
}) => {
  const [ref] = useAutoAnimate<HTMLElement>();
  return (
    <Tag ref={ref} className={cn('overflow-hidden', className)} {...rest}>
      {children}
    </Tag>
  );
};

export { AutoAnimate };
