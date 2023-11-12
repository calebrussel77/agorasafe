import React, { type ReactElement, cloneElement } from 'react';

import { openContextModal } from '@/components/ui/modal';

import { useIsMobile } from '@/hooks/use-breakpoints';

interface FeedbackButtonProps {
  className?: string;
  children: ReactElement;
}

const FeedbackButton = ({ children }: FeedbackButtonProps) => {
  const isMobile = useIsMobile();

  const handleClick = () => {
    openContextModal({
      isFullScreen: isMobile,
      modal: 'feedbackForm',
      innerProps: {},
    });
  };

  return (
    // TODO : Need to add a login popover before creating feedback if not logged in
    <>{cloneElement(children, { onClick: handleClick })}</>
  );
};

export { FeedbackButton };
