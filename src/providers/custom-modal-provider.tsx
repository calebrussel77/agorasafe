import {
  type ModalProps,
  ModalsProvider,
  closeContextModal,
  openContextModal,
} from '@/components/ui/modal';

import { ConversationFileUploadFormModal } from '@/features/conversations';
import { FeedbackFormModal } from '@/features/feedbacks';
import {
  CreateServiceRequestModal,
  CustomServiceRequestCategoriesModal,
} from '@/features/services';

const modals = {
  feedbackForm: FeedbackFormModal,
  customServiceRequestCategories: CustomServiceRequestCategoriesModal,
  createServiceRequest: CreateServiceRequestModal,
  conversationFileUploadForm: ConversationFileUploadFormModal,
};

export const CustomModalsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ModalsProvider
      labels={{
        confirm: 'Confirmer',
        cancel: 'Annuler',
      }}
      modals={modals}
    >
      {children}
    </ModalsProvider>
  );
};

type InnerProps<TName extends keyof typeof modals> = Prettify<
  Pick<Parameters<(typeof modals)[TName]>[0], 'innerProps'>
>;

export function openContext<TName extends keyof typeof modals>(
  modal: TName,
  props: Prettify<InnerProps<TName>['innerProps']>,
  modalProps?: Prettify<
    Omit<
      ModalProps,
      'open' | 'onOpenChange' | 'title' | 'description' | 'children'
    >
  >
) {
  openContextModal<TName>({
    modal,
    innerProps: props,
    ...modalProps,
  });
}

export function closeContext<TName extends keyof typeof modals>(modal: TName) {
  closeContextModal(modal);
}
