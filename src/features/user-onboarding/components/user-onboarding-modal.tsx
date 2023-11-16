import { profilesDescription } from '@/constants';
import { imageSchema } from '@/validations';
import { ProfileType } from '@prisma/client';
import { CameraIcon } from 'lucide-react';
import { s } from 'msw/lib/glossary-de6278a9';
import { signOut } from 'next-auth/react';
import React, { type FC, type ReactNode, useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { z } from 'zod';

import { PlacesAutocomplete } from '@/components/agorasafe-map';
import { FixedFooterContainer } from '@/components/fixed-footer-container';
import { LogoIcon } from '@/components/icons/logo-icon';
import { WelcomeIcon } from '@/components/icons/welcome-icon';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { FileUpload } from '@/components/ui/file-upload';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CenterContent } from '@/components/ui/layout';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { modals } from '@/components/ui/modal';
import { PhoneInput } from '@/components/ui/phone-input';
import { ProgressBar } from '@/components/ui/progress-bar';
import { RadioGroup } from '@/components/ui/radio-group';
import { Editor } from '@/components/ui/rich-text-editor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionMessage } from '@/components/ui/section-message';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { useUpload } from '@/components/ui/uploadthing';

import { api } from '@/utils/api';
import { getCompletionPercentage } from '@/utils/misc';
import { getIsFaceToFaceLabel, getIsRemoteLabel } from '@/utils/profile';
import { isArrayOfFile } from '@/utils/type-guards';

import { htmlParse } from '@/lib/html-helper';
import { cn } from '@/lib/utils';

import {
  onboardClientProfileSchema,
  onboardProviderProfileSchema,
} from '@/server/api/modules/users/users.validations';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useStepper } from '@/hooks/use-stepper';

interface UserOnboardingModalProps {
  className?: string;
}

const onboardingSteps = [
  {
    title: "Politique de Confidentialité et Conditions d'utilisation",
    description:
      "Veuillez prendre le temps de lire et d'accepter nos conditions d'utilisation.",
    isBeta: false,
  },
  {
    title: 'Choix du type de profil',
    description:
      'Choisissez le type de profil avec lequel vous souhaitez démarrer.',
    isBeta: false,
  },
  {
    title: 'Informations du profil',
    description: 'Vérifiez et complétez les informations de votre profil',
    isBeta: false,
    infoMessage:
      'Vous pourrez modifier ces informations à tout moment dans vos paramètres.',
  },
];

const UserOnboardingModal: FC<UserOnboardingModalProps> = () => {
  const { session } = useCurrentUser();
  const [choosedProfileType, setChoosedProfileType] =
    useState<ProfileType | null>(null);

  const newUser = session?.user;
  const onboarded = {
    tos: !!newUser?.tos,
    profileType: newUser?.onboardingComplete,
    profileDetails: newUser?.onboardingComplete,
  };

  const { step, nextStep, prevStep } = useStepper(
    Number(Object.values(onboarded).indexOf(false)) + 1
  );
  const stepsCount = Object.values(onboarded).length;

  const currentIdx = step - 1;

  const progress = getCompletionPercentage(
    Object.values(onboarded),
    Number(step > -1 ? step : 1) - 1
  );

  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden">
      <div className="">
        <ProgressBar progress={progress} />
        <CenterContent className=" mt-2 w-full max-w-3xl lg:min-w-[38rem] lg:items-start lg:justify-start">
          <div className="my-2 flex w-full flex-col items-center justify-center space-y-1 lg:my-4">
            <LogoIcon className="mg:h-6 h-5 w-auto" />
            {/* <Typography variant="small" className="text-center md:text-left">
              Bienvenue {newUser?.name} ! Configurons ensemble votre compte.
            </Typography> */}
          </div>
          <Typography as="h1" variant="h4" className="my-3 text-brand-600">
            Étape {step} / {stepsCount}
          </Typography>
          <Typography as="h2">{onboardingSteps[currentIdx]?.title}</Typography>
          <Typography
            variant="subtle"
            className="pb-2 text-center md:text-left"
          >
            {onboardingSteps[currentIdx]?.description}
          </Typography>
        </CenterContent>
      </div>
      <ScrollArea className="h-full flex-1 pb-20 pt-2">
        <CenterContent className="container w-full max-w-3xl lg:min-w-[38rem]">
          <div className="w-full">
            {onboardingSteps[currentIdx]?.infoMessage && (
              <SectionMessage
                classNames={{
                  root: 'bg-blue-50',
                  icon: 'text-blue-600',
                  title: 'text-blue-800',
                  description: 'text-blue-700',
                }}
                appareance="info"
                hasCloseButton={false}
                title={onboardingSteps[currentIdx]?.infoMessage}
              />
            )}
            <Card>
              <Card.Content className="h-full py-6">
                {step === 1 && <TermsSection nextStep={nextStep} />}
                {step === 2 && (
                  <ProfileChoiceSection
                    choosedProfileType={choosedProfileType}
                    onHandleNext={profileType => {
                      setChoosedProfileType(profileType);
                      nextStep();
                    }}
                  />
                )}
                {step === 3 && (
                  <ProfileDetailsSection
                    prevStep={prevStep}
                    choosedProfileType={choosedProfileType}
                  />
                )}
              </Card.Content>
            </Card>
          </div>
        </CenterContent>
      </ScrollArea>
    </div>
  );
};

