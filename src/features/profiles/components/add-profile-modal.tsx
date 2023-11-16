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
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { FileUpload } from '@/components/ui/file-upload';
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
import { RadioGroup } from '@/components/ui/radio-group';
import { Editor } from '@/components/ui/rich-text-editor';
import { SectionMessage } from '@/components/ui/section-message';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { useUpload } from '@/components/ui/uploadthing';
import { UserAvatar } from '@/components/user';

import { api } from '@/utils/api';
import { getIsFaceToFaceLabel, getIsRemoteLabel } from '@/utils/profile';
import { isArrayOfFile } from '@/utils/type-guards';

import { htmlParse } from '@/lib/html-helper';
import { cn } from '@/lib/utils';

import { SimpleProfile } from '@/server/api/modules/profiles';
import {
  onboardClientProfileSchema,
  onboardProviderProfileSchema,
} from '@/server/api/modules/users/users.validations';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useToastOnPageReload } from '@/hooks/use-toast-on-page-reload';

interface AddProfileModalProps {
  className?: string;
  choosedProfileType: ProfileType;
}

const schema = z.discriminatedUnion('profileType', [
  onboardClientProfileSchema.extend({
    profileType: z.literal(ProfileType.CUSTOMER),
    avatar: imageSchema.nullish(),
  }),
  onboardProviderProfileSchema.omit({ skillsId: true }).extend({
    profileType: z.literal(ProfileType.PROVIDER),
    avatar: imageSchema.nullish(),
    skills: z
      .array(z.object({ label: z.string(), value: z.string() }), {
        required_error: 'Vous devez rajouter vos engagements client.',
      })
      .length(3, 'Vous ne pouvez rajouter que 03 engagements client.'),
  }),
]);

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

