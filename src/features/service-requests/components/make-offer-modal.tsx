import { useRouter } from 'next/router';
import React, { type FC, type ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { Modal, useModal } from '@/components/ui/modal';

import { MakeOfferForm } from './make-offer-form';

interface MakeOfferModalProps {
  className?: string;
  children?: ReactElement;
}

const MakeOfferModal: FC<MakeOfferModalProps> = ({ children }) => {
  const { onOpenChange, open: isOpen } = useModal();

  return (
    <Modal
      {...{ onOpenChange, open: isOpen }}
      classNames={{
        footer: 'flex items-center gap-3 justify-end',
      }}
      trigger={<span>{children}</span>}
      triggerProps={{ asChild: true }}
      footer={
        <>
          <Button
            onClick={() => onOpenChange(false)}
            type="button"
            variant="ghost"
          >
            Annuler
          </Button>
          <Button>Envoyer</Button>
        </>
      }
      name="Faire une offre de service"
    >
      <MakeOfferForm />
    </Modal>
  );
};

export { MakeOfferModal };
