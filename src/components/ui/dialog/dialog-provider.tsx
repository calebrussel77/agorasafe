/* eslint-disable @typescript-eslint/naming-convention */
import React, { createContext, useContext, useEffect, useState } from 'react';
import trieMemoize from 'trie-memoize';

import {
  type Dialog,
  dialogStore,
  useDialogStore,
} from '@/components/ui/dialog/dialog-store';

type DialogState = {
  opened: boolean;
  handleClose: () => void;
  zIndex: number;
};

const DialogContext = createContext<DialogState>({
  opened: false,
  handleClose: () => undefined,
  zIndex: 200,
});
export const useDialogContext = () => useContext(DialogContext);

const DialogProviderInner = ({
  dialog,
  index,
}: {
  dialog: Dialog;
  index: number;
}) => {
  const [opened, setOpened] = useState(false);

  const Dialog = dialog.component;
  const handleClose = () => {
    dialog.options?.onClose?.();
    dialogStore.closeById(dialog.id);
  };

  useEffect(() => {
    setTimeout(() => {
      setOpened(true);
    }, 0);
  }, []);

  return (
    <DialogContext.Provider
      value={{ opened, handleClose, zIndex: 200 + index }}
    >
      <Dialog {...dialog.props} />
    </DialogContext.Provider>
  );
};

export const DialogProvider = () => {
  const dialogs = useDialogStore(state => state.dialogs);
  return (
    <>
      {dialogs.map((dialog, i) => (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        <div key={dialog.id.toString()}>{createRenderElement(dialog, i)}</div>
      ))}
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const createRenderElement = trieMemoize(
  [WeakMap, {}],
  (dialog: Dialog, index: number) => (
    <DialogProviderInner dialog={dialog} index={index} />
  )
);
