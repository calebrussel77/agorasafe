import {
  ModalsProvider,
} from '@/components/ui/modal';

import { ConversationFileUploadFormModal } from '@/features/conversations';
import { FeedbackFormModal } from '@/features/feedbacks';
import {
  CreateServiceRequestModal,
  CustomServiceRequestCategoriesModal,
} from '@/features/services';

export const appModals = {
  feedbackForm: FeedbackFormModal,
  customServiceRequestCategories: CustomServiceRequestCategoriesModal,
  createServiceRequest: CreateServiceRequestModal,
  conversationFileUploadForm: ConversationFileUploadFormModal,
};

// neccessary to add type checking of the mantine context modals implementation in the app
declare module '@/components/ui/modal' {
  export interface MantineModalsOverride {
    modals: typeof appModals;
  }
}

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
      modals={appModals}
    >
      {children}
    </ModalsProvider>
  );
};