const TermsSection = ({ nextStep }: { nextStep: () => void }) => {
  const {
    data: terms,
    error,
    isInitialLoading: isTermsLoading,
  } = api.contents.get.useQuery({ slug: 'tos' });

  const { mutate: acceptTOSMutate, isLoading: isAcceptTOSLoading } =
    api.users.acceptTOS.useMutation();

  const { updateUser } = useCurrentUser();
  const { ref, inView: isInView } = useInView();

  const handleAcceptTOS = () => {
    acceptTOSMutate(undefined, {
      async onSuccess() {
        await updateUser();
        nextStep();
      },
    });
  };

  return (
    <>
      <LoadingOverlay visible={isAcceptTOSLoading} />

      <AsyncWrapper error={error} isLoading={isTermsLoading}>
        <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose prose-sm">
          {terms?.content}
        </ReactMarkdown>
        <div ref={ref} className="mt-3" />
        <FixedFooterContainer className="items-start">
          <CancelButton showWarning>Je refuse</CancelButton>
          <Button
            size="lg"
            disabled={!isInView}
            isLoading={isAcceptTOSLoading}
            onClick={handleAcceptTOS}
          >
            J'accepte
          </Button>
        </FixedFooterContainer>
      </AsyncWrapper>
    </>
  );
};

