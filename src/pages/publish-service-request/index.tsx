import { type InferGetServerSidePropsType } from 'next';
import { z } from 'zod';

import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { CenterContent } from '@/components/ui/layout';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Seo } from '@/components/ui/seo';
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

import { getCompletionPercentage } from '@/utils/misc';
import { getIsCustomer } from '@/utils/profile';

import { createServerSideProps } from '@/server/utils/server-side';

import { useCatchNavigation } from '@/hooks/use-catch-navigation';
import { useStepper } from '@/hooks/use-stepper';

const totalStepCount = publishServiceSteps?.length;

type RenderStepFormProps = {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
};

const renderStepForm = ({
  currentStep,
  nextStep,
  prevStep,
}: RenderStepFormProps) => {
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

const meta = {
  title: 'Publier une demande de service',
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
    projets, consulter vos candidatures, rechercher des prestataires
    ou des demandes de service, etc.`,
};

const PublishPage = ({
  modeQuery,
  categorySlugQuery,
  titleQuery,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { step: currentStep, nextStep, prevStep } = useStepper();
  const progress = getCompletionPercentage(
    publishServiceSteps,
    currentStep - 1
  );

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
                {/* <Card.Description>
                {publishServiceSteps[currentStep - 1]?.description}
              </Card.Description> */}
              </Card.Header>
              <Card.Content>
                {renderStepForm({ currentStep, nextStep, prevStep })}
              </Card.Content>
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

    // if (!profile || !result.success) return { notFound: true };
    if (!result.success) return { notFound: true };

    // const isCustomer = getIsCustomer(profile?.type);

    // if (!isCustomer) return { notFound: true };

    const categorySlugQuery = result.data.category;
    const modeQuery = result.data.mode;
    const titleQuery = result.data.title ?? null;

    return { props: { categorySlugQuery, modeQuery, titleQuery } };
  },
});

export default PublishPage;
