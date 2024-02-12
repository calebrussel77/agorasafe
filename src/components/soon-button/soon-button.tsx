import React, { type PropsWithChildren } from 'react';

import { Badge } from '../ui/badge';
import { Button, type ButtonProps } from '../ui/button';

type SoonButtonProps = ButtonProps;

const SoonBadge = () => <Badge content="Bientôt" size="xs" variant="default" />;

const SoonButton = ({
  children,
  ...props
}: PropsWithChildren<SoonButtonProps>) => {
  return (
    <Button variant="ghost" disabled {...props}>
      {children}
      <SoonBadge />
    </Button>
  );
};

export { SoonButton, SoonBadge };
