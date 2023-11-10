import { openContext } from '@/providers/custom-modal-provider';
import React, {
  type PropsWithChildren,
  type ReactElement,
  cloneElement,
} from 'react';

import { CanView } from '@/components/can-view';

import { LoginRedirect } from '@/features/auth';

interface ServiceRequestButtonProps {
  className?: string;
}

const ServiceRequestButton = ({
  children,
}: PropsWithChildren<ServiceRequestButtonProps>) => {
  return (
    // TODO : Need to add a login popover before creating service request if not logged in
    <CanView allowedProfiles={['CUSTOMER']} isPublic>
      <LoginRedirect reason="create-service-request">
        {children as never}
      </LoginRedirect>
    </CanView>
  );
};

export { ServiceRequestButton };