const AddProfileModal = ({
  context,
  id,
  innerProps: { choosedProfileType },
}: ContextModalProps<AddProfileModalProps>) => {
  const form = useZodForm({
    schema,
  });
  const { updateUser } = useCurrentUser();

  const { control, reset } = form;

  const { startUpload, isUploading } = useUpload({
    endpoint: 'profilePhotos',
  });

  const { data: skills, isInitialLoading: isSkillsLoading } =
    api.skills.getAll.useQuery();

  const {
    mutate,
    isLoading: isCreateProfileLoading,
    error: createProfileError,
  } = api.profiles.createProfile.useMutation({
    async onSuccess(data) {
      await updateUser();
      context.closeModal(id);
      reset();
      toast({
        delay: 3_000,
        title: htmlParse(data?.message),
        variant: 'success',
      });
      modals.open({
        children: <RenderSuccessMessage createdProfile={data?.profile} />,
      });
    },
  });

  const profileInfo = profilesDescription[choosedProfileType];
  const isProvider = choosedProfileType === 'PROVIDER';

  const isLoading = isUploading || isCreateProfileLoading;

  const onSubmit = async (formData: FormDataInput) => {
    const userAvatar = isArrayOfFile(formData.avatar)
      ? await startUpload(formData.avatar).then(res =>
          res ? res[0]?.url : null
        )
      : null;

    if (formData.profileType === 'PROVIDER') {
      const { skills, avatar, ...rest } = formData;
      mutate({
        ...rest,
        avatar: userAvatar ?? null,
        skillsId: skills?.map(skill => skill.value),
      });
    } else {
      const { avatar, ...rest } = formData;
      mutate({
        ...rest,
        avatar: userAvatar ?? null,
      });
    }
  };

  return (
    <>
      <ModalHeader title={`Ajouter un profil ${profileInfo.label}`} />
      <ModalMain className="relative">
        {createProfileError && (
          <SectionMessage
            appareance="danger"
            title={createProfileError?.message}
          />
        )}
        <LoadingOverlay visible={isLoading} />

        <Form onSubmit={onSubmit} form={form} gap="lg">
          <div className="mx-auto flex items-center justify-center">
            <Field>
              <Controller
                control={control}
                name="avatar"
                render={({ field: { ref, onChange, value } }) => (
                  <FileUpload
                    ref={ref}
                    handleAddFile={onChange}
                    value={value as never}
                    preview={null}
                  >
                    {({ openFile, files }) => {
                      return (
                        <Badge
                          content={
                            <button
                              type="button"
                              onClick={openFile}
                              className="rounded-full p-0.5"
                            >
                              <CameraIcon className="h-4 w-4" />
                            </button>
                          }
                          variant="primary"
                          size="sm"
                          placement="bottom-right"
                        >
                          <Avatar
                            className="h-20 w-20 cursor-pointer"
                            onClick={openFile}
                            alt="preview avatar"
                            src={files[0]?.preview || undefined}
                            isBordered
                          />
                        </Badge>
                      );
                    }}
                  </FileUpload>
                )}
              />
            </Field>
          </div>

          <SectionContainer title="Personnel">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nom d'utilisateur" required>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { ref, onChange, value }, fieldState }) => (
                    <Input
                      ref={ref}
                      variant={fieldState.error ? 'danger' : undefined}
                      autoFocus={true}
                      onChange={onChange}
                      value={(value as never) || ''}
                      placeholder="Entrez le nom de votre profil"
                    />
                  )}
                />
              </Field>
              <Field label="Numéro de téléphone" required>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { ref, onChange, value }, fieldState }) => (
                    <PhoneInput
                      ref={ref}
                      variant={fieldState.error ? 'danger' : undefined}
                      onChange={onChange}
                      value={value as never}
                      placeholder="Entrez votre numéro de téléphone"
                    />
                  )}
                />
              </Field>
            </div>
            <Field
              label="Adresse"
              hint="Nous vous proposerons du contenu pertinent en fonction de cette position."
              required
            >
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, value }, fieldState }) => (
                  <PlacesAutocomplete
                    variant={fieldState.error ? 'danger' : undefined}
                    placeholder="Selectionnez votre lieu de résidence"
                    placeholderSearch="Recherchez..."
                    onSelectPlace={onChange}
                    selectedPlace={value as never}
                  />
                )}
              />
            </Field>
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, value }, fieldState }) => {
                return (
                  <Editor
                    id="profile-bio-content"
                    label="Bio (180 caractères max.)"
                    placeholder="Dites aux autres ce qui vous caractérise le plus..."
                    error={fieldState?.error?.message}
                    editorSize="md"
                    value={value || ''}
                    onChange={onChange}
                  />
                );
              }}
            />
          </SectionContainer>

          {isProvider && (
            <SectionContainer title="Professionnel">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Profession" required>
                  <Controller
                    control={control}
                    name="profession"
                    render={({
                      field: { ref, onChange, value },
                      fieldState,
                    }) => (
                      <Input
                        ref={ref}
                        variant={fieldState.error ? 'danger' : undefined}
                        onChange={onChange}
                        value={(value as never) || ''}
                        placeholder="Entrez votre profession"
                      />
                    )}
                  />
                </Field>
                <Field label="Vos engagements client (Max. 03)" required>
                  <Controller
                    name="skills"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Select
                        isMulti
                        isLoading={isSkillsLoading}
                        variant={error ? 'danger' : undefined}
                        isClearable={false}
                        onChange={field.onChange}
                        value={field.value as never}
                        options={skills?.map(el => ({
                          value: el.id,
                          label: el.name,
                        }))}
                      />
                    )}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Controller
                  name="isRemote"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <Field label={getIsRemoteLabel(true)}>
                      <Checkbox
                        defaultChecked
                        onCheckedChange={field.onChange}
                        checked={field.value as never}
                      />
                    </Field>
                  )}
                />
                <Controller
                  name="isFaceToFace"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <Field label={getIsFaceToFaceLabel(true)}>
                      <Checkbox
                        onCheckedChange={field.onChange}
                        checked={field.value as never}
                      />
                    </Field>
                  )}
                />
              </div>
            </SectionContainer>
          )}

          <Separator />

          <Controller
            name="profileType"
            control={control}
            defaultValue={choosedProfileType}
            render={({ field }) => (
              <RadioGroup
                defaultValue={field.value}
                className="cursor-not-allowed opacity-60"
                required
                disabled
              >
                <Label
                  key={choosedProfileType}
                  className={cn(
                    'flex items-center gap-2 rounded-md border p-4 shadow transition duration-300 hover:bg-zinc-100',
                    'cursor-not-allowed shadow-brand-500 ring-2 ring-brand-500'
                  )}
                  htmlFor={choosedProfileType}
                >
                  <RadioGroup.Item
                    value={choosedProfileType}
                    id={choosedProfileType}
                  />
                  <div>
                    <Typography as="h4">{profileInfo.label}</Typography>
                    <Typography variant="small" className="font-normal">
                      {profileInfo.description}
                    </Typography>
                  </div>
                </Label>
              </RadioGroup>
            )}
          />
        </Form>
      </ModalMain>
      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => context.closeModal(id)}
        >
          Annuler
        </Button>
        <Button
          size="lg"
          type="submit"
          onClick={() => form.handleSubmit(onSubmit)()}
          isLoading={isLoading}
        >
          Enregistrer
        </Button>
      </ModalFooter>
    </>
  );
};

const SectionContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <section aria-labelledby={title} className="space-y-6">
      <div className="space-y-2">
        <Typography as="h3" className="text-gray-400">
          {title}
        </Typography>
        <Separator />
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
};

export { AddProfileModal };
