import { type ReactNode, createContext } from 'react';

import type { ConfirmModalProps } from './confirmModal';
import { type ModalProps } from './modal';

export type ModalSettings = Partial<Omit<ModalProps, 'open'>> & {
  modalId?: string;
};

export type ConfirmLabels = Record<'confirm' | 'cancel', ReactNode>;

export interface OpenConfirmModal extends ModalSettings, ConfirmModalProps {}
export interface OpenContextModal<
  CustomProps extends Record<string, any> = Record<string, never>
> extends ModalSettings {
  innerProps: CustomProps;
}

export interface ContextModalProps<T extends Record<string, any> = object> {
  context: ModalsContextProps;
  innerProps: T;
  id: string;
}

export type ModalState =
  | { id: string; props: ModalSettings; type: 'content' }
  | { id: string; props: OpenConfirmModal; type: 'confirm' }
  | { id: string; props: OpenContextModal; type: 'context'; ctx: string };

export interface ModalsContextProps {
  modals: ModalState[];
  openModal: (props: ModalSettings) => string;
  openConfirmModal: (props: OpenConfirmModal) => string;
  openContextModal: <TKey extends MantineModal>(
    modal: TKey,
    props: OpenContextModal<Parameters<MantineModals[TKey]>[0]['innerProps']>
  ) => string;
  closeModal: (id: string, canceled?: boolean) => void;
  closeContextModal: <TKey extends MantineModal>(
    id: TKey,
    canceled?: boolean
  ) => void;
  closeAll: () => void;
}

export type MantineModalsOverride = Record<string, never>;

export type MantineModalsOverwritten = MantineModalsOverride extends {
  modals: Record<string, React.FC<ContextModalProps<any>>>;
}
  ? MantineModalsOverride
  : {
      modals: Record<string, React.FC<ContextModalProps<any>>>;
    };

export type MantineModals = MantineModalsOverwritten['modals'];

export type MantineModal = keyof MantineModals;

export const ModalsContext = createContext<ModalsContextProps>(null as never);
ModalsContext.displayName = '@agorasafe/modals/ModalsContext';
