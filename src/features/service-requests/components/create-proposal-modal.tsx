import { profilesDescription } from '@/constants';
import { getSanitizedStringSchema, imageSchema } from '@/validations';
import { ProfileType } from '@prisma/client';
import { CameraIcon } from 'lucide-react';
import React, { type PropsWithChildren, ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Welcome2Icon } from '@/components/icons/welcome2-icon';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import {
  ContextModalProps,
  ModalFooter,
  ModalHeader,
  ModalMain,
  modals,
} from '@/components/ui/modal';
import { PhoneInput } from '@/components/ui/phone-input';
import { Editor } from '@/components/ui/rich-text-editor';
import { SectionMessage } from '@/components/ui/section-message';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { useUpload } from '@/components/ui/uploadthing';
import { UserAvatar } from '@/components/user';

import { api } from '@/utils/api';
import { isArrayOfFile } from '@/utils/type-guards';

import { htmlParse } from '@/lib/html-helper';

import { SimpleProfile } from '@/server/api/modules/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useToastOnPageReload } from '@/hooks/use-toast-on-page-reload';

interface CreateProposalModalProps {
  className?: string;
  serviceRequestName: string;
  serviceRequestId: string;
}

const schema = z.object({
  price: z.coerce
    .number()
    .min(3, 'Votre nom doit avoir au moins 03 caractères.'),
  content: getSanitizedStringSchema(),
});

type FormDataInput = z.infer<typeof schema>;


const CreateProposalModal = ({
  context,
  id,
  innerProps: { serviceRequestName, serviceRequestId },
}: ContextModalProps<CreateProposalModalProps>) => {
  const form = useZodForm({
    schema,
  });
  const queryUtils = api.useContext();

  const { control, reset } = form;

  const proposalMutation = api.serviceRequests.createProposal.useMutation({
    onError(error) {
      toast({
        variant: 'danger',
        title: 'Une erreur est survenue',
        description: error?.message,
      });
    },
    async onSuccess(data) {
      await queryUtils.serviceRequests.getProposals.invalidate({
        id: serviceRequestId,
      });
      await queryUtils.serviceRequests.get.invalidate({
        id: serviceRequestId,
      });
      await queryUtils.serviceRequests.getStats.invalidate({
        id: serviceRequestId,
      });
      reset();
      toast({
        variant: 'success',
        title: 'Votre proposition à été soumise avec succès !',
      });
      context.closeAll();
    },
  });

  const onSubmit = (formData: FormDataInput) => {
    proposalMutation.mutate({
      serviceRequestId,
      ...formData,
    });
  };

  return (
    <>
      <ModalHeader title={`🎯 Faire une proposition sur la demande`} />
      <ModalMain className="relative mx-auto w-full max-w-3xl">
        <SectionMessage
          appareance="info"
          hasCloseButton={false}
          description={`Vous êtes sur le point de marquer votre intérêt en faisant une proposition sur la demande " ${serviceRequestName} "`}
        />
        {proposalMutation.error && (
          <SectionMessage
            appareance="danger"
            title={proposalMutation.error?.message}
          />
        )}
        <LoadingOverlay visible={proposalMutation.isLoading} />

        <Form onSubmit={onSubmit} form={form} gap="lg" className="pt-2">
          <Field label="Votre prix (CFA)" required>
            <Controller
              control={control}
              name="price"
              render={({ field: { ref, onChange, value }, fieldState }) => (
                <Input
                  ref={ref}
                  variant={fieldState.error ? 'danger' : undefined}
                  autoFocus={true}
                  onChange={onChange}
                  type="number"
                  value={(value as never) || ''}
                  placeholder="Entrez votre prix"
                />
              )}
            />
          </Field>
          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, value }, fieldState }) => {
              return (
                <Editor
                  required
                  id="profile-bio-content"
                  label="Votre message"
                  placeholder="Dites en quoi votre proposition serait plus intéressante..."
                  error={fieldState?.error?.message}
                  editorSize="md"
                  value={value || ''}
                  onChange={onChange}
                />
              );
            }}
          />
        </Form>
      </ModalMain>
      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          disabled={proposalMutation.isLoading}
          onClick={() => context.closeModal(id)}
        >
          Annuler
        </Button>
        <Button
          size="lg"
          type="submit"
          onClick={() => form.handleSubmit(onSubmit)()}
          isLoading={proposalMutation.isLoading}
        >
          Enregistrer
        </Button>
      </ModalFooter>
    </>
  );
};

export { CreateProposalModal };
