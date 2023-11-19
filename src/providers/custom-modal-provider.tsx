import { ModalsProvider } from '@/components/ui/modal';

import { ConversationFileUploadFormModal } from '@/features/conversations';
import { FeedbackFormModal } from '@/features/feedbacks';
import { AddProfileModal } from '@/features/profiles';
import {
  CreateServiceRequestModal,
  CustomServiceRequestCategoriesModal,
} from '@/features/service-requests';

//TODO: Need to find a way of using dynamic imports whithout typescript errors and continue having autocomplete
export const appModals = {
  feedbackForm: FeedbackFormModal,
  customServiceRequestCategories: CustomServiceRequestCategoriesModal,
  createServiceRequest: CreateServiceRequestModal,
  conversationFileUploadForm: ConversationFileUploadFormModal,
  addProfile: AddProfileModal,
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
