import React from 'react';

import { Button } from '@/components/ui/button';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import {
  type ContextModalProps,
  ModalFooter,
  ModalHeader,
  ModalMain,
} from '@/components/ui/modal';
import { SectionMessage } from '@/components/ui/section-message';
import { toast } from '@/components/ui/toast';
import { useUpload } from '@/components/ui/uploadthing';

import { api } from '@/utils/api';
import { isArray } from '@/utils/type-guards';

import { type FeedBackFormInput, FeedbackForm } from './feedback-form';

const formId = 'feedback-form';

const FeedbackFormModal = ({
  context: ctx,
  id,
}: ContextModalProps<Record<string, any>>) => {
  const createFeedbackMutation = api.feedbacks.create.useMutation({
    onSuccess() {
      toast({
        delay: 1000,
        variant: 'success',
        title: 'Formulaire soumis avec succès !',
        description:
          'Nous vous remercions de nous avoir partagé vos commentaires.',
      });
    },
  });

  const { startUpload, isUploading } = useUpload({
    endpoint: 'feedbackImages',
  });

  const onSubmit = async (formData: FeedBackFormInput) => {
    const files = formData?.image
      ? await startUpload(formData?.image as File[])
      : undefined;
    const imageUrl = isArray(files) && files ? files[0]?.url : undefined;

    createFeedbackMutation.mutate({
      content: formData?.content,
      imageUrl,
      type: formData?.type,
    });
  };

  return (
    <>
      <ModalHeader
        title="😊 Partagez votre avis sur Agorasafe"
        description="Nous attachons une grande importance à votre opinion. Aidez-nous à améliorer Agorasafe en partageant vos commentaires. Votre avis compte !"
      />
      <ModalMain className="relative">
        <LoadingOverlay
          visible={createFeedbackMutation.isLoading || isUploading}
        />
        {createFeedbackMutation.error && (
          <SectionMessage
            description={createFeedbackMutation.error?.message}
            appareance="danger"
          />
        )}
        {createFeedbackMutation?.isSuccess ? (
          <SectionMessage
            title="Formulaire soumis avec succès !"
            description="Nous vous remercions de nous avoir partagé vos commentaires."
            appareance="success"
            hasCloseButton={false}
          />
        ) : (
          <FeedbackForm id={formId} onSubmit={onSubmit} />
        )}
      </ModalMain>
      <ModalFooter>
        {!createFeedbackMutation?.isSuccess && (
          <Button
            type="submit"
            isLoading={createFeedbackMutation.isLoading || isUploading}
            form={formId}
          >
            Envoyer
          </Button>
        )}
      </ModalFooter>
    </>
  );
};

export { FeedbackFormModal };
