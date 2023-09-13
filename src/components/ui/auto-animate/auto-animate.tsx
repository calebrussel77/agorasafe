// import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { type ElementType, type HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

const AutoAnimate: React.FC<Props> = ({
  as: Tag = 'div',
  children,
  ...rest
}) => {
  // const [ref] = useAutoAnimate<HTMLElement>();
  return (
    <Tag {...rest}>
      {children}
    </Tag>
  );
};

export { AutoAnimate };
