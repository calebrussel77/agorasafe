import React, { cloneElement } from 'react';

import { CanView } from '@/components/can-view';
import { openContextModal } from '@/components/ui/modal';

import { LoginRedirect } from '@/features/auth';

import { useIsMobile } from '@/hooks/use-breakpoints';

interface ServiceRequestButtonProps {
  className?: string;
  children: React.ReactElement;
}

const ServiceRequestButton = ({ children }: ServiceRequestButtonProps) => {
  const isMobile = useIsMobile();

  const handleClick = () => {
    openContextModal({
      isFullScreen: isMobile,
      modal: 'createServiceRequest',
      innerProps: {},
    });
  };

  return (
    // TODO : Need to add a login popover before creating service request if not logged in
    <CanView allowedProfiles={['CUSTOMER']} isPublic>
      <LoginRedirect reason="create-service-request">
        {cloneElement(children, {onClick: handleClick  })}
      </LoginRedirect>
    </CanView>
  );
};

export { ServiceRequestButton };
