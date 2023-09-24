import { type InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { z } from 'zod';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { CenterContent } from '@/components/ui/layout';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SectionMessage } from '@/components/ui/section-message';
import { Seo } from '@/components/ui/seo';
import { useToast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';

import {
  AddressForm,
  BasicInfoForm,
  DateForm,
  NumberHoursForm,
  PhoneForm,
  PhotosForm,
  StartHourForm,
  publishServiceSteps,
} from '@/features/services';
import { useCreateServiceRequest } from '@/features/services';
import { type PublishServiceRequestInputs } from '@/features/services';

import { getCompletionPercentage } from '@/utils/misc';

import { createServerSideProps } from '@/server/utils/server-side';

import { useStepper } from '@/hooks/use-stepper';

const totalStepCount = publishServiceSteps?.length;

const meta = {
  title: 'Publier une demande de service',
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
    projets, consulter vos candidatures, rechercher des prestataires
    ou des demandes de service, etc.`,
};

const PublishPage = ({
  modeQuery,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { step: currentStep, nextStep, prevStep } = useStepper();
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading, error, mutate } = useCreateServiceRequest({
    onSuccess(data) {
      const href = `/service-requests/${data?.serviceRequest?.slug}`;

      toast({
        delay: 4000,
        variant: 'success',
        title: 'Demande de service publiée',
        description:
          'Votre demande de service a bien été publiée auprès des prestaires',
      });
      void router.push(href);
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

  const onSubmit = (data: PublishServiceRequestInputs) => {
    mutate({
      ...data,
      numberOfProviderNeeded: 2,
      estimatedPrice: 26500,
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
          <NumberHoursForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 3:
        return (
          <DateForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 4:
        return (
          <StartHourForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 5:
        return (
          <AddressForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 6:
        return (
          <PhoneForm
            {...{
              nextStep,
              prevStep,
            }}
          />
        );
      case 7:
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
        <CenterContent className="container w-full min-w-[38rem] max-w-2xl pb-12">
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

    const modeQuery = result.data.mode;

    return { props: { modeQuery } };
  },
});

PublishPage.getLayout = (page: React.ReactElement) => page;

export default PublishPage;
