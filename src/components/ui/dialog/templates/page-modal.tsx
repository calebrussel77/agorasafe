import { useEffect } from 'react';

import {
  Modal,
  ModalHeader,
  type ModalHeaderProps,
  ModalMain,
  type ModalProps,
} from '../../modal/modal';
import { Typography } from '../../typography';
import { useStackingContext } from '../dialog-store';

export function PageModal(props: ModalProps & ModalHeaderProps) {
  const {
    open: isOpen,
    title,
    withCloseIcon = false,
    description,
    classNames,
    children,
  } = props;
  const { increase, decrease } = useStackingContext();
  useEffect(() => {
    increase();

    return () => {
      decrease();
    };
  }, [isOpen]);

  return (
    <Modal {...props} isFullScreen>
      {title && (
        <ModalHeader
          withCloseIcon={withCloseIcon}
          description={description}
          classNames={classNames}
          title={
            typeof title === 'string' ? (
              <Typography as="h3">{title}</Typography>
            ) : (
              title
            )
          }
        />
      )}
      {children && <ModalMain>{children}</ModalMain>}
    </Modal>
  );
}
