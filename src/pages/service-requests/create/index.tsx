import { useRouter } from 'next/router';
import { z } from 'zod';

import { Header } from '@/components/header';
import { Welcome2Icon } from '@/components/icons/welcome2-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { CenterContent } from '@/components/ui/layout';
import { modals } from '@/components/ui/modal';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionMessage } from '@/components/ui/section-message';
import { Seo } from '@/components/ui/seo';
import { useToast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';

import {
  AddressForm,
  BasicInfoForm,
  type CreateServiceRequestInputs,
  DateForm,
  NumberHoursForm,
  PhoneForm,
  PhotosForm,
  ProviderNumberForm,
  StartHourForm,
  publishServiceSteps,
  usePublishServiceRequest,
} from '@/features/service-requests';

import { api } from '@/utils/api';
import { getCompletionPercentage } from '@/utils/misc';

import { createServerSideProps } from '@/server/utils/server-side';

import { useStepper } from '@/hooks/use-stepper';

const totalStepCount = publishServiceSteps.length;

const meta = {
  title: 'Créer une demande de service',
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
    projets, consulter vos candidatures, rechercher des prestataires
    ou des demandes de service, etc.`,
};

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const PublishPage = ({ modeQuery }: PageProps) => {
  const { step: currentStep, nextStep, prevStep } = useStepper();
  const { toast } = useToast();
  const router = useRouter();
  const { reset } = usePublishServiceRequest();

  const { isLoading, error, mutate } = api.serviceRequests.create.useMutation({
    async onSuccess(data) {
      reset();
      const href = `/service-requests/${data?.serviceRequest?.id}/${data?.serviceRequest?.slug}`;
      await router.push(href, undefined, { shallow: true });
      modals.open({
        children: (
          <EmptyState
            classNames={{ root: 'my-24', icon: 'h-36 w-auto' }}
            icon={<Welcome2Icon />}
            name="🎉🥳 Demande publiée avec succès"
            description={`Votre demande " ${data?.serviceRequest?.title} " a bien été publiée au près des prestataires !`}
          />
        ),
      });
    },
    onError(error) {
      toast({
        variant: 'danger',
        title: "Une erreur s'est produite",
        description: error?.message,
      });
    },
  });

  const progress = getCompletionPercentage(
    publishServiceSteps,
    currentStep - 1
  );

  const onSubmit = (data: CreateServiceRequestInputs) => {
    mutate({
      ...data,
      numberOfProviderNeeded: Number(data?.numberOfProviderNeeded),
    });
  };

  const renderStepForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoForm
            {...{
              nextStep,
            }}
          />
        );
      case 2:
        return (
          <ProviderNumberForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 3:
        return (
          <NumberHoursForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 4:
        return (
          <DateForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 5:
        return (
          <StartHourForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 6:
        return (
          <AddressForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 7:
        return (
          <PhoneForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 8:
        return (
          <PhotosForm
            {...{
              onSubmit,
              isLoading,
              prevStep,
            }}
          />
        );
      default:
        return (
          <BasicInfoForm
            {...{
              nextStep,
            }}
          />
        );
    }
  };

  return (
    <>
      <Seo title={meta.title} description={meta.description} />
      <div className="flex h-full min-h-screen w-full flex-1 flex-col pb-36">
        <Header>
          <ProgressBar progress={progress} />
        </Header>
        <CenterContent className="max-w-3xl pb-12 md:min-w-[38rem]">
          <div className="w-full">
            <Typography as="h1" variant="h4" className="pb-6 text-brand-600">
              Étape {currentStep} / {totalStepCount}
            </Typography>
            <Card>
              <Card.Header>
                <Card.Title className="text-xl">
                  {currentStep === 1 && modeQuery === 'normal'
                    ? 'Avez-vous des précisions à apporter ?'
                    : publishServiceSteps[currentStep - 1]?.title}
                </Card.Title>
                {error && (
                  <SectionMessage title={error.message} appareance="danger" />
                )}
                {/* <Card.Description>
                {publishServiceSteps[currentStep - 1]?.description}
              </Card.Description> */}
              </Card.Header>
              <Card.Content>{renderStepForm()}</Card.Content>
            </Card>
          </div>
        </CenterContent>
      </div>
    </>
  );
};

const querySchema = z.object({
  category: z.string(),
  title: z.string().optional(),
  mode: z.enum(['normal', 'custom']),
});

export const getServerSideProps = createServerSideProps({
  resolver: ({ ctx, profile }) => {
    const result = querySchema.safeParse(ctx.query);

    if (!profile || !result.success) return { notFound: true };

    if (profile.type === 'PROVIDER') return { notFound: true };

    const modeQuery = result.data.mode;

    return { props: { modeQuery } };
  },
});

PublishPage.getLayout = (page: React.ReactElement) => page;

export default PublishPage;