const ProfileChoiceSection = ({
  onHandleNext,
  choosedProfileType,
}: {
  onHandleNext: (profileType: ProfileType) => void;
  choosedProfileType: ProfileType | null;
}) => {
  const form = useZodForm({
    defaultValues: {
      profileType: choosedProfileType,
    },
  });

  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const watchProfileType = watch('profileType') as ProfileType;

  const onSubmit = (formData: { profileType: ProfileType }) => {
    onHandleNext(formData?.profileType);
  };

  return (
    <>
      <Form onSubmit={onSubmit} form={form}>
        <Controller
          name="profileType"
          control={control}
          defaultValue={ProfileType.PROVIDER}
          render={({ field }) => (
            <RadioGroup
              required
              onValueChange={field.onChange}
              defaultValue={field.value as never}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {Object.entries(profilesDescription).map(([key, value]) => (
                <Label
                  key={key}
                  className={cn(
                    'flex items-center gap-2 rounded-md border p-4 shadow transition duration-300 hover:bg-zinc-100',
                    field.value === key &&
                      'shadow-brand-500 ring-2 ring-brand-500'
                  )}
                  htmlFor={key}
                >
                  <RadioGroup.Item value={key} id={key} />
                  <div>
                    <Typography as="h4">{value.label}</Typography>
                    <Typography variant="small" className="font-normal">
                      {value.description}
                    </Typography>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          )}
        />
        <FixedFooterContainer className="items-start">
          <CancelButton>Me déconnecter</CancelButton>
          <Button size="lg" type="submit" disabled={!watchProfileType}>
            Suivant
          </Button>
        </FixedFooterContainer>
      </Form>
    </>
  );
};

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

const ProfileDetailsSection = ({
  prevStep,
  choosedProfileType,
}: {
  prevStep: () => void;
  choosedProfileType: ProfileType | null;
}) => {
  const { session, updateUser, updateProfile } = useCurrentUser();

  const queryUtils = api.useContext();

  const { data: skills, isInitialLoading: isSkillsLoading } =
    api.skills.getAll.useQuery();

  const {
    mutate,
    isLoading: isOnboardingLoading,
    error: onboardingError,
  } = api.users.completeUserOnboarding.useMutation({
    async onSuccess(data) {
      await updateUser();
      // await invalidateModeratedContent(queryUtils);
      updateProfile(data?.profile);
      modals.open({
        children: (
          <div className="flex flex-col justify-center p-10">
            <WelcomeIcon className="h-36 w-auto" />
            <div className="mt-6 flex flex-col items-center justify-center text-center">
              <Typography variant="h2">
                Bienvenue {data?.profile?.name} !🎉🥳
              </Typography>
              <Typography variant="subtle" className="mt-2">
                Nous sommes content de vous compter parmi nous, sur Agorasafe.
                N'hésitez pas à nous faire vos retours via l'onglet{' '}
                <strong>feedback</strong> afin que nous puissions améliorer
                votre expérence.
              </Typography>
              <Button
                onClick={() => modals.closeAll()}
                className="mt-10 w-auto"
              >
                D'accord, j'ai compris
              </Button>
            </div>
          </div>
        ),
      });
      toast({
        delay: 4_000,
        title: htmlParse(data?.message),
        variant: 'success',
      });
    },
  });

  const form = useZodForm({
    schema,
  });

  const { control, reset } = form;

  const { startUpload, isUploading } = useUpload({
    endpoint: 'profilePhotos',
  });

  useEffect(() => {
    reset({
      name: session?.user?.name,
    });
  }, [reset, session?.user]);

  if (!choosedProfileType) return null;

  const profileInfo = profilesDescription[choosedProfileType];

  if (!profileInfo) return null;

  const isProvider = choosedProfileType === 'PROVIDER';
  const isLoading = isUploading || isOnboardingLoading;

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
        avatar: userAvatar ?? (session?.user?.avatar as never),
        skillsId: skills?.map(skill => skill.value),
      });
    } else {
      const { avatar, ...rest } = formData;
      mutate({
        ...rest,
        avatar: userAvatar ?? session?.user?.avatar,
      });
    }
  };

  return (
    <>
      {onboardingError && (
        <SectionMessage appareance="danger" title={onboardingError?.message} />
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
                          alt={session?.user?.name || 'preview avatar'}
                          src={
                            files[0]?.preview ||
                            session?.user?.avatar ||
                            undefined
                          }
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
                  render={({ field: { ref, onChange, value }, fieldState }) => (
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
                      placeholder="Choisissez vos engagements client..."
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

        <FixedFooterContainer className="items-start">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={prevStep}
          >
            Retour
          </Button>
          <Button size="lg" type="submit" isLoading={isLoading}>
            Enregistrer
          </Button>
        </FixedFooterContainer>
      </Form>
    </>
  );
};

const CancelButton = ({
  children,
  showWarning,
  ...props
}: ButtonProps & { showWarning?: boolean }) => {
  const handleCancelOnboarding = () => void signOut();

  return (
    <div className="">
      <Button
        {...props}
        variant="outline"
        type="button"
        className={cn(showWarning && 'w-[160px]')}
        onClick={handleCancelOnboarding}
      >
        {children}
      </Button>
      {showWarning && (
        <Typography variant="small">Vous serez déconnecté.</Typography>
      )}
    </div>
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
      <div className="space-y-3">
        <Typography as="h2" className="text-brand-600">
          {title}
        </Typography>
        <Separator />
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
};
export { UserOnboardingModal };
