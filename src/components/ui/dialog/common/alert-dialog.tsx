import { CheckCircle, Info, X } from 'lucide-react';

import { Modal, ModalHeader, ModalMain } from '../../modal/modal';
import { Typography } from '../../typography';
import { useDialogContext } from '../dialog-provider';

const DIALOG_TYPES = ['success', 'error', 'info'] as const;
type DialogType = (typeof DIALOG_TYPES)[number];

type Props = {
  type: DialogType;
  children?:
    | React.ReactNode
    | ((props: { handleClose: () => void }) => React.ReactNode);
  title?: string | React.ReactNode;
  icon?: React.ReactNode;
};

const DEFAULT_DIALOG_TEMPLATES: Record<DialogType, Omit<Props, 'type'>> = {
  success: {
    title: 'Succès !',
    icon: <CheckCircle size={22} />,
    children: <Typography>Operation terminée avec succès</Typography>,
  },
  error: {
    title: 'Erreur',
    icon: <X size={22} />,
    children: (
      <Typography>
        Une erreur s'est produite. Veuillez réessayer plus tard !
      </Typography>
    ),
  },
  info: {
    title: 'Hey, Ecoutes!',
    icon: <Info size={22} />,
  },
};

export const AlertDialog = ({ type, ...props }: Props) => {
  const dialog = useDialogContext();
  const handleClose = dialog.handleClose;
  const { children, icon, title } = {
    ...DEFAULT_DIALOG_TEMPLATES[type],
    ...props,
  };

  return (
    <Modal
      open={dialog.opened}
      onOpenChange={dialog.handleClose}
      style={{ zIndex: dialog.zIndex }}
    >
      {(title || icon) && (
        <ModalHeader
          title={
            <div className="flex items-center gap-2">
              {icon}
              {typeof title === 'string' ? (
                <Typography as="h3">{title}</Typography>
              ) : (
                title
              )}
            </div>
          }
        />
      )}

      {children && (
        <ModalMain>
          {typeof children === 'function'
            ? children({ handleClose })
            : children}
        </ModalMain>
      )}
    </Modal>
  );
};
