import { profilesDescription } from '@/constants';
import { imageSchema } from '@/validations';
import { ProfileType } from '@prisma/client';
import { CameraIcon } from 'lucide-react';
import React, { type PropsWithChildren, ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { PlacesAutocomplete } from '@/components/agorasafe-map';
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
import { getSanitizedStringSchema } from '@/server/api/validations/base.validations';

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

const RenderSuccessMessage = ({
  createdProfile,
}: {
  createdProfile: SimpleProfile;
}) => {
  const { updateProfile } = useCurrentUser();

  const { reloadWithToast } = useToastOnPageReload(() =>
    createdProfile
      ? toast({
          delay: 3_000,
          icon: <UserAvatar className="h-10 w-10" profile={createdProfile} />,
          variant: 'success',
          description: (
            <p className="text-sm">
              Vous interagissez maintenant en tant que{' '}
              <span className="font-semibold">{createdProfile?.name}</span>
            </p>
          ),
        })
      : null
  );

  return (
    <div className="flex flex-col justify-center p-10">
      <Welcome2Icon className="h-36 w-auto" />
      <div className="mt-6 flex flex-col items-center justify-center text-center">
        <Typography variant="h2">Profil ajouté avec succès !🎉🥳</Typography>
        <Typography variant="subtle" className="mt-2">
          Le profil {createdProfile?.name} à été créé avec succès. Profitez
          d'une expérence unique en basculant facilement entre vos différents
          profils ajoutés.
        </Typography>
        <div className="mt-10 flex items-center justify-center gap-2">
          <Button
            onClick={() => modals.closeAll()}
            className="w-auto"
            variant="ghost"
          >
            Ok, j'ai compris
          </Button>
          <Button
            onClick={() => {
              updateProfile(createdProfile);
              reloadWithToast();
            }}
            className="w-auto"
          >
            Basculer sur le profil créé
          </Button>
        </div>
      </div>
    </div>
  );
};

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
